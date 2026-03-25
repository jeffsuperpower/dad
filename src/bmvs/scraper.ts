import https from 'https';
import http from 'http';

export interface BmvsLocation {
  name: string;
  address: string;
  firstAvailable: string; // e.g. "Thursday 02/04/2026 08:45 AM"
  locationId: string;
}

/**
 * Simple cookie jar that accumulates cookies across requests/redirects.
 */
class CookieJar {
  private cookies: Record<string, string> = {};

  update(resHeaders: http.IncomingHttpHeaders): void {
    const setCookies = resHeaders['set-cookie'] || [];
    for (const c of setCookies) {
      const [pair] = c.split(';');
      const eqIdx = pair.indexOf('=');
      if (eqIdx > 0) {
        const name = pair.substring(0, eqIdx).trim();
        const value = pair.substring(eqIdx + 1).trim();
        this.cookies[name] = value;
      }
    }
  }

  toString(): string {
    return Object.entries(this.cookies).map(([k, v]) => `${k}=${v}`).join('; ');
  }
}

/**
 * Fetch a URL with cookie jar support. Follows redirects automatically.
 */
function fetchUrl(
  url: string,
  opts: { method?: string; headers?: Record<string, string>; body?: string },
  jar: CookieJar,
  maxRedirects = 5,
): Promise<{ body: string; statusCode: number }> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const transport = parsedUrl.protocol === 'https:' ? https : http;

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      ...opts.headers,
      'Cookie': jar.toString(),
    };

    const req = transport.request(parsedUrl, {
      method: opts.method || 'GET',
      headers,
    }, (res) => {
      jar.update(res.headers);

      // Follow redirects (GET only for safety)
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (maxRedirects <= 0) {
          reject(new Error('Too many redirects'));
          return;
        }
        res.resume(); // Drain the response
        const redirectUrl = new URL(res.headers.location, url).toString();
        fetchUrl(redirectUrl, { method: 'GET' }, jar, maxRedirects - 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          body: Buffer.concat(chunks).toString('utf-8'),
          statusCode: res.statusCode || 0,
        });
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

/**
 * Extract all <input> form fields from HTML.
 */
function extractFormFields(html: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const re = /<input[^>]+>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const tag = match[0];
    const nameM = tag.match(/name="([^"]*)"/);
    const valueM = tag.match(/value="([^"]*)"/);
    if (nameM) {
      fields[nameM[1]] = valueM ? valueM[1] : '';
    }
  }
  return fields;
}

const BASE_URL = 'https://bmvs.onlineappointmentscheduling.net.au/oasis';

/**
 * Scrape BMVS for NSW appointment availability.
 *
 * Flow:
 * 1. GET Default.aspx to get session cookies + ASP.NET tokens
 * 2. POST Default.aspx to click "New Individual booking" (redirects to Location.aspx)
 * 3. POST Location.aspx with state=NSW, suburb=Sydney to search
 * 4. Parse location rows for availability
 */
export async function scrapeBmvsAppointments(suburb: string = 'Sydney', state: string = 'NSW'): Promise<BmvsLocation[]> {
  const jar = new CookieJar();

  // Step 1: GET Default.aspx
  const step1 = await fetchUrl(`${BASE_URL}/Default.aspx`, {}, jar);
  const defaultFields = extractFormFields(step1.body);

  // Step 2: POST to click "New Individual booking" (redirects to Location.aspx)
  const step2Body = new URLSearchParams({
    '__EVENTTARGET': 'ctl00$ContentPlaceHolder1$btnInd',
    '__EVENTARGUMENT': '',
    '__VIEWSTATE': defaultFields['__VIEWSTATE'] || '',
    '__VIEWSTATEGENERATOR': defaultFields['__VIEWSTATEGENERATOR'] || '',
    '__EVENTVALIDATION': defaultFields['__EVENTVALIDATION'] || '',
  }).toString();

  const step2 = await fetchUrl(`${BASE_URL}/Default.aspx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: step2Body,
  }, jar);

  // step2 should now be Location.aspx (after redirect)
  if (!step2.body.includes('ddlState')) {
    throw new Error('Failed to reach Location.aspx after clicking Individual booking');
  }

  // Step 3: POST Location.aspx with search params
  const locationFields = extractFormFields(step2.body);

  const step3Body = new URLSearchParams({
    '__EVENTTARGET': '',
    '__EVENTARGUMENT': '',
    '__VIEWSTATE': locationFields['__VIEWSTATE'] || '',
    '__VIEWSTATEGENERATOR': locationFields['__VIEWSTATEGENERATOR'] || '',
    '__EVENTVALIDATION': locationFields['__EVENTVALIDATION'] || '',
    'ctl00$ContentPlaceHolder1$SelectLocation1$txtSuburb': suburb,
    'ctl00$ContentPlaceHolder1$SelectLocation1$ddlState': state,
    'ctl00$ContentPlaceHolder1$SelectLocation1$btnSearch': 'search',
    'ctl00$ContentPlaceHolder1$SelectLocation1$hdnSearchCoord': '',
    'ctl00$ContentPlaceHolder1$hdnLocationID': '',
  }).toString();

  const step3 = await fetchUrl(`${BASE_URL}/Location.aspx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: step3Body,
  }, jar);

  // Step 4: Parse location rows
  return parseLocations(step3.body);
}

/**
 * Parse location rows from the results HTML.
 */
function parseLocations(html: string): BmvsLocation[] {
  const locations: BmvsLocation[] = [];

  const rowRegex = /<tr[^>]*class="trlocation"[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const row = rowMatch[1];

    // Extract location name
    const nameMatch = row.match(/class="tdlocNameTitle"[^>]*>([^<]+)/);
    const name = nameMatch ? nameMatch[1].trim() : '';

    // Extract address
    const addressMatch = row.match(/class="tdloc_name"[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/);
    let address = '';
    if (addressMatch) {
      address = addressMatch[1].replace(/<br\s*\/?>/gi, ', ').replace(/<[^>]+>/g, '').trim();
    }

    // Extract location ID from radio button
    const idMatch = row.match(/name="rbLocation"\s+value="(\d+)"/);
    const locationId = idMatch ? idMatch[1] : '';

    // Extract first available date
    const availMatch = row.match(/class="tdloc_availability"[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/);
    let firstAvailable = '';
    if (availMatch) {
      firstAvailable = availMatch[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim();
    }

    if (name) {
      locations.push({ name, address, firstAvailable, locationId });
    }
  }

  return locations;
}
