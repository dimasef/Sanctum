export const COLLECTION_COLORS = [
  '#8a6118',
  '#6a4626',
  '#3f5e3a',
  '#5a3a52',
  '#3a4a5e',
  '#7a2e2e',
] as const;

export const COLLECTION_ICONS = [
  'favorite',
  'history',
  'star',
  'book',
  'public',
  'science',
  'autoAwesome',
  'bookmark',
] as const;

export type CollectionColor = (typeof COLLECTION_COLORS)[number];
export type CollectionIconKey = (typeof COLLECTION_ICONS)[number];

export function isValidColor(color: string): boolean {
  return (COLLECTION_COLORS as readonly string[]).includes(color);
}

export function isValidIcon(icon: string): boolean {
  return (COLLECTION_ICONS as readonly string[]).includes(icon);
}
