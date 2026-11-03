# Desktop app icons (electron-builder)

**Source:** `public/logo512.png` (1289×1220)

**Pipeline (authorized):** center on transparent canvas → **1289×1289** (34px top / 35px bottom transparent bands) → **LANCZOS downscale** to **1024×1024** (no upscaling).

**Regenerate (outside repo Pillow only):**

```bash
py -3 /c/temp/rhapsody-icon-scratch/generate_icons.py
```

Script lives in `C:/temp/rhapsody-icon-scratch/generate_icons.py` (install Pillow with `pip install pillow -t C:/temp/rhapsody-icon-scratch/pillow_pkg`).

**Outputs here:**

| File | Use |
|------|-----|
| `icon.png` | 1024 master, `BrowserWindow` via `extraResources`, default `build.icon` |
| `icon-512.png` | Reference / marketing |
| `icon.ico` | Windows exe, NSIS installer/uninstaller/header |
| `icon.icns` | macOS `.app` / DMG (built with PNG payloads in scratch script) |
| `preview-1024-padded.png` | Human preview of padded master |

Legacy files under `public/icon/` remain in the repo but are **unused** by current electron-builder config.
