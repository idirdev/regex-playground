export interface PresetPattern {
  name: string;
  pattern: string;
  flags: string;
  description: string;
  example: string;
  category: string;
}

export const presetPatterns: PresetPattern[] = [
  {
    name: "Email",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: "gi",
    description: "Matches standard email addresses",
    example: "user@example.com",
    category: "Common",
  },
  {
    name: "URL",
    pattern: "https?:\\/\\/[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+",
    flags: "gi",
    description: "Matches HTTP and HTTPS URLs",
    example: "https://example.com/path?q=test",
    category: "Common",
  },
  {
    name: "Phone (US)",
    pattern: "\\+?1?[\\s.-]?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}",
    flags: "g",
    description: "Matches US phone numbers in various formats",
    example: "(555) 123-4567",
    category: "Common",
  },
  {
    name: "Date (YYYY-MM-DD)",
    pattern: "\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])",
    flags: "g",
    description: "Matches ISO 8601 date format",
    example: "2026-03-05",
    category: "Common",
  },
  {
    name: "IPv4 Address",
    pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b",
    flags: "g",
    description: "Matches valid IPv4 addresses",
    example: "192.168.1.1",
    category: "Network",
  },
  {
    name: "Hex Color",
    pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b",
    flags: "gi",
    description: "Matches 3 or 6 digit hex color codes",
    example: "#ff5733 or #abc",
    category: "Code",
  },
  {
    name: "HTML Tag",
    pattern: "<\\/?([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>",
    flags: "g",
    description: "Matches HTML opening and closing tags",
    example: "<div class=\"test\">",
    category: "Code",
  },
  {
    name: "UUID",
    pattern: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
    flags: "gi",
    description: "Matches standard UUID format",
    example: "550e8400-e29b-41d4-a716-446655440000",
    category: "Code",
  },
  {
    name: "Password Strength",
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    flags: "",
    description: "At least 8 chars, upper, lower, digit, special",
    example: "Str0ng!Pass",
    category: "Validation",
  },
  {
    name: "CSV Line",
    pattern: "(?:\"[^\"]*\"|[^,\\n]*)(?:,(?:\"[^\"]*\"|[^,\\n]*))*",
    flags: "gm",
    description: "Matches CSV rows with quoted fields",
    example: 'name,"city, state",age',
    category: "Data",
  },
];

export function getCategories(): string[] {
  const cats = new Set(presetPatterns.map((p) => p.category));
  return Array.from(cats);
}
