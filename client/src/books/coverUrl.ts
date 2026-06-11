export function upgradeCoverUrl(url: string | null): string | null {
  if (!url || !url.includes('books.google')) return url;
  return url
    .replace(/^http:\/\//, 'https://')
    .replace('&edge=curl', '')
    .replace('zoom=1', 'zoom=0');
}
