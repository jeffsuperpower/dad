import https from 'https';
import http from 'http';

export interface DashboardData {
  subsActual: number;
  subsTarget: number;
  subsPct: number;
  subsEmoji: string;
  regActual: number;
  regTarget: number;
  regProjEndOfWeek: number;
  regPct: number;
  regEmoji: string;
  gap: number;
  gapPerDay: number;
  dayOfMonth: number;
  weekNumber: number;
  monthName: string;
  year: number;
}

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve, reject);
      }
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(body));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function parseNum(s: string): number {
  return parseInt(s.replace(/,/g, ''), 10);
}

function pctEmoji(pct: number): string {
  if (pct >= 98) return ':large_green_circle:';
  if (pct >= 90) return ':large_yellow_circle:';
  return ':red_circle:';
}

export async function scrapeDashboard(): Promise<DashboardData> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const dayOfMonth = now.getDate();
  const weekNumber = Math.ceil(dayOfMonth / 7);
  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;

  const url = `https://dashboard-five-sepia-57.vercel.app/?month=${monthStart}`;
  const rawHtml = await fetchUrl(url);

  // The SSR data has double-escaped JSON: \\\" instead of "
  // Unescape once so we can parse with normal regex
  const html = rawHtml.replace(/\\\\"/g, '"').replace(/\\"/g, '"');

  // Extract "March Pacing: 810 / 6,025 Members"
  const pacingMatch = html.match(/Pacing:\s*",?"(\d[\d,]*)",?" \/ ",?"(\d[\d,]*)/);
  const subsActual = pacingMatch ? parseNum(pacingMatch[1]) : 0;
  const subsTarget = pacingMatch ? parseNum(pacingMatch[2]) : 0;

  // Find current week row (W1, W2, etc)
  const currentWeek = `W${weekNumber}`;
  const weekIdx = html.indexOf(`"${currentWeek}"`);

  let regTarget = 0;
  let regActual = 0;
  let regProjEndOfWeek = 0;

  if (weekIdx > -1) {
    const weekChunk = html.slice(weekIdx, weekIdx + 3000);

    // Each pair cell has: "children":"TARGET"}]," / ",...,"children":"ACTUAL"
    const pairPattern = /"children":"(\d[\d,]*)"\}\],?" \/ ".*?"children":"(\d[\d,]*)"/g;
    const pairs: Array<[number, number]> = [];
    let m;
    while ((m = pairPattern.exec(weekChunk)) !== null) {
      pairs.push([parseNum(m[1]), parseNum(m[2])]);
    }

    // pairs[0] = sessions, pairs[1] = regs, pairs[2] = members
    if (pairs.length >= 2) {
      regTarget = pairs[1][0];
      regActual = pairs[1][1];
    }

    // Projected regs: ["~","5,247"
    const projPattern = /\["~","(\d[\d,]*)"/g;
    const projs: number[] = [];
    while ((m = projPattern.exec(weekChunk)) !== null) {
      projs.push(parseNum(m[1]));
    }
    // projs[0] = sessions proj, projs[1] = regs proj
    if (projs.length >= 2) {
      regProjEndOfWeek = projs[1];
    }
  }

  const subsPct = subsTarget > 0 ? Math.round((subsActual / subsTarget) * 1000) / 10 : 0;
  const regPct = regTarget > 0 ? Math.round((regActual / regTarget) * 1000) / 10 : 0;
  const gap = regTarget - regActual;
  const gapPerDay = dayOfMonth > 0 ? Math.ceil(gap / dayOfMonth) : 0;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    subsActual,
    subsTarget,
    subsPct,
    subsEmoji: pctEmoji(subsPct),
    regActual,
    regTarget,
    regProjEndOfWeek,
    regPct,
    regEmoji: pctEmoji(regPct),
    gap,
    gapPerDay,
    dayOfMonth,
    weekNumber,
    monthName: monthNames[month],
    year,
  };
}
