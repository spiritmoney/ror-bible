// src/pages/productPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HEADER_HEIGHT } from './constants';
import WebsiteLayout from './WebsiteLayout';
import FeaturesSection from './featureProduct';
import { scrollToHash } from '../../utils/scrolToHash';
import { useLocation } from 'react-router-dom';

// ---------- Assets (product assets) ----------
import productBanner from '../../assets/product/productBanner.png';
import productImg1 from '../../assets/product/product-1.png';
import productImg2 from '../../assets/product/product-2.png';
import productImg3 from '../../assets/product/product-3.png';
import productImg4 from '../../assets/product/product-4.png';
import productImg5 from '../../assets/product/product-5.png';
import productImg6 from '../../assets/product/product-6.png';
import goggle from '../../assets/product/gogglePlay.png';
import ios from '../../assets/product/appleStore.png';
import lwapp from '../../assets/product/lwapps.png';
import macOS from '../../assets/product/macOS.png';
import windows from '../../assets/product/windows.png';
import linux from '../../assets/product/linux.png';
import kc from '../../assets/about/kc.png';
import link from '../../assets/about/link.png';
// ------------------------------------------------------------------
export type LinkBadge = {
  label?: string;
  href: string;
  imgWidth?: number | string;
  icon?: string | React.ReactNode;
};
export type Bullet = string | { text: string; links?: LinkBadge[] };

type Feature = {
  id: number;
  slugId?: string;
  title?: string; // main heading
  title2?: string; // submain heading
  subtitle?: string; // small subtitle with grey bar
  description?: string | string[] | React.ReactNode;
  closingDescription?: string | string[] | React.ReactNode;
  bullets?: Bullet[]; // bullets. string[] or Bullet[]
  actionText?: string; // closing sub-heading (e.g. "Install today at:")
  actionLinks?: LinkBadge[]; // badges/links shown inline with actionText
  image?: string; // image url / asset
  imagePlacement?: 'aside' | 'below'; // "aside" => two-column (text + image), "below" => image placed after text
  imageSide?: 'left' | 'right'; // when imagePlacement === "aside", which side it sits on (default "right")
  actionLinksPlacement?: 'inline' | 'belowText' | 'belowImage';
};

type productPageProps = {
  isModal?: boolean;
  onClose?: () => void;
};

