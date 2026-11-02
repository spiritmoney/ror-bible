import React, { useState, ChangeEvent } from 'react';
import { parseStringPromise } from 'xml2js';
import ReactJson from 'react-json-view';

export interface IXml2Json {
  hidden:boolean,
}
const XmlToJsonConverter: React.FC<IXml2Json> = ({hidden}) => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const convertXmlToJson = async (xml: string): Promise<any> => {
    try {
      const result = await parseStringPromise(xml);
      return result;
    } catch (error) {
      console.error("Error parsing XML:", error);
      throw error;
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true); // Start loading
      const reader = new FileReader();
      reader.onload = async (e) => {
        const xml = e.target?.result as string;
        try {
          const json = await convertXmlToJson(xml);
          setJsonData(json);
          setError(null);
        } catch (err) {
          setError("Failed to convert XML to JSON.");
        } finally {
          setLoading(false); // End loading
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{
      display: hidden ? 'none' : 'block',
      overflowY: "auto"
  }} className='store_bible' >
      <h1>XML to JSON Converter</h1>
      <input type="file" accept=".xml" onChange={handleFileChange} />
      
      {loading && <p>Please wait, converting...</p>}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {jsonData && !loading && (
        <ReactJson src={jsonData} theme="monokai" />
      )}
    </div>
  );
};

export default XmlToJsonConverter;
