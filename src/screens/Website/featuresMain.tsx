import React from 'react';
import { Link } from 'react-router-dom';
import {
  WebsiteDownloadRoute,
  WebsiteFeaturesRoute,
  WebsitePricingRoute,
  WebsiteProductDesktopRoute,
  WebsiteProductMobileRoute,
  WebsiteProductVoiceRoute,
  WebsiteProductWebRoute,
} from './websitePaths';
import heroIpad from '../../assets/website/new/hero-ipad-reader.jpg';
import tvPoster from '../../assets/website/new/tv-promo-poster.jpg';
import f1 from '../../assets/website/new/feature-01-personalized-study.jpg';
import f2 from '../../assets/website/new/feature-02-solution-search.jpg';
import f3 from '../../assets/website/new/feature-03-audio-bible.jpg';
import f4 from '../../assets/website/new/feature-04-pulpit.jpg';
import f5 from '../../assets/website/new/feature-05-study-resources.jpg';
import f6 from '../../assets/website/new/feature-06-parallel-study.jpg';
import f7 from '../../assets/website/new/feature-07-study-utilities.jpg';
import f8 from '../../assets/website/new/feature-08-roar.jpg';
import f9 from '../../assets/website/new/feature-09-colour-search.jpg';
import f10 from '../../assets/website/new/feature-10-study-workspace.jpg';
import bibleOnline from '../../assets/website/new/bible-online-reader.jpg';
import MarketingStoreBadgeRow from '../../components/Website/MarketingStoreBadgeRow';
import macos from '../../assets/website/new/macos.png';
import windows from '../../assets/website/new/windows.png';
import linux from '../../assets/website/new/linux.png';
import icon from '../../assets/website/new/ror-bible-plus-icon.png';

