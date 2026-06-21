export function stripHtml(html: string | null): string | null {
  if (!html) return null;
  const text = new DOMParser().parseFromString(html, 'text/html').body.textContent;
  return text?.trim() || null;
}
