import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ua-jest-d8cd03b-'));
const file = path.join(dir, 'ua-matrix.ephemeral.test.tsx');
const root = path.resolve(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')),
  '..'
);

fs.writeFileSync(
  file,
  `import { isRunningInElectron } from './electronRuntime';
import { isAppShell } from './appShell';
import * as general from './general';

function mockDisplayMode(mode: string) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: query === \`(display-mode: \${mode})\`,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

describe('ephemeral ua matrix', () => {
  it('four user agents', () => {
    const table = [
      ['chrome', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36', false, false, false],
      ['safari-ios', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1', false, false, false],
      ['ide', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Electron/28.0.0 Safari/537.36', true, false, false],
      ['packaged', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) rhapsody-bible/2.0.1 Electron/28.0.0 Safari/537.36', true, true, true],
    ];
    for (const [, ua, electronMock, run, shell] of table) {
      delete (window as Window & { electronAPI?: { isElectron?: boolean } }).electronAPI;
      Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true });
      mockDisplayMode('browser');
      jest.spyOn(general, 'isElectron').mockReturnValue(electronMock);
      if (run) window.electronAPI = { isElectron: true } as typeof window.electronAPI;
      expect(isRunningInElectron()).toBe(run);
      expect(isAppShell()).toBe(shell);
      jest.restoreAllMocks();
    }
  });
});
`
);

const link = path.join(root, 'src', 'utils', 'ua-matrix.ephemeral.test.tsx');
fs.copyFileSync(file, link);
const r = spawnSync(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['test', '--', '--watchAll=false', '--testPathPattern=ua-matrix.ephemeral'],
  { cwd: root, stdio: 'inherit', shell: true }
);
fs.rmSync(link, { force: true });
fs.rmSync(dir, { recursive: true, force: true });
process.exit(r.status ?? 1);
