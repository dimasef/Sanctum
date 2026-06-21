export function coverSrc(url: string | null, zoom: number): string | null {
  if (!url) return null;
  const u = url.replace(/^http:\/\//, 'https://').replace('&edge=curl', '');
  if (!u.includes('books.google')) return u;
  return /zoom=\d+/.test(u) ? u.replace(/zoom=\d+/, `zoom=${zoom}`) : `${u}&zoom=${zoom}`;
}
