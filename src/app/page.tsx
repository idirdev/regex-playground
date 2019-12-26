"use client";

import { useState, useMemo } from "react";
import RegexInput from "@/components/RegexInput";
import {
  safeRegexExec,
  buildHighlightedText,
  getNamedGroups,
} from "@/lib/regex-engine";
import { presetPatterns, getCategories } from "@/lib/patterns";

const DEFAULT_TEST_STRING = `Hello, my email is user@example.com and my backup is admin@test.org.
Visit https://example.com or https://docs.example.com/path?q=regex for docs.
My IP is 192.168.1.100 and my date of birth is 1990-07-15.
Phone: (555) 123-4567. Color code: #ff5733. UUID: 550e8400-e29b-41d4-a716-446655440000`;

export default function HomePage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState(DEFAULT_TEST_STRING);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const result = useMemo(
    () => safeRegexExec(pattern, flags, testString),
    [pattern, flags, testString]
  );

  const highlightedHtml = useMemo(
    () => buildHighlightedText(testString, result.matches),
    [testString, result.matches]
  );

  const namedGroupNames = useMemo(() => getNamedGroups(pattern), [pattern]);

  const categories = useMemo(() => ["All", ...getCategories()], []);

  const filteredPatterns =
    selectedCategory === "All"
      ? presetPatterns
      : presetPatterns.filter((p) => p.category === selectedCategory);

  function applyPreset(p: (typeof presetPatterns)[0]) {
    setPattern(p.pattern);
    setFlags(p.flags);
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-accent/20 flex items-center justify-center">
          <span className="text-accent font-mono text-sm font-bold">/./</span>
        </div>
        <h1 className="text-lg font-semibold text-slate-100">
          Regex Playground
        </h1>
        <span className="text-xs text-slate-500 font-mono ml-1">
          — interactive regex tester
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar: pattern library */}
        <aside className="w-72 border-r border-border flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Pattern Library
            </p>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 text-xs rounded border transition-all ${
                    selectedCategory === cat
                      ? "bg-accent/20 border-accent/40 text-accent"
                      : "bg-panel border-border text-slate-500 hover:text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
            {filteredPatterns.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all group ${
                  pattern === p.pattern
                    ? "bg-accent/10 border-accent/30"
                    : "bg-panel border-border hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-200">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-slate-600 border border-border rounded px-1">
                    {p.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {p.description}
                </p>
                <p className="text-xs text-slate-600 font-mono mt-1 truncate">
                  {p.example}
                </p>
              </button>
            ))}
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Pattern input section */}
          <section className="px-6 py-4 border-b border-border">
            <RegexInput
              pattern={pattern}
              flags={flags}
              onPatternChange={setPattern}
              onFlagsChange={setFlags}
              error={result.error}
            />
          </section>

          <div className="flex flex-1 overflow-hidden">
            {/* Test string + highlight */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-border">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Test String
                </span>
                <button
                  onClick={() => setTestString("")}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  Clear
                </button>
              </div>

              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test against..."
                spellCheck={false}
                className="flex-1 bg-transparent px-4 py-3 text-sm font-mono resize-none focus:outline-none text-slate-300 leading-relaxed"
              />

              {/* Highlighted preview */}
              {result.matches.length > 0 && (
                <div className="border-t border-border px-4 py-2">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                    Highlighted
                  </p>
                  <div
                    className="text-sm font-mono leading-relaxed text-slate-300 whitespace-pre-wrap break-words max-h-32 overflow-y-auto scrollbar-thin"
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                  />
                </div>
              )}
            </div>

            {/* Results panel */}
            <div className="w-80 flex flex-col overflow-hidden shrink-0">
              {/* Stats bar */}
              <div className="px-4 py-2 border-b border-border flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      result.error
                        ? "bg-red-500"
                        : result.matchCount > 0
                        ? "bg-green-500"
                        : "bg-slate-600"
                    }`}
                  />
                  <span className="text-xs text-slate-400">
                    {result.error
                      ? "Error"
                      : result.matchCount === 0
                      ? "No matches"
                      : `${result.matchCount} match${result.matchCount !== 1 ? "es" : ""}`}
                  </span>
                </div>
                {!result.error && (
                  <span className="text-xs text-slate-600 ml-auto font-mono">
                    {result.executionTime.toFixed(2)}ms
                  </span>
                )}
              </div>

              {/* Named groups summary */}
              {namedGroupNames.length > 0 && (
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                    Named Groups
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {namedGroupNames.map((name) => (
                      <span
                        key={name}
                        className="text-xs font-mono bg-purple-500/10 border border-purple-500/30 text-purple-400 px-2 py-0.5 rounded"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Match list */}
              <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
                {result.matches.length === 0 && !result.error && (
                  <p className="text-xs text-slate-600 text-center mt-6">
                    {pattern
                      ? "No matches found"
                      : "Enter a pattern to see matches"}
                  </p>
                )}

                {result.matches.map((match, i) => (
                  <div
                    key={i}
                    className="bg-panel border border-border rounded-lg px-3 py-2 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-500 font-mono">
                        Match {i + 1}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">
                        [{match.index}–{match.endIndex}]
                      </span>
                    </div>
                    <p className="font-mono text-match bg-match-bg rounded px-1.5 py-0.5 break-all">
                      {match.fullMatch === "" ? (
                        <span className="text-slate-500 italic">
                          (empty match)
                        </span>
                      ) : (
                        match.fullMatch
                      )}
                    </p>

                    {/* Capturing groups */}
                    {match.groups.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        {match.groups.map((g) => (
                          <div key={g.groupIndex} className="flex gap-2">
                            <span className="text-slate-600 shrink-0">
                              Group {g.groupIndex}:
                            </span>
                            <span className="font-mono text-slate-300 break-all">
                              {g.value ?? (
                                <span className="text-slate-600 italic">
                                  undefined
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Named groups */}
                    {Object.keys(match.namedGroups).length > 0 && (
                      <div className="mt-1.5 space-y-1 border-t border-border pt-1.5">
                        {Object.entries(match.namedGroups).map(
                          ([name, value]) => (
                            <div key={name} className="flex gap-2">
                              <span className="text-purple-400 shrink-0">
                                {name}:
                              </span>
                              <span className="font-mono text-slate-300 break-all">
                                {value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
