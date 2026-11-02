// scripts/convert-concordance.js
// Node 14+
// Run: node scripts/convert-concordance.js

const fs = require("fs");
const path = require("path");
const { xml2js } = require("xml-js");

const SRC_DIR = path.join(__dirname, "..", "public", "HebrewGreekRes", "bibleStrongConcordance");
const OUT_DIR = path.join(__dirname, "..", "public", "HebrewGreekRes", "json");
fs.mkdirSync(OUT_DIR, { recursive: true });

/** Normalize transLink -> canonical strong key like "h0175" or "g0846" */
function canonicalStrong(s) {
  if (!s) return "";
  // remove brackets, non-alphanum
  const cleaned = String(s).replace(/[\[\]\s]/g, "");
  const m = cleaned.match(/([ghGH])0*?(\d{1,4})/);
  if (m) {
    const letter = m[1].toLowerCase();
    // zero-pad to 4 digits
    const num = String(m[2]).padStart(4, "0");
    return `${letter}${num}`;
  }
  // fallback: any letter+digits match
  const mm = cleaned.match(/([ghGH]\d{1,4})/);
  return mm ? mm[0].toLowerCase() : cleaned.toLowerCase();
}

function parseXmlCompact(xml) {
  return xml2js(xml, { compact: true, trim: true });
}

// read xml filenames (A.xml ... Z.xml)
const files = fs.readdirSync(SRC_DIR).filter(f => /\.xml$/i.test(f));

const concordanceIndex = {}; // strong -> [{ letter, idx }, ...]

// helper to extract refDetails nodes (robust walker)
function collectRefDetails(obj, out = []) {
  if (!obj || typeof obj !== "object") return out;
  // some files: root -> a -> name -> refDetails (array or single)
  if (obj.refDetails) {
    if (Array.isArray(obj.refDetails)) out.push(...obj.refDetails);
    else out.push(obj.refDetails);
  }
  // also sometimes nested: name -> refDetails, or deeper
  for (const v of Object.values(obj)) {
    if (v && typeof v === "object") collectRefDetails(v, out);
  }
  return out;
}

for (const file of files) {
  const letter = path.basename(file, ".xml").toUpperCase();
  const xmlPath = path.join(SRC_DIR, file);
  const xml = fs.readFileSync(xmlPath, "utf8");
  const json = parseXmlCompact(xml);
  const refs = collectRefDetails(json);

  const simplified = refs.map((rd, index) => {
    // bibleLink may be an attribute or a child
    const bibleLink = rd?._attributes?.bibleLink ?? rd?.bibleLink?._text ?? "";
    // transLink might be an attribute value like "[H0175]"
    const transRaw = rd?._attributes?.transLink ?? rd?.transLink?._text ?? "";
    // snippet text: try _text, _cdata, or nested text
    const snippet = (rd._text ?? rd._cdata ?? rd?.text?._text ?? rd?._text ?? "") .toString().trim();

    const transCanonical = canonicalStrong(String(transRaw).replace(/[\[\]]/g, ""));
    if (transCanonical) {
      concordanceIndex[transCanonical] = concordanceIndex[transCanonical] || [];
      concordanceIndex[transCanonical].push({ letter: letter, idx: index });
    }

    return {
      bibleLink: bibleLink || "",
      transLink: transRaw || "",
      trans: transCanonical || "",
      snippet: snippet || "",
      raw: rd
    };
  });

  // write per-letter JSON
  const outPath = path.join(OUT_DIR, `${letter}.json`);
  fs.writeFileSync(outPath, JSON.stringify(simplified, null, 2), "utf8");
  console.log(`Wrote ${outPath} (${simplified.length} entries)`);
}

// write index
const indexPath = path.join(OUT_DIR, "concordanceIndex.json");
fs.writeFileSync(indexPath, JSON.stringify(concordanceIndex, null, 2), "utf8");
console.log(`Wrote index: ${indexPath} (keys: ${Object.keys(concordanceIndex).length})`);
