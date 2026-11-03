#!/usr/bin/env sh
set -eu
# Strong's files are downloaded on first use into userData (desktop).
rm -rf build/HebrewGreekRes
# Bible text ships via webpack (BibleJson); XML copies are hosting-only.
rm -rf build/bibleXML
rm -f build/Bible_English_AMP.xml
rm -f build/service-worker.js
# Drop webpack source maps from the desktop bundle.
find build -name '*.map' -type f -delete 2>/dev/null || true
