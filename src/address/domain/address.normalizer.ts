import { ADDRESS_ABBREVIATIONS } from "./address.constant";


export function normalizeAddress(input: string): {
  normalized: string;
  changed: boolean;
} {
  let normalized = input.toLowerCase().trim();
  let changed = false;

  normalized = normalized.replace(/\s+/g, ' ');

  for (const [abbr, full] of Object.entries(ADDRESS_ABBREVIATIONS)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'g');
    if (regex.test(normalized)) {
      normalized = normalized.replace(regex, full as string);
      changed = true;
    }
  }

  return { normalized, changed };
}
