#!/usr/bin/env sh
# Package the desktop app for the current host (+ Linux on Windows).
set -eu

npm run electron:compile
npm run build-electron

builder_flags="--publish never"
case "$(uname -s 2>/dev/null || echo unknown)" in
  Darwin)
    exec npx electron-builder --mac dmg --x64 --arm64 ${builder_flags}
    ;;
  Linux)
    exec npx electron-builder --linux AppImage deb --x64 ${builder_flags}
    ;;
  MINGW* | MSYS* | CYGWIN* | Windows*)
    npx electron-builder --win --x64 ${builder_flags}
    npx electron-builder --linux AppImage deb --x64 ${builder_flags}
    ;;
  *)
    exec npx electron-builder -mwl ${builder_flags}
    ;;
esac
