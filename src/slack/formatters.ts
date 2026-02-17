const SLACK_MAX_LENGTH = 3900; // Leave room for overhead under 4000 limit

/**
 * Convert markdown to Slack mrkdwn format.
 * Slack uses *bold*, _italic_, `code`, ```code blocks```.
 * Markdown uses **bold**, *italic*, `code`, ```code blocks```.
 */
export function markdownToSlack(text: string): string {
  // Protect code blocks from other transformations
  const codeBlocks: string[] = [];
  let processed = text.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Protect inline code
  const inlineCode: string[] = [];
  processed = processed.replace(/`[^`]+`/g, (match) => {
    inlineCode.push(match);
    return `__INLINE_CODE_${inlineCode.length - 1}__`;
  });

  // Convert **bold** to *bold*
  processed = processed.replace(/\*\*(.+?)\*\*/g, '*$1*');

  // Convert markdown headers to bold
  processed = processed.replace(/^#{1,6}\s+(.+)$/gm, '*$1*');

  // Convert [text](url) to <url|text>
  processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<$2|$1>');

  // Restore inline code
  processed = processed.replace(/__INLINE_CODE_(\d+)__/g, (_, i) => inlineCode[parseInt(i)]);

  // Restore code blocks
  processed = processed.replace(/__CODE_BLOCK_(\d+)__/g, (_, i) => codeBlocks[parseInt(i)]);

  return processed;
}

/**
 * Split a long message into chunks that fit within Slack's limit.
 * Tries to split at paragraph boundaries, then line boundaries.
 */
export function chunkMessage(text: string): string[] {
  if (text.length <= SLACK_MAX_LENGTH) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= SLACK_MAX_LENGTH) {
      chunks.push(remaining);
      break;
    }

    // Try to split at a paragraph boundary
    let splitAt = remaining.lastIndexOf('\n\n', SLACK_MAX_LENGTH);
    if (splitAt === -1 || splitAt < SLACK_MAX_LENGTH / 2) {
      // Try line boundary
      splitAt = remaining.lastIndexOf('\n', SLACK_MAX_LENGTH);
    }
    if (splitAt === -1 || splitAt < SLACK_MAX_LENGTH / 2) {
      // Hard split
      splitAt = SLACK_MAX_LENGTH;
    }

    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }

  return chunks;
}
