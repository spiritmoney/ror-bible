// src/components/footer.tsx
import React, { useEffect, useState } from 'react';
import logo from '../../assets/website/footerLogo.png';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { activeNavAtom } from 'store/atoms/general';
import { getCurrentYear } from '../../utils/year';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useRecoilState(activeNavAtom);

  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    const onResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 768) {
        // clear mobile open state on larger screens
        setOpenSection(null);
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const goToProduct = (slug: string) => {
    setActiveNav('products');
    navigate(`/product#${slug}`);
  };
  const goToAbout = (slug: string) => {
    setActiveNav('about');
    navigate(`/about#${slug}`);
  };
  const goToPartner = (slug: string) => {
    setActiveNav('partner');
    navigate(`/partner#${slug}`);
  };

  const toggleSection = (key: string) => {
    setOpenSection(prev => (prev === key ? null : key));
  };

  // Collapsible area with per-item cascading transition (only used for small screens)
  const Collapsible: React.FC<{
    isOpen: boolean;
    children: React.ReactNode;
  }> = ({ isOpen, children }) => {
    return (
      <div
        className={`overflow-hidden transition-[max-height] duration-900 ease-in-out ${isOpen ? 'max-h-[720px]' : 'max-h-0'} md:max-h-none md:block`}
      >
        <div className="md:block">
          {React.Children.toArray(children).map((child, i) => {
            const delay = `${i * 60}ms`;
            return (
              <div
                key={i}
                style={{ transitionDelay: delay }}
                className={`transform transition-all duration-900 ease-in-out md:opacity-100 md:translate-y-0 ${
                  isOpen
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-2 md:opacity-100 md:translate-y-0'
                }`}
              >
                <div className="block w-full md:w-auto">{child}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // header-clicks: toggle on small screens, navigate on md+
  const handleProductsHeaderClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768)
      toggleSection('products');
    else goToProduct('bible_online');
  };

  const handleAboutHeaderClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768)
      toggleSection('about');
    else goToAbout('read');
  };

  return (
    // fixed small-screen height; md restores normal height/flow
    <footer className="bg-[#f5f3f4] text-black p-6 md:p-8">
      {/* outer constrained area: fixed height on small screens so inner middle becomes scrollable */}
      <div className="max-w-7xl mx-auto h-[360px] md:h-auto">
        <div className="flex flex-col h-full">
          {/* TOP area: logo + for md+ the columns (kept intact) */}
          <div className="flex items-center justify-center md:justify-evenly pb-4 md:pb-0">
            {/* Logo & quick links (always visible) */}
            <div className="flex flex-col mt-0 space-y-2 leading-none min-w-0 md:items-start  self-start">
              <img
                src={logo}
                alt="ROR Bible"
                className="w-40 mx-auto md:mx-0"
              />
              <a
                href="https://kingschat.online/user/rorbible"
                className="text-[13px] leading-none hover:underline block  text-center"
              >
                Technical Support
              </a>
              <a
                href="https://kingschat.online/user/rorbible"
                className="text-[13px] leading-none hover:underline block  text-center"
              >
                Contact Us
              </a>
            </div>

            {/* md+ multi-column (kept exactly as before) */}
            <div className="hidden md:flex md:gap-16">
              {/* Products (md+) */}
              <div className="flex flex-col space-y-2 min-w-0 items-start">
                <h5
                  onClick={() => goToProduct('bible_online')}
                  className="text-m font-semibold cursor-pointer"
                >
                  Products
                </h5>
                <button
                  onClick={() => goToProduct('bible_online')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  Bible Online
                </button>
                <button
                  onClick={() => goToProduct('bible_lite')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  Bible Lite (Web App)
                </button>
                <button
                  onClick={() => goToProduct('bible_mobile')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  Bible Mobile (Android & iOS)
                </button>
                <button
                  onClick={() => goToProduct('bible_desktop')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  Bible Desktop (MacOS, Windows & Linux)
                </button>
                <button
                  onClick={() => goToProduct('ror_voiceApp')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  Rhapsody Voice App
                </button>
                <button
                  onClick={() => goToProduct('@myspot')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  @MySpot - Digital Evangelism Tool
                </button>
                <a
                  href="/product"
                  className="text-[13px] hover:underline w-full md:w-auto block text-center"
                >
                  RORK Bible for Kids
                </a>
                <a
                  href="/product"
                  className="text-[13px] hover:underline w-full md:w-auto block text-center"
                >
                  Teevo Bible for Teens
                </a>
              </div>

              {/* About (md+) */}
              <div className="flex flex-col space-y-2 min-w-0 items-start">
                <h5
                  onClick={() => goToAbout('read')}
                  className="text-m font-semibold cursor-pointer"
                >
                  About ROR Bible+
                </h5>
                <button
                  onClick={() => goToAbout('read')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  Mission
                </button>
                <button
                  onClick={() => goToAbout('stories')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  Stories
                </button>
                <button
                  onClick={() => goToAbout('bible')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  Careers
                </button>
                <button
                  onClick={() => goToAbout('hub')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  Global Hubs
                </button>
                <button
                  onClick={() => goToAbout('lang')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  Bible Translation
                </button>
                <button
                  onClick={() => goToAbout('press')}
                  className="text-[13px] hover:underline w-full md:w-auto text-center block"
                >
                  Press
                </button>
              </div>

              {/* Partners (md+) */}
              <div className="flex flex-col space-y-2 min-w-0 items-start">
                <h5
                  onClick={() => goToPartner('be_a_translator')}
                  className="text-m font-semibold cursor-pointer"
                >
                  Partners
                </h5>
                <button
                  onClick={() => goToPartner('content_partners')}
                  className="text-[13px] hover:underline w-full md:w-auto block text-center"
                >
                  Content Partner
                </button>
                <button
                  onClick={() => goToPartner('ror_bible_partners')}
                  className="text-[13px] hover:underline w-full md:w-auto block text-center"
                >
                  Bible Partner
                </button>
                <button
                  onClick={() => goToPartner('churches')}
                  className="text-[13px] hover:underline w-full md:w-auto block text-center"
                >
                  Churches
                </button>
                <button
                  onClick={() => goToPartner('be_a_translator')}
                  className="text-[13px] hover:underline w-full md:w-auto block text-center"
                >
                  Volunteers
                </button>
                <a
                  href="/give"
                  className="text-[13px] hover:underline w-full md:w-auto block text-center"
                >
                  Give
                </a>
              </div>

              {/* Follow (md+) */}
              <div className="flex flex-col space-y-2 min-w-0 items-start">
                <h5 className="text-m font-semibold">Follow Us</h5>
                <a
                  href="https://kingschat.online/user/rorbible"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] hover:underline w-full md:w-auto block text-center"
                >
                  KingChat
                </a>
                <a
                  href="/blog"
                  className="text-[13px] hover:underline w-full md:w-auto block text-center"
                >
                  CeFlix
                </a>
                <a
                  href="/blog"
                  className="text-[13px] hover:underline w-full md:w-auto block text-center"
                >
                  Blog
                </a>
              </div>
            </div>
          </div>

          {/* MIDDLE scrollable area (only for small screens) */}
          <div className="flex-1 overflow-auto md:hidden px-4">
            {/* Products */}
            <div className="mb-4">
              <h5
                onClick={handleProductsHeaderClick}
                className="text-m font-semibold cursor-pointer text-center"
              >
                Products
              </h5>
              <Collapsible isOpen={openSection === 'products'}>
                <button
                  onClick={() => goToProduct('bible_online')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  Bible Online
                </button>
                <button
                  onClick={() => goToProduct('bible_lite')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  Bible Lite (Web App)
                </button>
                <button
                  onClick={() => goToProduct('bible_mobile')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  Bible Mobile (Android & iOS)
                </button>
                <button
                  onClick={() => goToProduct('bible_desktop')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  Bible Desktop (MacOS, Windows & Linux)
                </button>
                <button
                  onClick={() => goToProduct('ror_voiceApp')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  Rhapsody Voice App
                </button>
                <button
                  onClick={() => goToProduct('@myspot')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  @MySpot - Digital Evangelism Tool
                </button>
                <a
                  href="/product"
                  className="text-[13px] hover:underline w-full block text-center"
                >
                  RORK Bible for Kids
                </a>
                <a
                  href="/product"
                  className="text-[13px] hover:underline w-full block text-center"
                >
                  Teevo Bible for Teens
                </a>
              </Collapsible>
            </div>

            {/* About */}
            <div className="mb-4">
              <h5
                onClick={handleAboutHeaderClick}
                className="text-m font-semibold cursor-pointer text-center"
              >
                About ROR Bible+
              </h5>
              <Collapsible isOpen={openSection === 'about'}>
                <button
                  onClick={() => goToAbout('read')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  Mission
                </button>
                <button
                  onClick={() => goToAbout('stories')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  Stories
                </button>
                <button
                  onClick={() => goToAbout('bible')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  Careers
                </button>
                <button
                  onClick={() => goToAbout('hub')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  Global Hubs
                </button>
                <button
                  onClick={() => goToAbout('lang')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  Bible Translation
                </button>
                <button
                  onClick={() => goToAbout('press')}
                  className="text-[13px] hover:underline w-full text-center block"
                >
                  Press
                </button>
              </Collapsible>
            </div>

            {/* Partners */}
            <div className="mb-4">
              <h5
                className="text-m font-semibold cursor-pointer text-center"
                onClick={() => toggleSection('partners')}
              >
                Partners
              </h5>
              <Collapsible isOpen={openSection === 'partners'}>
                <button
                  onClick={() => goToPartner('content_partners')}
                  className="text-[13px] hover:underline w-full block text-center"
                >
                  Content Partner
                </button>
                <button
                  onClick={() => goToPartner('ror_bible_partners')}
                  className="text-[13px] hover:underline w-full block text-center"
                >
                  Bible Partner
                </button>
                <button
                  onClick={() => goToPartner('churches')}
                  className="text-[13px] hover:underline w-full block text-center"
                >
                  Churches
                </button>
                <button
                  onClick={() => goToPartner('be_a_translator')}
                  className="text-[13px] hover:underline w-full block text-center"
                >
                  Volunteers
                </button>
                <a
                  href="/give"
                  className="text-[13px] hover:underline w-full block text-center"
                >
                  Give
                </a>
              </Collapsible>
            </div>

            {/* Follow */}
            <div className="mb-4">
              <h5
                className="text-m font-semibold cursor-pointer text-center"
                onClick={() => toggleSection('follow')}
              >
                Follow Us
              </h5>
              <Collapsible isOpen={openSection === 'follow'}>
                <a
                  href="https://kingschat.online/user/rorbible"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] hover:underline w-full block text-center"
                >
                  KingChat
                </a>
                <a
                  href="/blog"
                  className="text-[13px] hover:underline w-full block text-center"
                >
                  CeFlix
                </a>
                <a
                  href="/blog"
                  className="text-[13px] hover:underline w-full block text-center"
                >
                  Blog
                </a>
              </Collapsible>
            </div>
          </div>

          {/* COPYRIGHT - fixed inside footer (not inside scroll area) */}
          <div className="mt-6 text-center text-[13px] border-t border-[#D5D1D1] pt-4 bg-[#f5f3f4]">
            <p className="hidden md:block">
              {getCurrentYear()} &copy; ROR Bible+. All Rights Reserved |
              Privacy | Terms of Use
            </p>

            <p className="md:hidden">
              {getCurrentYear()} &copy; ROR Bible+.
              <br />
              All Rights Reserved | Privacy | Terms of Use
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