export default function ProductPage({
  isModal = false,
  onClose,
}: productPageProps): JSX.Element {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isModal) return; // skip when rendering modal overlay
    const state = (location.state as any) || {};
    const slug =
      state?.scrollTo ??
      (window.location.hash ? window.location.hash : undefined);
    if (!slug) return;

    // slug may be 'bible_mobile' (from state) or '#bible_mobile' (from hash)
    const hash = slug.startsWith('#') ? slug : `#${slug}`;

    (async () => {
      // headerOffset is your imported HEADER_HEIGHT
      await scrollToHash(hash, {
        headerOffset: HEADER_HEIGHT,
        behavior: 'smooth',
        maxAttempts: 20,
        retryDelay: 80,
      });
      // optional: clear the hash from history/state if you don't want it visible
      // window.history.replaceState({}, "", window.location.pathname + window.location.search);
    })();
  }, [location, isModal]);

  // features array
  const features: Feature[] = [
    // feature with paragraph + image (classic)
    {
      id: 1,
      slugId: 'bible_online',
      title: 'Bible Online',
      subtitle: '“The Word, just a click away”',
      description: [
        'Bible Online brings the full Premium Bible Reader 2.0 experience right to your browser—no downloads, no installations. Whether you’re at work, in church, or on the go, the Word is always one tab away.',
        'With over 7 immersive layouts, access to Strong’s Concordance, Hebrew & Greek tools, parallel study, and verse comparison, Bible Online makes serious study possible from anywhere with an internet connection. And with the read-to-me audio feature, you can let the Bible speak while you meditate.',
      ],
      actionText: 'Start your study now at',
      actionLinks: [
        { label: 'rhapsodybible.web.app', href: '/bible-online', icon: link },
      ],
      image: productImg1,
      imagePlacement: 'aside',
      imageSide: 'left',
    },

    {
      id: 2,
      slugId: 'bible_lite',
      title: 'Bible Lite ',
      title2: '(Progressive Web App)',
      subtitle: '“Install once. Carry everywhere.”',
      description: [
        'Bible Lite is the progressive web app version of Premium Bible Reader 2.0—lightweight, powerful, and designed for speed. Install it on any device—phone, tablet, or desktop—and enjoy offline access to your Bible study.',
        'It comes with all the core features:',
      ],
      bullets: [
        'Verse Compare, Bookmarks & Highlights',
        'Split View for parallel study',
        'Cloud sync via your ROR Bible+ account',
      ],
      closingDescription: [
        'Think of Bible Lite as your portable Bible study companion—ready whenever you are.',
      ],
      actionText: 'Install Bible Lite today at',
      actionLinks: [
        {
          label: 'rhapsodybible.web.app',
          href: 'https://rhapsodybible.web.app',
          icon: link,
        },
      ],
      image: productImg2,
      imagePlacement: 'aside',
      imageSide: 'left',
    },

    {
      id: 3,
      slugId: 'bible_mobile',
      title: 'Bible Mobile ',
      title2: '(Androis & iOS)',
      subtitle: '“Your Bible. Your ministry. Everywhere.”',
      description: [
        'Bible Mobile is the native iOS and Android app that transforms your phone or tablet into a ministry powerhouse. Built for immersive study on the go, it combines multi-layout reading modes, AI-driven audio tools, and sermon management (@Pulpit) into one seamless experience.',
        'Highlights include:',
      ],
      bullets: [
        '100+ Audio Bibles in multiple languages',
        'Hebrew & Greek word search with audio pronunciation',
        'Personalized tools for highlighting, note-taking, and verse sharing',
        'Sermon creation & voice notes with cloud sync across devices',
      ],
      closingDescription: [
        'Whether you’re preparing a message or studying on your commute, Bible Mobile keeps you connected to the Word.',
      ],
      actionText: 'Download now on:',
      // <<-- UPDATED: use three explicit labeled badges (Google Play, App Store, Loveworld)
      actionLinks: [
        {
          href: 'https://web.lwappstore.com/share/appId-2f64e9cbe3f4d74c733696b585c933d4',
          icon: lwapp,
        },
        {
          href: 'https://apps.apple.com/ng/app/ror-bible/id1461993744',
          icon: ios,
        },
        {
          href: 'https://web.lwappstore.com/share/appId-2f64e9cbe3f4d74c733696b585c933d4',
          icon: goggle,
        },
      ],
      image: productImg3,
      imagePlacement: 'aside',
      imageSide: 'right',
      actionLinksPlacement: 'belowText',
    },

    {
      id: 4,
      slugId: 'bible_desktop',
      title: 'Bible Desktop ',
      title2: '(MacOS, Windows & Linux)',
      subtitle: '“The ultimate study desk for ministers and scholars.”',
      description: [
        'Bible Desktop brings Premium Bible Reader 2.0 to Windows, MacOS, and Linux—perfect for ministers, teachers, and Bible scholars who want depth and focus.',
        'With a distraction-free interface, advanced study resources like Strong’s Concordance, Hebrew & Greek Dictionaries, LoveWorld Concordance, and commentary views, plus powerful @Pulpit sermon management tools, Bible Desktop is your complete study and ministry toolkit.',
      ],
      actionText:
        'Download Bible Desktop today and unlock an immersive study experience.',
      // <<-- UPDATED: use three explicit labeled badges (Google Play, App Store, Loveworld)
      actionLinks: [
        { href: 'https://rhapsodybible.web.app', icon: macOS },
        { href: 'https://rhapsodybible.web.app', icon: windows },
        { href: 'https://rhapsodybible.web.app', icon: linux },
      ],
      image: productImg4,
      imagePlacement: 'aside',
      imageSide: 'right',
      actionLinksPlacement: 'belowText',
    },

    {
      id: 5,
      slugId: 'ror_voiceApp',
      title: 'Rhapsody Voice App ',
      subtitle: '“Let ROR Bible+ speak to you!”',
      description: [
        'The ROR Voice App takes the Word to a whole new dimension.',
        'Available on Xceptia Arielle, Amazon Alexa, and Google Home, it lets you:',
      ],
      bullets: [
        'Listen to Bible passages read aloud',
        'Ask questions and get instant answers from Scripture',
        'Learn pronunciations of Hebrew & Greek words',
        'Use voice commands to search and study',
      ],
      closingDescription: [
        'Whether you’re at home, in the car, or preparing for a sermon, the ROR Voice App keeps the Scriptures alive on your lips and in your heart.',
      ],
      actionText: 'Install Rhapsody Voice App today at:',
      // <<-- UPDATED: use three explicit labeled badges (Google Play, App Store, Loveworld)
      actionLinks: [
        { label: 'rhapsodybible.web.app', href: '/bible-online', icon: link },
      ],

      image: productImg5,
      imagePlacement: 'aside',
      imageSide: 'left',
      actionLinksPlacement: 'inline',
    },

    {
      id: 6,
      slugId: '@myspot',
      title: '@MySpot -  ',
      title2: 'Digital Evangelism Tool',
      subtitle:
        '“@MySpot is more than an app—it is a divinely inspired digital evangelism platform created to help fulfill the mandate of completing the full preaching of the Gospel of our Lord Jesus Christ.”',
      description: [
        'It empowers every believer with innovative tools for effective soul-winning',
        'including:',
      ],
      bullets: [
        'Customized e-Tracts – Share personalized digital tracts with friends and loved ones yet to receive Christ.',
        'i-Evangelize – Go live and minister the Gospel instantly to individuals or groups, including those nearby.',
        'My Spot – Showcase your soul-winning moments through inspiring pictures and videos, encouraging others to do the same.',
        'Solution Centre – Explore a rich library of teachings and answers from Pastor Chris Oyakhilome DSc, DSc, DD, offering divine solutions to life’s most pressing questions.',
      ],
      closingDescription: [
        'With @MySpot, every believer is equipped, inspired, and empowered to reach more souls—anytime, anywhere, with lasting impact.',
      ],
      actionText: 'Download now on:',
      // <<-- UPDATED: use three explicit labeled badges (Google Play, App Store, Loveworld)
      actionLinks: [
        {
          href: 'https://web.lwappstore.com/share/appId-2f64e9cbe3f4d74c733696b585c933d4',
          icon: lwapp,
        },
        {
          href: 'https://web.lwappstore.com/share/appId-2f64e9cbe3f4d74c733696b585c933d4',
          icon: ios,
        },
        {
          href: 'https://web.lwappstore.com/share/appId-2f64e9cbe3f4d74c733696b585c933d4',
          icon: goggle,
        },
      ],
      image: productImg6,
      imagePlacement: 'aside',
      imageSide: 'left',
      actionLinksPlacement: 'belowText',
    },
  ];

  // layout sizing (tweak if needed)
  const imgW = 350;
  const imgH = 350;
  const [DRAWER_W, setDrawerW] = useState(50);

  // Responsive breakpoints for drawer width
  useEffect(() => {
    const updateDrawerWidth = () => {
      const width = window.innerWidth;
      if (width < 640)
        setDrawerW(50); // sm → small phones
      else if (width < 768)
        setDrawerW(80); // md → tablets
      else if (width < 1024)
        setDrawerW(80); // lg → small laptops
      else setDrawerW(100); // xl+ → large screens
    };

    updateDrawerWidth();
    window.addEventListener('resize', updateDrawerWidth);
    return () => window.removeEventListener('resize', updateDrawerWidth);
  }, []);

  const [isLg, setIsLg] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );
  useEffect(() => {
    const onResize = () => setIsLg(window.innerWidth >= 1024);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // lock page scroll when side drawer open
  // useEffect(() => {
  //   document.body.style.overflow = drawerOpen ? "hidden" : "";
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, [drawerOpen]);

  // modal focus + body-lock when opened as modal (full-screen)
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const prevFocused = document.activeElement as HTMLElement | null;
    containerRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      if (prevFocused && typeof prevFocused.focus === 'function')
        prevFocused.focus();
      if (onClose) onClose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModal]);

  // hash scrolling support (direct visits)
  useEffect(() => {
    if (isModal) return;

    // get slug from state or hash
    const state = (location.state as any) || {};
    let slug = state.scrollTo || window.location.hash;

    if (!slug) return;

    // normalize format
    const hash = slug.startsWith('#') ? slug : `#${slug}`;

    // Update the browser URL if state.scrollTo was used
    if (!window.location.hash && state.scrollTo) {
      window.history.replaceState({}, '', `${window.location.pathname}${hash}`);
    }

    // Scroll after mount/layout
    const timer = setTimeout(() => {
      scrollToHash(hash, {
        headerOffset: HEADER_HEIGHT,
        behavior: 'smooth',
        maxAttempts: 20,
        retryDelay: 80,
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [location, isModal]);

  // PageInner (shared between modal & full-page)
  const PageInner = (
    <div className=" bg-slate-50 text-slate-800">
      <div className="w-full">
        <div className="relative w-full overflow-hidden">
          <img
            src={productBanner}
            alt="product banner"
            className="w-full h-auto object-contain "
            draggable={false}
          />
        </div>
      </div>

      {/* Features — delegated to FeaturesSection (pairwise layout, 2-column) */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <FeaturesSection
          features={features}
          imgW={imgW}
          imgH={imgH}
          isLg={isLg}
        />
      </div>

    </div>
  );

  if (isModal) {
    return (
      <WebsiteLayout isModal onClose={() => (onClose ? onClose() : navigate(-1))}>
        {PageInner}
      </WebsiteLayout>
    );
  }

  return <WebsiteLayout>{PageInner}</WebsiteLayout>;
}
