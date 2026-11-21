/**
 * Konversi berbagai format link Google Drive menjadi URL thumbnail
 * yang bisa dirender langsung di <img>.
 *
 * Support:
 *  - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *  - https://drive.google.com/open?id=FILE_ID
 *  - https://drive.google.com/uc?id=FILE_ID&export=download
 *  - https://drive.google.com/thumbnail?id=FILE_ID
 *
 * Link non-GDrive (Cloudinary, Imgur, dll) dikembalikan apa adanya.
 */
export function convertGDriveUrl(input?: string | null): string | undefined {
  if (!input) return undefined;
  const url = String(input).trim();
  if (!url) return undefined;

  if (!url.includes("drive.google.com") && !url.includes("docs.google.com")) {
    return url; // bukan GDrive — biarkan
  }

  const patterns = [
    /\/file\/d\/([-\w]{20,})/,
    /\/d\/([-\w]{20,})/,
    /[?&]id=([-\w]{20,})/,
    /\/thumbnail\?id=([-\w]{20,})/,
  ];

  for (const p of patterns) {
    const m = url.match(p);
    if (m && m[1]) {
      return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1200`;
    }
  }

  return url;
}