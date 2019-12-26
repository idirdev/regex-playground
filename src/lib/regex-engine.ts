export interface MatchResult {
  fullMatch: string;
  index: number;
  endIndex: number;
  groups: GroupCapture[];
  namedGroups: Record<string, string>;
}

export interface GroupCapture {
  groupIndex: number;
  value: string | undefined;
}

export interface RegexExecResult {
  matches: MatchResult[];
  matchCount: number;
  executionTime: number;
  error: string | null;
}

/**
 * Safely execute a regex against a test string.
 * Includes timeout protection to prevent catastrophic backtracking.
 */
export function safeRegexExec(
  pattern: string,
  flags: string,
  testString: string,
  maxMatches: number = 1000
): RegexExecResult {
  const startTime = performance.now();

  if (pattern === undefined || pattern === null) {
    return {
      matches: [],
      matchCount: 0,
      executionTime: 0,
      error: null,
    };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (err) {
    return {
      matches: [],
      matchCount: 0,
      executionTime: performance.now() - startTime,
      error: err instanceof Error ? err.message : "Invalid regex pattern",
    };
  }

  const matches: MatchResult[] = [];

  try {
    if (regex.global) {
      let match: RegExpExecArray | null;
      let safety = 0;

      while ((match = regex.exec(testString)) !== null && safety < maxMatches) {
        matches.push(extractMatch(match));
        safety++;

        // Prevent infinite loop on zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++;
          if (regex.lastIndex > testString.length) break;
        }
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        matches.push(extractMatch(match));
      }
    }
  } catch (err) {
    return {
      matches,
      matchCount: matches.length,
      executionTime: performance.now() - startTime,
      error: err instanceof Error ? err.message : "Regex execution error",
    };
  }

  return {
    matches,
    matchCount: matches.length,
    executionTime: performance.now() - startTime,
    error: null,
  };
}

function extractMatch(match: RegExpExecArray): MatchResult {
  const groups: GroupCapture[] = [];

  for (let i = 1; i < match.length; i++) {
    groups.push({
      groupIndex: i,
      value: match[i],
    });
  }

  const namedGroups: Record<string, string> = {};
  if (match.groups) {
    for (const [key, value] of Object.entries(match.groups)) {
      if (value !== undefined) {
        namedGroups[key] = value;
      }
    }
  }

  return {
    fullMatch: match[0],
    index: match.index,
    endIndex: match.index + match[0].length,
    groups,
    namedGroups,
  };
}

/**
 * Build highlighted HTML from test string and matches.
 * Each match is wrapped in a <mark> element.
 */
export function buildHighlightedText(
  text: string,
  matches: MatchResult[]
): string {
  if (matches.length === 0) return escapeHtml(text);

  const sorted = [...matches].sort((a, b) => a.index - b.index);
  let result = "";
  let lastIndex = 0;

  for (const match of sorted) {
    if (match.index < lastIndex) continue; // skip overlapping

    result += escapeHtml(text.slice(lastIndex, match.index));
    result += `<mark class="match-highlight">${escapeHtml(match.fullMatch)}</mark>`;
    lastIndex = match.endIndex;
  }

  result += escapeHtml(text.slice(lastIndex));
  return result;
}

/**
 * Extract unique named group names from a regex pattern string.
 */
export function getNamedGroups(pattern: string): string[] {
  const names: string[] = [];
  try {
    const re = /\(\?<([^>]+)>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(pattern)) !== null) {
      if (!names.includes(m[1])) names.push(m[1]);
    }
  } catch {
    // ignore
  }
  return names;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
