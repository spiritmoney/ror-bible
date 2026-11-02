export const normalizeCdnDownloadUrl = (sourceUrl?: string): string => {
  if (!sourceUrl) return '';

  const trimmedUrl = sourceUrl.trim();
  if (!trimmedUrl) return '';

  try {
    const parsed = new URL(trimmedUrl);
    const hostname = parsed.hostname.toLowerCase();

    if (hostname.includes('rorbible.plus')) {
      const pathName = parsed.pathname;
      const lastSlashIndex = pathName.lastIndexOf('/');
      const fileName = pathName.slice(lastSlashIndex + 1);

      if (fileName && /^[A-Z]/.test(fileName)) {
        const correctedFileName =
          fileName.charAt(0).toLowerCase() + fileName.slice(1);
        parsed.pathname = `${pathName.slice(0, lastSlashIndex + 1)}${correctedFileName}`;
      }

      return parsed.toString();
    }

    return trimmedUrl;
  } catch (error) {
    return trimmedUrl;
  }
};
