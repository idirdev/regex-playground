"use client";

import { useState } from "react";

interface RegexInputProps {
  pattern: string;
  flags: string;
  onPatternChange: (pattern: string) => void;
  onFlagsChange: (flags: string) => void;
  error: string | null;
}

const FLAG_OPTIONS = [
  { flag: "g", label: "Global", description: "Find all matches" },
  { flag: "i", label: "Case Insensitive", description: "Ignore case" },
  { flag: "m", label: "Multiline", description: "^ and $ match line boundaries" },
  { flag: "s", label: "Dotall", description: ". matches newlines" },
  { flag: "u", label: "Unicode", description: "Unicode support" },
];

export default function RegexInput({
  pattern,
  flags,
  onPatternChange,
  onFlagsChange,
  error,
}: RegexInputProps) {
  const [showHint, setShowHint] = useState(false);

  function toggleFlag(flag: string) {
    if (flags.includes(flag)) {
      onFlagsChange(flags.replace(flag, ""));
    } else {
      onFlagsChange(flags + flag);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Pattern
        </label>
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-slate-500 hover:text-accent transition-colors"
        >
          {showHint ? "Hide hints" : "Show hints"}
        </button>
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent font-mono text-lg">
          /
        </span>
        <input
          type="text"
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          placeholder="Enter regex pattern..."
          spellCheck={false}
          className={`w-full bg-panel border rounded-lg pl-7 pr-16 py-3 font-mono text-sm
            focus:outline-none focus:ring-2 transition-all
            ${error
              ? "border-red-500/50 focus:ring-red-500/30"
              : "border-border focus:ring-accent/30 focus:border-accent/50"
            }`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-accent font-mono text-lg">
          /{flags}
        </span>
      </div>

      {error && (
        <p className="text-red-400 text-xs font-mono bg-red-500/10 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {FLAG_OPTIONS.map(({ flag, label, description }) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            title={description}
            className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-all
              ${flags.includes(flag)
                ? "bg-accent/20 border-accent/40 text-accent"
                : "bg-panel border-border text-slate-500 hover:text-slate-300 hover:border-slate-600"
              }`}
          >
            {flag} <span className="font-sans text-[10px] ml-1 opacity-70">{label}</span>
          </button>
        ))}
      </div>

      {showHint && (
        <div className="bg-panel border border-border rounded-lg p-3 text-xs text-slate-400 font-mono space-y-1">
          <p><span className="text-match">\\d</span> digit &nbsp; <span className="text-match">\\w</span> word &nbsp; <span className="text-match">\\s</span> space &nbsp; <span className="text-match">.</span> any char</p>
          <p><span className="text-match">+</span> 1+ &nbsp; <span className="text-match">*</span> 0+ &nbsp; <span className="text-match">?</span> 0-1 &nbsp; <span className="text-match">{"{n,m}"}</span> range</p>
          <p><span className="text-match">^</span> start &nbsp; <span className="text-match">$</span> end &nbsp; <span className="text-match">\\b</span> boundary &nbsp; <span className="text-match">()</span> group</p>
          <p><span className="text-match">[abc]</span> class &nbsp; <span className="text-match">[^abc]</span> negated &nbsp; <span className="text-match">a|b</span> alternation</p>
          <p><span className="text-match">(?:)</span> non-capture &nbsp; <span className="text-match">(?&lt;name&gt;)</span> named &nbsp; <span className="text-match">(?=)</span> lookahead</p>
        </div>
      )}
    </div>
  );
}
