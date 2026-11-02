import './index.scss';
import React, { useCallback, useEffect, useState } from 'react';
import BibleIcon from '../../../assets/bible_icon.png';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import JSZip from 'jszip';
import { xml2js } from 'xml-js';
import { useRecoilState } from 'recoil';
import {
  ProdSKUAtom,
  SetNavAtom,
  bibleContentAtom,
  storeBackAtom,
  storeCartAtom,
} from 'store/atoms/general';
import SharePopup from 'screens/Store/Share';
import { IStoreProduct } from 'interface/storeProducts';
import { getBibleData, saveBibleData } from 'utils/bibleStorage';
import { normalizeCdnDownloadUrl } from 'utils/cdnUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubNav from 'screens/Multi_layout/multi_layout_component/subNav';

export interface IStore {
  hidden: boolean;
}

const ProductDetails: React.FC<IStore> = ({ hidden }) => {
  const { sku: urlSKU } = useParams<{ sku: string }>();
  const [productdet, setProductdet] = useState<IStoreProduct[]>([]);
  const [otherProd, setOtherProd] = useState<IStoreProduct[]>([]);
  const [storeCart, setStoreCart] = useRecoilState(storeCartAtom);
  const [recoilSKU, setRecoilSKU] = useRecoilState(ProdSKUAtom);
  const [, setBibleContent] = useRecoilState(bibleContentAtom);
  const [back, setBack] = useRecoilState(storeBackAtom);
  const [nav, setNav] = useRecoilState(SetNavAtom);
  const [showPopup, setShowPopup] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const isDownloading = downloadProgress !== null;

  const sku = urlSKU || recoilSKU;
  const shareUrl = `https://rhapsodybible.web.app/store/product/${sku}`;
  const shareTitle = 'Check out this Rhapsody Bible version!';

  const fetchData = useCallback(
    async (targetSku: string) => {
      try {
        const [prodRes, relatedRes] = await Promise.all([
          axios.get<IStoreProduct[]>(
            `https://api.rorbible.plus/prem/productSku.php?sku=${targetSku}`
          ),
          axios.get<IStoreProduct[]>(
            `https://api.rorbible.plus/prem/productSearchWildcard.php?keyword=${storeCart}`
          ),
        ]);
        setProductdet(prodRes.data);
        setOtherProd(relatedRes.data.slice(0, 4));
      } catch (err) {
        console.error('Fetch products error:', err);
      }
    },
    [storeCart]
  );

  useEffect(() => {
    if (sku) {
      setRecoilSKU(sku);
      fetchData(sku);
    }
  }, [sku, fetchData, setRecoilSKU]);

  const isValidDownloadSource = (sourceUrl?: string) => {
    if (!sourceUrl) return false;

    const trimmedUrl = sourceUrl.trim();
    if (!trimmedUrl) return false;

    const normalized = trimmedUrl.toLowerCase();
    const invalidValues = [
      'not applicable',
      'n/a',
      'na',
      'none',
      'null',
      'undefined',
    ];
    if (invalidValues.includes(normalized)) return false;

    return /^https?:\/\//i.test(trimmedUrl);
  };

  const extractZipBiblePayload = async (zip: JSZip) => {
    const xmlEntries = Object.entries(zip.files)
      .filter(([fileName, file]) => !file.dir && /\.xml$/i.test(fileName))
      .map(([fileName, file]) => ({ fileName, file }));

    if (!xmlEntries.length) {
      throw new Error('No XML files found inside the downloaded ZIP bundle');
    }

    const pickXml = (matcher: (fileName: string) => boolean) => {
      const found = xmlEntries.find(entry => matcher(entry.fileName));
      return found ? found.file : null;
    };

    const oldTestamentXml =
      pickXml(fileName =>
        /(old|ot|oldtestament|old_testament|ottestament)/i.test(fileName)
      ) ||
      xmlEntries.sort((a, b) => a.fileName.localeCompare(b.fileName))[0]?.file;

    const newTestamentXml =
      pickXml(fileName =>
        /(new|nt|newtestament|new_testament|nttestament)/i.test(fileName)
      ) ||
      xmlEntries.sort((a, b) => b.fileName.localeCompare(a.fileName))[0]?.file;

    const bibledata: Record<string, any> = {};

    if (oldTestamentXml) {
      const xmlText = await oldTestamentXml.async('string');
      bibledata.oldTestament = xml2js(xmlText, { compact: true });
    }

    if (newTestamentXml) {
      const xmlText = await newTestamentXml.async('string');
      bibledata.newTestament = xml2js(xmlText, { compact: true });
    }

    return bibledata;
  };

  const resolveDocumentSource = async (
    sourceUrl: string,
    onProgress?: (loaded: number, total: number) => void
  ) => {
    const trimmedUrl = sourceUrl?.trim();
    if (!trimmedUrl || !isValidDownloadSource(trimmedUrl)) return null;

    const normalizedUrl = normalizeCdnDownloadUrl(trimmedUrl);
    const isJsonLike =
      /\.json$/i.test(normalizedUrl) || normalizedUrl.includes('/JSON');
    const isXmlLike =
      /\.(xml)$/i.test(normalizedUrl) || normalizedUrl.includes('xml');
    const isZipLike =
      /\.(zip)$/i.test(normalizedUrl) || normalizedUrl.includes('.zip');

    const proxiedUrl = `/proxy?url=${encodeURIComponent(normalizedUrl)}`;

    try {
      const response = await axios.get(proxiedUrl, {
        responseType: 'arraybuffer',
        timeout: 30000,
        onDownloadProgress: progressEvent => {
          if (!onProgress) return;
          const total = progressEvent.total ?? 0;
          onProgress(progressEvent.loaded, total);
        },
      });

      if (response.status >= 400) {
        throw new Error(
          `Proxy responded with status ${response.status} for ${trimmedUrl}`
        );
      }

      const contentType = String(
        response.headers['content-type'] || ''
      ).toLowerCase();
      const rawData = response.data as ArrayBuffer | string;

      if (isZipLike || contentType.includes('zip')) {
        const zip = await JSZip.loadAsync(rawData);
        return extractZipBiblePayload(zip);
      }

      if (isJsonLike || contentType.includes('json')) {
        const jsonText = new TextDecoder().decode(rawData as ArrayBuffer);
        return JSON.parse(jsonText);
      }

      if (isXmlLike || contentType.includes('xml')) {
        const xmlText = new TextDecoder().decode(rawData as ArrayBuffer);
        const parsed = xml2js(xmlText, { compact: true });
        const isNewTestament =
          /(new|nt|newtestament|new_testament|nttestament)/i.test(
            normalizedUrl
          );
        return isNewTestament
          ? { newTestament: parsed }
          : { oldTestament: parsed };
      }

      return rawData;
    } catch (error) {
      console.error(
        `Failed to resolve document source for ${normalizedUrl || trimmedUrl}:`,
        error
      );
      return null;
    }
  };

  const handleProductRead = async (product?: IStoreProduct) => {
    if (isDownloading) return;

    const activeProduct = product ?? productdet[0];
    const activeSku = activeProduct?.ProductSKU || sku;
    const source = activeProduct?.PDFurl || '';

    if (!activeSku) {
      return toast.error('This product is unavailable right now');
    }

    const sourceUrls: string[] = (source || '')
      .split(',')
      .map(url => url.trim())
      .filter(isValidDownloadSource);

    if (!sourceUrls.length) {
      return toast.error(
        'This product has no downloadable ZIP package available yet'
      );
    }

    const cached = await getBibleData(activeSku);
    const cachedPayload = cached?.bibledata ?? cached;

    if (
      cachedPayload &&
      (cachedPayload.oldTestament ||
        cachedPayload.newTestament ||
        cachedPayload.audio ||
        cachedPayload.pronunciation)
    ) {
      setBibleContent((prev: any) => ({
        ...(prev || {}),
        [activeSku]: cachedPayload,
      }));
      toast.success('Loaded Bible from cache');
      setNav('multi_layout');
      return;
    }

    const loadingToastId = 'bible-load';
    setDownloadProgress(0);
    toast.loading('Downloading Bible… 0%', {
      toastId: loadingToastId,
      progress: 0,
    });

    // Track bytes loaded/total per source URL so progress reflects the
    // combined download (e.g. separate OT/NT bundles) in real time.
    const progressBySource = new Map<
      number,
      { loaded: number; total: number }
    >();
    const reportProgress = () => {
      let loaded = 0;
      let total = 0;
      progressBySource.forEach(entry => {
        loaded += entry.loaded;
        total += entry.total;
      });

      if (total <= 0) return;

      // Cap at 99% here; we jump to 100% only once parsing/saving finishes.
      const ratio = Math.min(0.99, loaded / total);
      const percent = Math.round(ratio * 100);
      setDownloadProgress(percent);
      toast.update(loadingToastId, {
        render: `Downloading Bible… ${percent}%`,
        progress: ratio,
      });
    };

    try {
      const responsePayloads = await Promise.all(
        sourceUrls.map((url, index) =>
          resolveDocumentSource(url, (loaded, total) => {
            progressBySource.set(index, { loaded, total });
            reportProgress();
          })
        )
      );

      const bibledata: Record<string, any> = {};
      responsePayloads.forEach(payload => {
        if (!payload || typeof payload !== 'object') return;

        if (payload.oldTestament) bibledata.oldTestament = payload.oldTestament;
        if (payload.newTestament) bibledata.newTestament = payload.newTestament;
        if (payload.audio) bibledata.audio = payload.audio;
        if (payload.pronunciation)
          bibledata.pronunciation = payload.pronunciation;
      });

      if (!bibledata.oldTestament && !bibledata.newTestament) {
        throw new Error(
          'The downloaded bundle is not a valid Bible payload or the source URL is unavailable.'
        );
      }

      setDownloadProgress(100);
      toast.update(loadingToastId, {
        render: 'Downloading Bible… 100%',
        progress: 1,
      });

      await saveBibleData(activeSku, { bibledata });
      setBibleContent((prev: any) => ({
        ...(prev || {}),
        [activeSku]: bibledata,
      }));

      toast.update(loadingToastId, {
        render: 'Bible downloaded!',
        type: 'success',
        isLoading: false,
        progress: undefined,
        autoClose: 2000,
      });
      setNav('multi_layout');
    } catch (err) {
      console.error('handleProductRead error:', err);
      toast.update(loadingToastId, {
        render: 'The Bible could not be loaded. Please try again.',
        type: 'error',
        isLoading: false,
        progress: undefined,
        autoClose: 4000,
      });
    } finally {
      setDownloadProgress(null);
    }
  };

  const handleViewDetails = (prodSKU: string) => {
    setRecoilSKU(prodSKU);
    setStoreCart('bible');
    setBack('store_bible');
    setNav('product');
  };
  const handleBack = () => setNav(back);
  const togglePopup = () => setShowPopup(v => !v);

  return (
    <div style={{ display: hidden ? 'none' : 'block' }} className="w-full">
      <SubNav
        nav={nav}
        setNav={setNav}
        className="border-b-[5px] border-[#DFE1D8]"
      />
      <div style={{ overflowY: 'auto' }} className="store_bibleProd h-full">
        <div className="store_bible_top">
          <span
            className="cursor-pointer mr-2 font-bold text-[25px]"
            title="back to store"
            onClick={handleBack}
          >
            ←
          </span>
          <img src={BibleIcon} alt="bibleIcon" />
          <h4>Product Details!</h4>
        </div>

        {productdet.map((product, i) => (
          <div
            key={i}
            className="store_bible_main items center"
            style={{ marginTop: '2rem', display: 'flex' }}
          >
            <div className="product_list flex w-full">
              <div className="sec1 flex flex-col">
                <img
                  src={product.Imageurl}
                  alt={product.Title}
                  className="cursor-pointer"
                  onClick={() => handleProductRead(product)}
                />
                <h2>{product.Title}</h2>
                <span className="author font-bold te mt-2">
                  Author: <span className="font-normal">{product.Author}</span>
                </span>
                <span className="bg-blue-400 hover:bg-blue-700 cursor-pointer mt-4 text-white font-semibold py-0.5 px-3 rounded w-fit">
                  ${product.Price}
                </span>
                <span
                  onClick={() => handleProductRead(product)}
                  className={`bg-blue-400 hover:bg-blue-700 cursor-pointer mt-1 text-white font-semibold py-0.5 px-3 rounded w-fit ${
                    isDownloading ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {isDownloading ? `Downloading… ${downloadProgress}%` : 'Read'}
                </span>
                {isDownloading && (
                  <div className="w-full max-w-[160px] h-1.5 bg-gray-200 rounded mt-1 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-200"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                )}
                <span
                  onClick={togglePopup}
                  className="bg-red-400 hover:bg-red-700 cursor-pointer mt-2 text-white font-semibold py-0.5 px-3 rounded w-fit"
                >
                  Share
                </span>
              </div>
            </div>

            <div className="product_list 2 flex w-full flex-col justify-between">
              <div className="sec2 flex flex-col h-[40%] mb-5">
                <span className="desc text-[1rem] mt-4 ml-auto">
                  {product.Description}
                </span>
              </div>

              <span className="font-semibold mt-[3rem]">
                Other Related Products
              </span>
              <div className="otherProducts flex">
                {otherProd.map((rp, idx) => (
                  <div
                    key={idx}
                    className="bible_list ml-4"
                    onClick={() => handleViewDetails(rp.ProductSKU)}
                  >
                    <img
                      src={rp.Imageurl}
                      alt={rp.Title}
                      className="w-[2rem] cursor-pointer"
                    />
                    <h5>{rp.Title.slice(0, 20)}…</h5>
                    <button onClick={() => handleViewDetails(rp.ProductSKU)}>
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {showPopup && (
          <SharePopup url={shareUrl} title={shareTitle} onClose={togglePopup} />
        )}

        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default ProductDetails;
