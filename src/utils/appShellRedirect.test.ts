import { shouldAppShellRedirectMarketingRoute } from './appShellRedirect';

describe('shouldAppShellRedirectMarketingRoute', () => {
  it('still redirects features and pricing in app shell', () => {
    expect(shouldAppShellRedirectMarketingRoute('/features', '')).toBe(true);
    expect(shouldAppShellRedirectMarketingRoute('/pricing', '')).toBe(true);
    expect(shouldAppShellRedirectMarketingRoute('/products/web', '')).toBe(
      true
    );
  });

  it('does not redirect about, product, partner, or give', () => {
    expect(shouldAppShellRedirectMarketingRoute('/about', '')).toBe(false);
    expect(shouldAppShellRedirectMarketingRoute('/product', '')).toBe(false);
    expect(shouldAppShellRedirectMarketingRoute('/partner', '')).toBe(false);
    expect(shouldAppShellRedirectMarketingRoute('/give', '')).toBe(false);
  });

  it('redirects full download page but allows contact hash', () => {
    expect(shouldAppShellRedirectMarketingRoute('/download', '')).toBe(true);
    expect(shouldAppShellRedirectMarketingRoute('/download', '#contact')).toBe(
      false
    );
  });
});
