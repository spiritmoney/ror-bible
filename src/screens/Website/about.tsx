// src/pages/AboutPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HEADER_HEIGHT } from './constants';
import WebsiteLayout from "./WebsiteLayout";
import FeaturesSection from "./featuresAbout";
import { scrollToHash } from "../../utils/scrolToHash"; // fixed import
import PageHero from "./PageHero";
import Section from "./Section";
import "./appMarketingPages.css";


// ---------- Assets (update filenames to match your repo) ----------
import aboutBanner from "../../assets/about/missionBanner.png";
import aboutImg from "../../assets/about/image1.png";
import aboutImg1 from "../../assets/about/about-1.png";
import aboutImg2 from "../../assets/about/about-2.png";
import aboutImg3 from "../../assets/about/about-3.png";
import aboutImg4 from "../../assets/about/about-4.png";
import aboutImg5 from "../../assets/about/about-5.png";
import aboutImg6 from "../../assets/about/about-6.png";
import aboutImg7 from "../../assets/about/about-7.png";
import aboutImg8 from "../../assets/about/about-8.png";
import kc from "../../assets/about/kc.png";
import link from "../../assets/about/link.png";
import press from "../../assets/about/press.png";
import stories from "../../assets/about/stories.png";
import appreciation from "../../assets/about/appreciation.png";
// ------------------------------------------------------------------
export type LinkBadge = { label: string; href: string; icon?: string | React.ReactNode };
export type Bullet = string | { text: string; links?: LinkBadge[] };


type Feature = {
  id: number;
  slugId?: string;
  title?: string;
  description?: string;
  // bullets accepts either string[] or Bullet[]
  bullets?: Bullet[];
  // top-level links still supported if you want general links not tied to a bullet
  links?: LinkBadge[];
  image?: string;
};

type AboutPageProps = {
  isModal?: boolean;
  onClose?: () => void;
};