export default function FeaturesMain() {
  return (
    <>
<section className="hero u2a5dd6">
<svg className="u16c3e3" aria-hidden="true" viewBox="0 0 1440 160" preserveAspectRatio="none"><path d="M0 120 C 360 40, 720 150, 1440 60 L1440 160 L0 160 Z" fill="#07BDD2" opacity="0.10"/><path d="M0 132 C 380 60, 760 160, 1440 78" fill="none" stroke="#099DB2" strokeWidth="22" opacity="0.55"/><path d="M0 112 C 380 40, 760 140, 1440 56" fill="none" stroke="#FF5900" strokeWidth="3"/><path d="M0 150 C 380 80, 760 176, 1440 98" fill="none" stroke="#07BDD2" strokeWidth="2.5"/></svg>
<div className="wrap ue57381">
<div className="u0f1001">
<p className="ud434d3">Features</p><span className="ud6a536" aria-hidden="true"></span>
<h1 className="u0288f9">Ten ways to go deeper in <span className="ub8bc62">the Word.</span></h1>
<p className="ueba38e">Reading, research, ministry and audio, all completed and working together in one premium Bible experience.</p>
<div className="u3f28ac"><Link className="u5c4e6f" to={WebsiteDownloadRoute}>Get the app</Link><Link className="ubee0d4" to={WebsitePricingRoute}>See pricing</Link></div>
</div>

</div>
</section><section className="u181a21"><div className="wrap uc50b6f"><a className="u1e36e9" href="#f1"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M9 7h6"/></svg>Personalized Study Experience</a><a className="u1e36e9" href="#f2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.3-4.3"/></svg>Solution Search</a><a className="u1e36e9" href="#f3"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/></svg>Personalized Audio Bible</a><a className="u1e36e9" href="#f4"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 21h12"/><path d="M8 21V11h8v10"/><path d="M5 11h14l-2-4H7z"/><path d="M12 3v4"/></svg>@Pulpit</a><a className="u1e36e9" href="#f5"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h10M9 4v2c0 4-2 7-5 9"/><path d="M6 10c1 2 3 4 6 5"/><path d="M13 20l4-9 4 9M14.5 17h5"/></svg>Study Resources</a><a className="u1e36e9" href="#f6"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="8" height="16" rx="1.5"/><rect x="13" y="4" width="8" height="16" rx="1.5"/></svg>Parallel Study</a><a className="u1e36e9" href="#f7"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h10l4 4v14H5z"/><path d="M9 12h6M9 16h4"/></svg>Study Utilities</a><a className="u1e36e9" href="#f8"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg>ROAR Study Bible</a><a className="u1e36e9" href="#f9"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1.3"/><circle cx="12" cy="7.5" r="1.3"/><circle cx="15.5" cy="10" r="1.3"/><path d="M12 21a3 3 0 0 1 0-6h2"/></svg>Colour Search</a><a className="u1e36e9" href="#f10"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/></svg>Study Workspace</a></div></section><section className="u1f2e13" id="f1">
<div className="wrap ud22e27">
<div className="ue0dc9a">
<div className="u8b741b"><span className="ub35cb2">01</span><span className="uf9a5d2">Personalized Study Experience</span></div>
<h2 className="u710805">Read. Study. Meditate. <span className="ub8bc62">Triumph.</span></h2>
<p className="u5e9fe0">A beautifully personal space for Scripture, study and reflection.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Choose a reading layout that suits your study</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Adjust fonts, themes and display preferences</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Follow Scripture references in pop-up windows</span></li></ul>
</div>
<div className="ue041ad">
<div className="uf4a7cd"><img className="u024490" src={f1} alt="ROR Bible+ Personalized Study Experience shown on iPhone" /></div>
</div>
</div>
</section>
<section className="u58232d" id="f2">
<div className="wrap u19694f">
<div className="ue0dc9a">
<div className="u8b741b"><span className="ub35cb2">02</span><span className="uf9a5d2">Solution Search</span></div>
<h2 className="u710805">Bring your questions to <span className="ub8bc62">Scripture.</span></h2>
<p className="u5e9fe0">Explore with Student Agent or go deeper with Minister Agent.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Ask everyday questions in plain language</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Student Agent for guided Scripture-based study</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Minister Agent for deeper biblical research, with references and source context</span></li></ul>
</div>
<div className="ue041ad">
<div className="uf4a7cd"><img className="u024490" src={f2} alt="ROR Bible+ Solution Search shown on iPhone" /></div>
</div>
</div>
</section>
<section className="u1f2e13" id="f3">
<div className="wrap ud22e27">
<div className="ue0dc9a">
<div className="u8b741b"><span className="ub35cb2">03</span><span className="uf9a5d2">Personalized Audio Bible</span></div>
<h2 className="u710805">Hear the Word in <span className="ub8bc62">Pastor Chris’s</span> voice.</h2>
<p className="u5e9fe0">Listen to the ROR Audio Bible and explore audio commentaries.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>The ROR Audio Bible in Pastor Chris’s voice</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Pastor Chris audio commentaries</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Read-to-Me and playback controls with verse follow</span></li></ul>
</div>
<div className="ue041ad">
<div className="uf4a7cd"><img className="u024490" src={f3} alt="ROR Bible+ Personalized Audio Bible shown on iPhone" /></div>
</div>
</div>
</section>
<section className="u58232d" id="f4">
<div className="wrap u19694f">
<div className="ue0dc9a">
<div className="u8b741b"><span className="ub35cb2">04</span><span className="uf9a5d2">@Pulpit</span></div>
<h2 className="u710805">From revelation to <span className="ub8bc62">ministration.</span></h2>
<p className="u5e9fe0">Shape your study into a message with Scripture and personal notes.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>A sermon preparation workspace</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Organize Scripture, personal notes and research</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Keep source context close to your message</span></li></ul>
</div>
<div className="ue041ad">
<div className="uf4a7cd"><img className="u024490" src={f4} alt="ROR Bible+ @Pulpit shown on iPhone" /></div>
</div>
</div>
</section>
<section className="u1f2e13" id="f5">
<div className="wrap ud22e27">
<div className="ue0dc9a">
<div className="u8b741b"><span className="ub35cb2">05</span><span className="uf9a5d2">Study Resources</span></div>
<h2 className="u710805">Discover the depth of <span className="ub8bc62">every word.</span></h2>
<p className="u5e9fe0">Explore Hebrew and Greek with Strong’s and dictionary resources.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Hebrew Greek KJV Bible and Strong’s Concordance</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>LoveWorld Concordance</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Hebrew and Greek dictionaries with linked words</span></li></ul>
</div>
<div className="ue041ad">
<div className="uf4a7cd"><img className="u024490" src={f5} alt="ROR Bible+ Study Resources shown on iPhone" /></div>
</div>
</div>
</section>
<section className="u58232d" id="f6">
<div className="wrap u19694f">
<div className="ue0dc9a">
<div className="u8b741b"><span className="ub35cb2">06</span><span className="uf9a5d2">Parallel Study</span></div>
<h2 className="u710805">See Scripture <span className="ub8bc62">side by side.</span></h2>
<p className="u5e9fe0">Compare translations and follow the meaning in context.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Read translations side by side</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Compare verses across available editions</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Follow cross-references in their wider context</span></li></ul>
</div>
<div className="ue041ad">
<div className="uf4a7cd"><img className="u024490" src={f6} alt="ROR Bible+ Parallel Study shown on iPhone" /></div>
</div>
</div>
</section>
<section className="u1f2e13" id="f7">
<div className="wrap ud22e27">
<div className="ue0dc9a">
<div className="u8b741b"><span className="ub35cb2">07</span><span className="uf9a5d2">Study Utilities</span></div>
<h2 className="u710805">Keep every insight <span className="ub8bc62">close.</span></h2>
<p className="u5e9fe0">Highlight precisely. Add notes. Record your reflections.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Highlight words, phrases and passages</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Personal notes, voice notes and bookmarks</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Cloud sync across your devices</span></li></ul>
</div>
<div className="ue041ad">
<div className="uf4a7cd"><img className="u024490" src={f7} alt="ROR Bible+ Study Utilities shown on iPhone" /></div>
</div>
</div>
</section>
<section className="u58232d" id="f8">
<div className="wrap u19694f">
<div className="ue0dc9a">
<div className="u8b741b"><span className="ub35cb2">08</span><span className="uf9a5d2">ROAR Study Bible</span></div>
<h2 className="u710805">Go deeper with <span className="ub8bc62">ROAR.</span></h2>
<p className="u5e9fe0">Explore Scripture-linked annotations from Rev. Chris Oyakhilome.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Rev. Chris Oyakhilome’s Annotated Reference Study Bible</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Scripture-linked annotations</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Integrated study resources</span></li></ul>
</div>
<div className="ue041ad">
<div className="uf4a7cd"><img className="u024490" src={f8} alt="ROR Bible+ ROAR Study Bible shown on iPhone" /></div>
</div>
</div>
</section>
<section className="u1f2e13" id="f9">
<div className="wrap ud22e27">
<div className="ue0dc9a">
<div className="u8b741b"><span className="ub35cb2">09</span><span className="uf9a5d2">Colour Search</span></div>
<h2 className="u710805">Find it. Return to it. <span className="ub8bc62">Study it.</span></h2>
<p className="u5e9fe0">Search words, use filters and rediscover your highlights.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Exact-word and any-word search</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Predictive suggestions, voice input and scope filters</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Colour search to rediscover your highlights</span></li></ul>
</div>
<div className="ue041ad">
<div className="uf4a7cd"><img className="u024490" src={f9} alt="ROR Bible+ Colour Search shown on iPhone" /></div>
</div>
</div>
</section>
<section className="u58232d" id="f10">
<div className="wrap u19694f">
<div className="ue0dc9a">
<div className="u8b741b"><span className="ub35cb2">10</span><span className="uf9a5d2">Study Workspace</span></div>
<h2 className="u710805">Make room for the way <span className="ub8bc62">you study.</span></h2>
<p className="u5e9fe0">Choose your layout, theme and reading preferences.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Multiple reading layouts</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Light and dark themes</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Large-screen arrangements on tablet and desktop</span></li></ul>
</div>
<div className="ue041ad">
<div className="uf4a7cd"><img className="u024490" src={f10} alt="ROR Bible+ Study Workspace shown on iPhone" /></div>
</div>
</div>
</section>
<section className="u076bca"><div className="wrap u3cf3d8"><p className="u4b3411">Some features and resources require a subscription. Available editions, audio, resources and functions depend on your plan, content catalogue and supported device. Online services require an internet connection.</p></div></section><section className="u1717c3">
<div className="wrap u22987b">
<div className="ua1643c">
<p className="uaf3e36">Mobile · Web · Desktop · Voice</p><span className="ud6a536" aria-hidden="true"></span>
<h2 className="u0e7c8b">One Bible experience. <span className="u3d7a5b">Four ways in.</span></h2>
</div>
<div className="u75373c">
<Link to={WebsiteProductMobileRoute} className="card-lift u4a141a">
<div className="u488875"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#07BDD2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg></div>
<span className="u85f414">ROR Bible+ Mobile</span>
<span className="uc374fb">The Word <span className="u3d7a5b">wherever you go.</span></span>
<span className="u8c9a26">Android and iOS</span>
<span className="ua7411f">Explore Mobile <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</Link>
<Link to={WebsiteProductWebRoute} className="card-lift u4a141a">
<div className="u488875"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#07BDD2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg></div>
<span className="u85f414">ROR Bible+ Web</span>
<span className="uc374fb">Open your browser. Open <span className="u3d7a5b">the Word.</span></span>
<span className="u8c9a26">Bible Online and Bible Lite (PWA)</span>
<span className="ua7411f">Explore Web <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</Link>
<Link to={WebsiteProductDesktopRoute} className="card-lift u4a141a">
<div className="u488875"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#07BDD2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg></div>
<span className="u85f414">ROR Bible+ Desktop</span>
<span className="uc374fb">More room for <span className="u3d7a5b">deeper study.</span></span>
<span className="u8c9a26">MacOS, Windows and Linux</span>
<span className="ua7411f">Explore Desktop <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</Link>
<Link to={WebsiteProductVoiceRoute} className="card-lift u4a141a">
<div className="u488875"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#07BDD2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></div>
<span className="u85f414">ROR Bible+ Voice</span>
<span className="uc374fb">Speak. Listen. Engage with <span className="u3d7a5b">the Word.</span></span>
<span className="u8c9a26">Amazon Alexa and Google Home</span>
<span className="ua7411f">Explore Voice <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</Link>
</div>
</div>
</section><section className="ub9a234">
<div className="wrap uada6f3">
<div className="u3fdbdb">
<h2 className="u79d33f">Download ROR Bible+ and begin your next discovery in <span className="u3d7a5b">the Word.</span></h2>
<p className="ub4344f">Free to download. Some features and resources require a subscription.</p>
</div>
<div className="u3e7f6a">
<MarketingStoreBadgeRow />
<Link className="u74c5a0" to={WebsiteProductDesktopRoute}>Also on MacOS, Windows and Linux →</Link>
</div>
</div>
</section>
    </>
  );
}
