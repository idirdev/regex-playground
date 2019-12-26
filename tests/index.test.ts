import { describe, it, expect } from 'vitest';
import { safeRegexExec, buildHighlightedText } from '../src/lib/regex-engine';
import { presetPatterns, getCategories } from '../src/lib/patterns';

describe('safeRegexExec', () => {
  it('returns empty result for null/undefined pattern', () => {
    const result = safeRegexExec(null as unknown as string, 'g', 'hello');
    expect(result.matches).toEqual([]);
    expect(result.matchCount).toBe(0);
    expect(result.error).toBeNull();
  });

  it('matches at every position for empty string pattern', () => {
    const result = safeRegexExec('', 'g', 'hello');
    // empty regex matches at each position: 0,1,2,3,4,5 => 6 matches for "hello"
    expect(result.matchCount).toBe(6);
    expect(result.error).toBeNull();
  });

  it('finds a single match without global flag', () => {
    const result = safeRegexExec('hello', '', 'hello world hello');
    expect(result.matchCount).toBe(1);
    expect(result.matches[0].fullMatch).toBe('hello');
    expect(result.matches[0].index).toBe(0);
    expect(result.matches[0].endIndex).toBe(5);
    expect(result.error).toBeNull();
  });

  it('finds all matches with global flag', () => {
    const result = safeRegexExec('\\d+', 'g', 'abc 123 def 456');
    expect(result.matchCount).toBe(2);
    expect(result.matches[0].fullMatch).toBe('123');
    expect(result.matches[1].fullMatch).toBe('456');
    expect(result.error).toBeNull();
  });

  it('captures groups', () => {
    const result = safeRegexExec('(\\w+)@(\\w+)', '', 'user@example');
    expect(result.matchCount).toBe(1);
    expect(result.matches[0].groups).toHaveLength(2);
    expect(result.matches[0].groups[0].value).toBe('user');
    expect(result.matches[0].groups[1].value).toBe('example');
  });

  it('captures named groups', () => {
    const result = safeRegexExec('(?<name>\\w+)@(?<domain>\\w+)', '', 'user@example');
    expect(result.matches[0].namedGroups).toEqual({ name: 'user', domain: 'example' });
  });

  it('returns error for invalid pattern', () => {
    const result = safeRegexExec('[invalid', '', 'test');
    expect(result.error).toBeTruthy();
    expect(result.matchCount).toBe(0);
  });

  it('returns no match when pattern does not match', () => {
    const result = safeRegexExec('xyz', '', 'hello');
    expect(result.matchCount).toBe(0);
    expect(result.error).toBeNull();
  });

  it('handles zero-length matches without infinite loop', () => {
    const result = safeRegexExec('', 'g', 'abc');
    expect(result.matchCount).toBe(4); // matches at each position plus end
    expect(result.error).toBeNull();
  });

  it('respects maxMatches limit', () => {
    const result = safeRegexExec('.', 'g', 'abcdefghij', 3);
    expect(result.matchCount).toBe(3);
  });

  it('reports execution time', () => {
    const result = safeRegexExec('\\d+', 'g', '123 456');
    expect(result.executionTime).toBeGreaterThanOrEqual(0);
  });
});

describe('buildHighlightedText', () => {
  it('returns escaped text when no matches', () => {
    const result = buildHighlightedText('<div>hello</div>', []);
    expect(result).toBe('&lt;div&gt;hello&lt;/div&gt;');
  });

  it('wraps matches in mark elements', () => {
    const matches = [{ fullMatch: 'hello', index: 0, endIndex: 5, groups: [], namedGroups: {} }];
    const result = buildHighlightedText('hello world', matches);
    expect(result).toContain('<mark class="match-highlight">hello</mark>');
    expect(result).toContain(' world');
  });

  it('handles multiple matches', () => {
    const matches = [
      { fullMatch: 'a', index: 0, endIndex: 1, groups: [], namedGroups: {} },
      { fullMatch: 'c', index: 2, endIndex: 3, groups: [], namedGroups: {} },
    ];
    const result = buildHighlightedText('abc', matches);
    expect(result).toBe('<mark class="match-highlight">a</mark>b<mark class="match-highlight">c</mark>');
  });
});

describe('presetPatterns', () => {
  it('contains preset patterns with required fields', () => {
    expect(presetPatterns.length).toBeGreaterThan(0);
    for (const p of presetPatterns) {
      expect(p.name).toBeTruthy();
      expect(p.pattern).toBeTruthy();
      expect(p.category).toBeTruthy();
    }
  });

  it('contains an email pattern', () => {
    const email = presetPatterns.find(p => p.name === 'Email');
    expect(email).toBeDefined();
    expect(email!.flags).toContain('g');
  });
});

describe('getCategories', () => {
  it('returns unique categories', () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories).size).toBe(categories.length);
  });

  it('includes Common category', () => {
    expect(getCategories()).toContain('Common');
  });
});