export default function AboutPage({ isModal = false, onClose }: AboutPageProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isModal) return; // skip when rendering modal overlay
    const state = (location.state as any) || {};
    const slug = state?.scrollTo ?? (window.location.hash ? window.location.hash : undefined);
    if (!slug) return;

    // slug may be 'bible_mobile' (from state) or '#bible_mobile' (from hash)
    const hash = slug.startsWith("#") ? slug : `#${slug}`;

    (async () => {
      // headerOffset is your imported HEADER_HEIGHT
      await scrollToHash(hash, { headerOffset: HEADER_HEIGHT, behavior: "smooth", maxAttempts: 20, retryDelay: 80 });
      // optional: clear the hash from history/state if you don't want it visible
      // window.history.replaceState({}, "", window.location.pathname + window.location.search);
    })();
  }, [location, isModal]);

  // features array
  const features: Feature[] = [
    // feature with paragraph + image (classic)
    {
      id: 1,
      slugId: "bible",
      title: "More Than Just A Bible!",
      description:
        "Apart from the usual electronic stationery features like note-keeping, highlighting, bookmarking etc., this novel app is built on solid interactive technologies that avail users of the opportunities to take advantage of the following extra-special features: inspirational articles reading, access all online or download versions to use offline. Read, study, meditate and triumph in life while you share your victories verses with friends.",
      image: aboutImg1,
    },

    // feature with bullet list + image
    {
      id: 2,
      slugId: "read",
      title: "Read The Rhapsody Bible Daily",
      bullets: [
        "Experience the illumination of God’s Word in 20+ flavors of the Rhapsody Bible",
        "Switch between several Bible versions, in over 70 languages",
        "Offline Feature: Download and read ALL Bibles without Internet access",
        "Read daily Rhapsody of Realities inspirational articles by the author.",
      ],
      image: aboutImg2,
    },

    {
      id: 3,
      slugId: "meditate",
      title: "Study & Meditate On Rhapsody Bible",
      bullets: [
        "Inspirational articles: Do topical study with hundreds of daily inspirations articles by Pastor Chris, all year round",
        "Bible Study Plans: Topical study of the entire Bible using the Rhapsody 1-Year® or 2- Year® Bible Study Planners.",
        "Study Resources: Adopt immersive study, take advantage of study resources like the Hebrew Greek Bible, Enhanced Hebrew & Greek Dictionaries, LoveWorld Concordance, Enhanced Exhaustive Strong’s concordance.",
        "Parallel Study: Use the Split view to enhance your Parallel Bible Study experience; comparing scriptures or scripture in one Bible Version with another.",
      ],
      image: aboutImg3,
    },

    {
      id: 4,
      slugId: "hub",
      title: "Use the Rhapsody Bible with Friends",
      bullets: [
        "Share your daily reading with your friends.",
        "Send your notes via email, KingsChat to loved ones or evangelism contacts.",
      ],
      image: aboutImg4,
    },
    {
      id: 5,
      title: "Customize Your Free Rhapsody Bible",
      bullets: [
        "On-Screen Setting: Make the ROR Bible+ completely yours. Personalize your Bible Study experience. Adjust the fonts, font type, and color to your preference. Switch the reference letters and Strong’s numbers off/on etc.",
        "Easy Reading & Night Mode: Adjust font, text size, and contrast for bright or low-light.",
        "Highlights: Keep your favorite scripture in your choice color",
        "Bookmarks: Smart utility for sharing, memorizing, finding your favorite verses.",
        "Share verses with friends: on social media, email, or via SMS/text,",
        "Notes: Keep your study notes privately, or share them with friends",
        "Cloud Sync: With your free ROR Bible+ account, see all of your Notes, Highlights, Bookmarks, on any supported devices, just at the tap of the Sync button!",
      ],
      image: aboutImg5,
    },


    {
      id: 6,
      title: "Connect With ROR Bible+",
      bullets: [
        "Contact support from inside the ROR Bible+ App",
        {
          text: "Follow us on KingsChat app, download @:",
          links: [
            { label: "ROR Bible+ Superuser", href: "https://kingschat.online/user/rorbible", icon: kc },
          ],
        },
        {
          text: "Keep current on our blog:",
          links: [{ label: "https://blog.rorbible.plus", href: "#blog", icon: link }],
        },
        {
          text: "ROR Bible+ Online:",
          links: [{ label: "https://www.rorbible.plus", href: "/bible-online", icon: link }],
        },
      ],
      image: aboutImg6,
    },
    {
      id: 7,
      slugId: "version",
      title: "Several ROR Bible Versions:",
      bullets: [
        "King James Version (KJV)",
        "New King James Version (NKJV)",
        "Amplified Classic Bible (AMPC)",
        "New International Version (NIV)",
        "New Living Translation (NLT)",
        "English Standard Version (ESV)",
        "The Message (MSG)",
        "and many more! ",
      ],
      image: aboutImg7,
    },
    {
      id: 8,
      slugId: "lang",
      title: "More Than 2000+ Int’l Languages",
      description:
        "English, Spanish, Hindi, Urdu, Myanmar, Mandarin, Portuguese, Korean, German, French, Russian, Malayalam, Indonesian, Arabic, Zulu, Efik, Igbo, Tagalog, Bengali, Nepali, Swedish, Norwegian, Kazakh, Acehnese, Cebuano, Turkmen, Mongol, Javanese, Kannada, Italian, Afrikaans, Albanian, Amharic, Bulgarian, Czech, Farsi, Gujarati, Hebrew, Marathi, Orija, Swahili, Thai, Ukrainian, Vietnamese, Latvian.",
      image: aboutImg8,
    },



  ];

  const finalFeature: Feature[] = [
    {
      id: 1,
      slugId: "stories",
      title: "Stories",
      description:
        "See how God is using ROR Bible+ to impact lives across the world.",
      links: [
        { label: "Read More", href: "/about" },
      ],
      image: stories,
    },
    {
      id: 2,
      slugId: "press",
      title: "Press",
      description:
        "ROR Bible+ have been covered by the press all over the world.",
      links: [
        { label: "Read More", href: "/about" },
      ],
      image: press,
    },
  ];

  // layout sizing (tweak if needed)
  const imgW = 469;
  const imgH = 487;

  const [isLg, setIsLg] = useState<boolean>(() => (typeof window !== "undefined" ? window.innerWidth >= 1024 : false));
  useEffect(() => {
    const onResize = () => setIsLg(window.innerWidth >= 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // hash scrolling support (direct visits)
  useEffect(() => {
    if (isModal) return;

    // get slug from state or hash
    const state = (location.state as any) || {};
    let slug = state.scrollTo || window.location.hash;

    if (!slug) return;

    // normalize format
    const hash = slug.startsWith("#") ? slug : `#${slug}`;

    // Update the browser URL if state.scrollTo was used
    if (!window.location.hash && state.scrollTo) {
      window.history.replaceState({}, "", `${window.location.pathname}${hash}`);
    }

    // Scroll after mount/layout
    const timer = setTimeout(() => {
      scrollToHash(hash, {
        headerOffset: HEADER_HEIGHT,
        behavior: "smooth",
        maxAttempts: 20,
        retryDelay: 80,
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [location, isModal]);


  // PageInner (shared between modal & full-page)
  const PageInner = (
    <div className="website-root app-marketing-page bg-brand-pale text-brand-navy font-montserrat">
      <PageHero
        eyebrow="About ROR Bible+"
        title="More than a Bible app"
        description="Interactive study, daily Rhapsody articles, and tools to read, share, and grow—free for millions worldwide."
      />
      <div className="w-full">
        <div className="relative w-full overflow-hidden">
          <img src={aboutBanner} alt="About banner" className="w-full h-auto object-contain " draggable={false} />
        </div>
      </div>

      {/* Intro image block */}
      <img src={aboutImg} alt="About ROR Bible" className="w-full h-full object-cover" />

      {/* callout paragraph */}

      <Section innerClassName="app-marketing-section text-center max-w-4xl">
        <p className="app-marketing-intro font-semibold">
          All around the world, over 3 billion people are daily reading and sharing the #1 best-selling  daily devotional “Rhapsody of Realities” by Rev. (Dr.) Chris Oyakhilome, DSc. DSc. DD., completely free. From the desk of the same author, comes the ROR Bible+, a fully interactive Bible reader developed to deliver the most exhilarating study experience!
        </p>
      </Section>

      <Section innerClassName="app-marketing-section" pad="tight">
        <FeaturesSection features={features} imgW={imgW} imgH={imgH} isLg={isLg} />
      </Section>

      {/* Appreciation */}
      <img src={appreciation} alt="Appreciation block" className="w-full h-full object-cover" />

      <Section innerClassName="app-marketing-section" pad="tight">
        <FeaturesSection features={finalFeature} imgW={imgW} imgH={imgH} isLg={isLg} />
      </Section>
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
