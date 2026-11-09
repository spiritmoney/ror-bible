# Desktop downloads

Unsigned installers built by GitHub Actions (`.github/workflows/electron-build.yml`) or locally with `npm run electron:build` (Win + Linux on Windows hosts), `npm run electron:build:linux`, `npm run electron:build:win`, or `npm run electron:build:mac`.

## Where to get files

| Platform | Artifact name (Actions) | Typical file |
|----------|-------------------------|--------------|
| Windows | `rhapsody-bible-windows` | `Rhapsody Bible Setup 2.0.1.exe` |
| macOS | `rhapsody-bible-macos` | `Rhapsody Bible-2.0.1.dmg` (name may vary by arch) |

After a workflow run: **Actions → Electron build →** select the run → download the artifact zip.

Local Windows build output: `dist/Rhapsody Bible Setup 2.0.1.exe`  
Local macOS build output: `dist/*.dmg` (requires Mac or CI).

## Windows install

1. Download `Rhapsody Bible Setup *.exe`.
2. Run the installer (SmartScreen may warn — unsigned build).
3. Launch **Rhapsody Bible** from the Start menu; the app opens on **Bible Online**.

## macOS install

1. Download the `.dmg` from CI artifacts (or build on a Mac).
2. Open the DMG and drag **Rhapsody Bible** to Applications.
3. First launch: **Right-click → Open** if Gatekeeper blocks an unsigned app.
4. Apple Silicon: if macOS still refuses, run in Terminal (adjust path):

   ```bash
   xattr -cr "/Applications/Rhapsody Bible.app"
   ```

## UNVERIFIED

- **macOS runtime** on Apple Silicon / Intel — build is produced in CI when the workflow runs on `macos-latest`; not verified on this Windows dev machine.
- **Code signing / notarization** — only when `WIN_CSC_*` / `APPLE_*` secrets are configured in the repo; otherwise artifacts are unsigned.

Regenerate icons: see `build-resources/README.md`. Routing: installed PWA uses `manifest.json` `start_url` `/bible-online?source=pwa`; Electron uses HashRouter bootstrap to the reader.
