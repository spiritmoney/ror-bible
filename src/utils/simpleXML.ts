// utils/xmlParser.ts
import { xml2js } from 'xml-js';

export const parseDictionaryXML = (xmlString: string) => {
  const json = xml2js(xmlString, { compact: true });
  // json.dictionary.keynum is an array of entries
  return json;
};
