import { isElectron } from 'utils/general';
import { resolveHostingAssetPath } from 'config/runtime';

const stripLeadingSlash = (value: string) =>
  value.startsWith('/') ? value.slice(1) : value;

export const toStrongRelativePath = (publicPath: string) => {
  const normalized = stripLeadingSlash(publicPath);
  return normalized.startsWith('HebrewGreekRes/')
    ? normalized.slice('HebrewGreekRes/'.length)
    : normalized;
};

export async function fetchPublicJson(publicPath: string): Promise<any> {
  if (isElectron() && window.electronAPI?.readStrongsJson) {
    const text = await window.electronAPI.readStrongsJson(
      toStrongRelativePath(publicPath)
    );
    return JSON.parse(text);
  }

  const url = isElectron()
    ? resolveHostingAssetPath(publicPath)
    : publicPath;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch ${url} failed ${res.status}`);
  }
  return res.json();
}
