import { detectMacCpuHint, detectVisitorOs } from './visitorOs';

describe('detectVisitorOs', () => {
  it('detects windows', () => {
    expect(
      detectVisitorOs(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Windows'
      )
    ).toBe('windows');
  });

  it('detects mac', () => {
    expect(
      detectVisitorOs(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'macOS'
      )
    ).toBe('mac');
  });

  it('detects linux', () => {
    expect(
      detectVisitorOs('Mozilla/5.0 (X11; Linux x86_64)', 'Linux')
    ).toBe('linux');
  });

  it('detects ios', () => {
    expect(detectVisitorOs('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', 'iOS')).toBe(
      'ios'
    );
  });

  it('detects android', () => {
    expect(
      detectVisitorOs('Mozilla/5.0 (Linux; Android 14)', 'Android')
    ).toBe('android');
  });

  it('returns other for unrecognized agents', () => {
    expect(detectVisitorOs('SomeBot/1.0', 'Unknown')).toBe('other');
  });
});

describe('detectMacCpuHint', () => {
  it('detects apple silicon', () => {
    expect(
      detectMacCpuHint(
        'Mozilla/5.0 (Macintosh; arm64 Mac OS X 10_15_7) AppleWebKit/537.36'
      )
    ).toBe('apple-silicon');
  });

  it('detects intel mac', () => {
    expect(
      detectMacCpuHint(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      )
    ).toBe('intel');
  });
});
