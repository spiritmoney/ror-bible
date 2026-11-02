// src/pages/LandingPage.tsx
import React, { useEffect, useState } from "react";
import Header, { HEADER_HEIGHT } from "./header";
import SideNav from "./sideNav";
import Footer from "./footer";
import Carousel from "./carousel";
import FeaturesSection from "./features";

// hero + banners
import banner1 from "../../assets/website/banner1.png";
import banner2 from "../../assets/website/banner2.png";
import HGBanner from "../../assets/website/HGbanner.jpg";
import lang from "../../assets/website/1-Webbanner.png";
import platforms1 from "../../assets/website/2-Webbanner.png";
import platforms2 from "../../assets/website/3-Webbanner.png";
import platforms3 from "../../assets/website/4-Webbanner.png";
import platforms4 from "../../assets/website/5-Webbanner.png";
import platforms5 from "../../assets/website/6-Webbanner.png";
import rhapathon from "../../assets/website/Rhapathon.png";
import pcl from "../../assets/website/pastorchrislive.png";
import download from "../../assets/website/downloadBanner1.png";
import appStore from "../../assets/website/downloadBanner2.png";

// features
import feature1 from "../../assets/website/Features/feature1.png";
import feature2 from "../../assets/website/Features/feature2.png";
import feature3 from "../../assets/website/Features/feature3.png";
import feature4 from "../../assets/website/Features/feature4.png";
import feature5 from "../../assets/website/Features/feature5.png";
import FloatingVideoPlayer from "./videoplayer";

type Slide = { id: string; image: string };

const slidesSeed: Slide[] = [
  { id: "s1", image: banner1 },
  { id: "s2", image: lang },
  { id: "s3", image: HGBanner },
  { id: "s4", image: pcl },
  { id: "s5", image: platforms1 },
  { id: "s6", image: platforms2 },
  { id: "s7", image: platforms3 },
  { id: "s8", image: platforms4 },
  { id: "s9", image: platforms5 },
  { id: "sn", image: banner2 },
];

export default function LandingPage(): JSX.Element {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const features = [
    { id: 1, description: "Experience the illumination of God’s Word with the KJV Strong's read-to-me feature.", image: feature1 },
    { id: 2, description: "Use the “Pronounced-as” audio feature to appreciate the pronunciations of the over 14,000+ words of the Hebrew & Greek Dictionaries.", image: feature2 },
    { id: 3, description: "Equipped with a compendium of four (4) volumes of Study Resources: KJV Strong's Bible, enhanced Strong's Concordance, Hebrew & Greek Dictionaries.", image: feature3 },
    { id: 4, description: "Exhaustive Study References by Rev. (Dr.) Chris Oyakhilome DSc. DSc. DD.", image: feature4 },
    { id: 5, description: "Experience advanced search for Hebrew & Greek words, hyperlinked with the enhanced Strong's Concordance.", image: feature5 },
  ];


  const imgW = 420;
  const imgH = 420;

  const [DRAWER_W, setDrawerW] = useState(50);

  // Responsive breakpoints for drawer width
  useEffect(() => {
    const updateDrawerWidth = () => {
      const width = window.innerWidth;
      if (width < 640) setDrawerW(50); // sm → small phones
      else if (width < 768) setDrawerW(80); // md → tablets
      else if (width < 1024) setDrawerW(80); // lg → small laptops
      else setDrawerW(100); // xl+ → large screens
    };

    updateDrawerWidth();
    window.addEventListener("resize", updateDrawerWidth);
    return () => window.removeEventListener("resize", updateDrawerWidth);
  }, []);

  const [isLg, setIsLg] = useState<boolean>(() => typeof window !== "undefined" ? window.innerWidth >= 1024 : false);
  useEffect(() => {
    const onResize = () => setIsLg(window.innerWidth >= 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // lock scroll when drawer open
  // useEffect(() => {
  //   document.body.style.overflow = drawerOpen ? "hidden" : "";
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* fixed header */}
      <Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      <div className="flex">
        {/* side nav positioned under header */}
        <SideNav drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} drawerWidth={DRAWER_W} topOffset={HEADER_HEIGHT - 50} />

        {/* main area: make room for the fixed header by padding top */}
        <div className="flex-1 transition-[margin-left,width] duration-300 ease-in-out"
          style={{
            marginLeft: drawerOpen ? DRAWER_W : 0, paddingTop: HEADER_HEIGHT, minHeight: `calc(100vh)`,
            overflow: "auto",
          }}>
          {/* Carousel separated */}
          <Carousel slides={slidesSeed} />

          {/* Download banners (kept in page so they sit under carousel) */}
          <div className="relative flex items-center justify-center">
            <div className="relative mx-auto">
              <img src={download} alt="Download banner" className="w-[20rem] md:w-[45rem] mb-5 h-auto object-cover" draggable={false} />            

                {/* 🎥 Video player here */}
                <FloatingVideoPlayer
                  src="https://bit.ly/PremiumReader_TVPromo"
                  triggerOffset={200}
                  width="700px"
                />
              


              <a href="https://web.lwappstore.com/share/appId-2f64e9cbe3f4d74c733696b585c933d4" target="_blank" rel="noopener noreferrer" aria-label="Open App Store in new tab" className="z-50 mt-5">
                <img src={appStore} alt="App Store" className="w-[20rem] md:w-[38rem] flex justify-center ml-auto mr-auto h-auto cursor-pointer" draggable={false} />
              </a>
            </div>
          </div>

          {/* Features section separated */}
          <FeaturesSection features={features} imgW={imgW} imgH={imgH} isLg={isLg} />

          {/* Footer scrolls with page normally */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
