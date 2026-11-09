// LandingPushNav.tsx
import React, { useEffect, useRef, useState } from 'react';
import logo from '../../assets/website/logo.png';
import banner1 from '../../assets/website/banner1.png';
import banner2 from '../../assets/website/banner2.png';
import download from '../../assets/website/Download2.png';
import lwApps from '../../assets/website/lwApps.png';
import gApps from '../../assets/website/gApps.png';
import iosApp from '../../assets/website/ios.png';
import rhapathon from '../../assets/website/Rhapathon.png';
import pcl from '../../assets/website/pastorchrislive.png';
import sideNav from '../../assets/website/sideNav.png';
import { motion } from 'framer-motion';
import feature1 from '../../assets/website/Features/feature1.png';
import feature2 from '../../assets/website/Features/feature2.png';
import feature3 from '../../assets/website/Features/feature3.png';
import feature4 from '../../assets/website/Features/feature4.png';
import feature5 from '../../assets/website/Features/feature5.png';
import about from '../../assets/website/sideMenu/about.png';
import blog from '../../assets/website/sideMenu/blog.png';
import contact from '../../assets/website/sideMenu/contact.png';
import give from '../../assets/website/sideMenu/give.png';
import partner from '../../assets/website/sideMenu/partner.png';
import product from '../../assets/website/sideMenu/product.png';
import store from '../../assets/website/sideMenu/store.png';
import Footer from './footer';
import { STORE_URLS } from 'config/storeLinks';
import WebsiteStoreAnchor from '../../components/Website/WebsiteStoreAnchor';

type Slide = { id: string; image: string; title?: string; subtitle?: string };
const SLIDE_INTERVAL_MS = 7000;

const slidesSeed: Slide[] = [
  { id: 's1', image: rhapathon },
  { id: 'hero', image: banner1 },
  { id: 's2', image: banner2 },
  { id: 's3', image: pcl },
];

