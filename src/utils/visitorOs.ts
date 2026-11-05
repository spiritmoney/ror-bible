export type VisitorOs = 'windows' | 'mac' | 'linux' | 'ios' | 'android' | 'other';

export type MacCpuHint = 'apple-silicon' | 'intel' | 'unknown';

function uaPlatform(): string {
  if (typeof navigator === 'undefined') return '';
  const data = (navigator as Navigator & { userAgentData?: { platform?: string } })
    .userAgentData?.platform;
  if (data) return data.toLowerCase();
  return navigator.userAgent.toLowerCase();
}

export function detectMacCpuHint(userAgent: string): MacCpuHint {
  const ua = userAgent.toLowerCase();
  if (!/macintosh|mac os x|macos/.test(ua)) return 'unknown';
  if (/aarch64|arm64|apple\s*mac/.test(ua)) return 'apple-silicon';
  if (/intel\s*mac|x86_64|wow64/.test(ua)) return 'intel';
  return 'unknown';
}

export function detectVisitorOs(
  userAgent: string,
  platformHint: string = ''
): VisitorOs {
  const platform = (platformHint || uaPlatform()).toLowerCase();
  const ua = userAgent.toLowerCase();

  if (platform.includes('win') || ua.includes('windows')) return 'windows';
  if (platform.includes('ios') || /iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  }
  if (platform.includes('android') || ua.includes('android')) return 'android';
  if (
    platform.includes('mac') ||
    ua.includes('macintosh') ||
    ua.includes('mac os x')
  ) {
    return 'mac';
  }
  if (platform.includes('linux') || ua.includes('linux')) return 'linux';

  return 'other';
}

export function readVisitorOs(): VisitorOs {
  if (typeof navigator === 'undefined') return 'other';
  const platformHint =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? '';
  const ua = navigator.userAgent;
  const base = detectVisitorOs(ua, platformHint);
  if (
    base === 'mac' &&
    navigator.maxTouchPoints > 1 &&
    /macintosh/i.test(ua)
  ) {
    return 'ios';
  }
  return base;
}
