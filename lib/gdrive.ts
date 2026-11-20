export function gdriveToImageUrl(link?: string): string | null {
  if (!link) return null;
  const m =
    link.match(/\/d\/([a-zA-Z0-9_-]+)/) || link.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return m
    ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1200`
    : link;
}