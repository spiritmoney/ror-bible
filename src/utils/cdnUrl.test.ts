import { normalizeCdnDownloadUrl } from './cdnUrl';

describe('normalizeCdnDownloadUrl', () => {
  it('normalizes the first letter of the CDN bundle name to the correct casing', () => {
    expect(
      normalizeCdnDownloadUrl(
        'https://cdn.rorbible.plus/en/products/EnglishBiblePremium.zip'
      )
    ).toBe('https://cdn.rorbible.plus/en/products/englishBiblePremium.zip');
  });

  it('leaves the correct mixed-case CDN URL unchanged', () => {
    expect(
      normalizeCdnDownloadUrl(
        'https://cdn.rorbible.plus/en/products/englishBiblePremium.zip'
      )
    ).toBe('https://cdn.rorbible.plus/en/products/englishBiblePremium.zip');
  });
});