export default function LandingPushNav(): JSX.Element {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  // feature artworks (art includes numbers & vertical label)
  const features = [
    {
      id: 1,
      description:
        "Experience the illumination of God’s Word with the KJV Strong's read-to-me feature.",
      image: feature1,
    },
    {
      id: 2,
      description:
        'Use the “Pronounced-as” audio feature to appreciate the pronunciations of the over 14,000+ words of the Hebrew & Greek Dictionaries.',
      image: feature2,
    },
    {
      id: 3,
      description:
        "Equipped with a compendium of four (4) volumes of Study Resources: KJV Strong's Bible, enhanced Strong's Concordance, Hebrew & Greek Dictionaries.",
      image: feature3,
    },
    {
      id: 4,
      description:
        'Exhaustive Study References by Rev. (Dr.) Chris Oyakhilome DSc. DSc. DD.',
      image: feature4,
    },
    {
      id: 5,
      description:
        "Experience advanced search for Hebrew & Greek words, hyperlinked with the enhanced Strong's Concordance.",
      image: feature5,
    },
  ];

  // slide-in variant
  const slideVariant = (direction: 'left' | 'right' = 'left') => ({
    hidden: { opacity: 0, x: direction === 'left' ? -80 : 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  });

  // hero auto-advance
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => setIndex(i => (i + 1) % slidesSeed.length),
      SLIDE_INTERVAL_MS
    );
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index]);

  // lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const DRAWER_W = 100;

  // =======
  // Tweak these values to match your artwork exact pixel size:
  // =======
  const imgW = 420; // width of the image column on large screens
  const imgH = 420; // height of the grid row (image height) — core for center alignment
  // =======
  const [isLg, setIsLg] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    const onResize = () => setIsLg(window.innerWidth >= 1024);
    // set initial value (in case SSR default was used)
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top logo */}
      <div className="bg-[#18668D]">
        <div className="max-w-7xl ml-[3rem] px-4 py-2 flex items-center">
          <img src={logo} className=" w-[10rem] !z-100" alt="logo" />
        </div>
      </div>

      {/* Header */}
      <header className="bg-[#0299B4] text-white">
        <div className="max-w-7xl mx-[3.5rem] p-1 flex items-center justify-between">
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="rounded hover:bg-white/10 p-1"
          >
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <nav
            className={`flex-1 flex items-center justify-center gap-6 transition-opacity duration-300 ${drawerOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <a href="#home" className="text-white/90 hover:underline">
              About
            </a>
            <a href="#products" className="text-white/90 hover:underline">
              Products
            </a>
            <a href="/store" className="text-white/90 hover:underline">
              Store
            </a>
            <a href="/bible-online" className="text-white/90 hover:underline">
              Bible Online
            </a>
            <a href="#blog" className="text-white/90 hover:underline">
              Blog
            </a>
            <a href="/partner" className="text-white/90 hover:underline">
              Partner
            </a>
            <a href="#give" className="text-white/90 hover:underline">
              Give
            </a>
            <a href="#contact" className="text-white/90 hover:underline">
              Contact
            </a>
          </nav>

          <div className="mr-auto ml-[3rem]">
            <button className="p-1">
              <svg
                className="w-4 h-4 text-white/80"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer + main */}
      <div className="flex">
        <aside
          className={`fixed left-0 top-10 bottom-0 z-40 transform transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ width: DRAWER_W }}
        >
          <div className="h-full bg-[#18668D] shadow-lg flex flex-col">
            <div className="flex items-center justify-between">
              <img
                src={sideNav}
                className="w-[1.4rem] mt-8 ml-10 cursor-pointer"
                alt="about"
                onClick={() => setDrawerOpen(false)}
              />
            </div>

            <nav className="mt-10">
              <img
                src={about}
                className="w-[1.2rem] mt-7 ml-10 cursor-pointer"
                alt="about"
              />
              <img
                src={product}
                className="w-[1.2rem] mt-7 ml-10 cursor-pointer"
                alt="product"
              />
              <img
                src={store}
                className="w-[1.2rem] mt-7 ml-10 cursor-pointer"
                alt="store"
              />
              <img
                src={blog}
                className="w-[1.2rem] mt-7 ml-10 cursor-pointer"
                alt="blog"
              />
              <img
                src={partner}
                className="w-[1.2rem] mt-7 ml-10 cursor-pointer"
                alt="partner"
              />
              <img
                src={give}
                className="w-[1.2rem] mt-7 ml-10 cursor-pointer"
                alt="give"
              />
              <img
                src={contact}
                className="w-[1.2rem] mt-7 ml-10 cursor-pointer"
                alt="contact"
              />
            </nav>
          </div>
        </aside>

        {/* {drawerOpen && <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setDrawerOpen(false)} aria-hidden />} */}

        <div
          className="flex-1 transition-[margin-left,width] duration-300 ease-in-out"
          style={{ marginLeft: drawerOpen ? DRAWER_W : 0 }}
        >
          <main id="home">
            {/* Hero */}
            <div className="relative h-[420px] md:h-[520px] overflow-hidden">
              <div
                className="flex h-full transition-transform duration-900 ease-in-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {slidesSeed.map(s => (
                  <div
                    key={s.id}
                    className="flex-shrink-0 w-full h-full relative"
                  >
                    <img
                      src={s.image}
                      alt={s.id}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center px-4 py-6 sm:py-8">
              <div className="relative mx-auto w-full max-w-3xl flex flex-col items-center">
                <img
                  src={download}
                  alt="Download banner"
                  className="w-full max-w-[45rem] h-auto object-contain mb-6 sm:mb-8"
                  draggable={false}
                />
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
                  <WebsiteStoreAnchor
                    href={STORE_URLS.loveworld}
                    aria-label="Open Loveworld App Store in new tab"
                    className="shrink-0"
                  >
                    <img
                      src={lwApps}
                      alt="Loveworld App Store"
                      className="h-11 sm:h-12 md:h-14 w-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-105"
                      draggable={false}
                    />
                  </WebsiteStoreAnchor>
                  <WebsiteStoreAnchor
                    href={STORE_URLS.googlePlay}
                    aria-label="Open Google Play Store in new tab"
                    className="shrink-0"
                  >
                    <img
                      src={gApps}
                      alt="Google Play"
                      className="h-11 sm:h-12 md:h-14 w-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-105"
                      draggable={false}
                    />
                  </WebsiteStoreAnchor>
                  <WebsiteStoreAnchor
                    href={STORE_URLS.appStore}
                    aria-label="Open Apple App Store in new tab"
                    className="shrink-0"
                  >
                    <img
                      src={iosApp}
                      alt="Apple App Store"
                      className="h-11 sm:h-12 md:h-14 w-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-105"
                      draggable={false}
                    />
                  </WebsiteStoreAnchor>
                </div>
              </div>
            </div>

            {/* FEATURES - 3 column strict layout with fixed row height = image height */}
            {/* FEATURES - explicit grid placement to guarantee same-row layout on lg */}
            <section id="features" className="max-w-6xl mx-auto px-6 py-16">
              <h2 className="text-[34px] font-semibold font-inter mb-10 text-center">
                Special Audio & Extra Features
              </h2>

              <div className="space-y-20">
                {features.map((feature, idx) => {
                  const isLeft = idx % 2 === 0;

                  // only apply the fixed 3-column grid on large screens
                  const gridStyle: React.CSSProperties = isLg
                    ? {
                        gridTemplateColumns: `${imgW}px 1fr ${imgW}px`,
                        gridAutoRows: `${imgH}px`,
                        alignItems: 'center',
                      }
                    : {};

                  const peekPx = isLg ? (isLeft ? -12 : 12) : 0;

                  return (
                    <motion.div
                      key={feature.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.25 }}
                      variants={slideVariant(isLeft ? 'left' : 'right')}
                      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                      style={isLg ? gridStyle : undefined}
                    >
                      {/* LEFT image column (explicit placement on lg) */}
                      <div
                        className={`${isLeft ? 'flex' : 'hidden lg:flex'} justify-start items-start`}
                        style={
                          isLg ? { gridColumn: '1', gridRow: '1' } : undefined
                        }
                      >
                        <div
                          className={`overflow-visible ${isLeft ? 'lg:-ml-16 md:-ml-10 -ml-6' : ''}`}
                          style={{
                            width: `${imgW}px`,
                            height: `${imgH}px`,
                            minWidth: 0,
                            transform: isLg
                              ? `translateX(${peekPx}px)`
                              : undefined,
                          }}
                        >
                          <img
                            src={feature.image}
                            alt={`feature-${feature.id}`}
                            className="w-full h-full object-contain"
                            draggable={false}
                          />
                        </div>
                      </div>

                      {/* CENTER text column (explicit placement on lg) */}
                      <div
                        className="flex items-center"
                        style={
                          isLg
                            ? {
                                gridColumn: '2',
                                gridRow: '1',
                                justifySelf: isLeft ? 'start' : 'end',
                              }
                            : undefined
                        }
                      >
                        <div
                          className={`w-full text-left ${isLeft ? 'lg:pl-6 lg:pr-12' : 'lg:pl-12 lg:pr-6'}`}
                          style={{ minWidth: 0 }}
                        >
                          <p className="text-[1.2rem] font-semibold leading-7">
                            {feature.description}
                          </p>
                        </div>

                        {/* horizontal bar (keeps inside center block as before) */}
                        <div className="my-6">
                          <div className="w-full border-t border-slate-400" />
                        </div>
                      </div>

                      {/* RIGHT image column (explicit placement on lg) */}
                      <div
                        className={`${!isLeft ? 'flex' : 'hidden lg:flex'} justify-end items-start`}
                        style={
                          isLg ? { gridColumn: '3', gridRow: '1' } : undefined
                        }
                      >
                        <div
                          className={`overflow-visible ${!isLeft ? 'lg:-mr-16 md:-mr-10 -mr-6' : ''}`}
                          style={{
                            width: `${imgW}px`,
                            height: `${imgH}px`,
                            minWidth: 0,
                            transform: isLg
                              ? `translateX(${peekPx}px)`
                              : undefined,
                          }}
                        >
                          <img
                            src={feature.image}
                            alt={`feature-${feature.id}`}
                            className="w-full h-full object-contain"
                            draggable={false}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
