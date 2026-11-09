import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  WebsiteDownloadRoute,
  WebsiteFeaturesRoute,
  WebsiteProductDesktopRoute,
  WebsiteProductMobileRoute,
  WebsiteProductVoiceRoute,
  WebsiteProductWebRoute,
} from './websitePaths';
import heroIpad from '../../assets/website/new/hero-ipad-reader.jpg';
import tvPoster from '../../assets/website/new/tv-promo-poster.jpg';
import f2 from '../../assets/website/new/feature-02-solution-search.jpg';
import f3 from '../../assets/website/new/feature-03-audio-bible.jpg';
import f4 from '../../assets/website/new/feature-04-pulpit.jpg';
import f8 from '../../assets/website/new/feature-08-roar.jpg';
import MarketingStoreBadgeRow from '../../components/Website/MarketingStoreBadgeRow';

export default function HomeMain() {
  const posterRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromo = () => {
    const v = videoRef.current;
    if (v) {
      v.hidden = false;
      v.style.display = 'block';
      if (posterRef.current) posterRef.current.hidden = true;
      void v.play();
    }
  };

  return (
    <>
<section className="hero u4ae379">
<svg className="u16c3e3" aria-hidden="true" viewBox="0 0 1440 160" preserveAspectRatio="none"><path d="M0 120 C 360 40, 720 150, 1440 60 L1440 160 L0 160 Z" fill="#07BDD2" opacity="0.10"/><path d="M0 132 C 380 60, 760 160, 1440 78" fill="none" stroke="#099DB2" strokeWidth="22" opacity="0.55"/><path d="M0 112 C 380 40, 760 140, 1440 56" fill="none" stroke="#FF5900" strokeWidth="3"/><path d="M0 150 C 380 80, 760 176, 1440 98" fill="none" stroke="#07BDD2" strokeWidth="2.5"/></svg>
<div className="wrap u8343ca">
<div className="u0582f4">
<p className="ud434d3">Now on Mobile · Web · Desktop · Voice</p><span className="ud6a536" aria-hidden="true"></span>
<h1 className="u173aca">Read. Study. Meditate. <span className="ub8bc62">Triumph.</span></h1>
<p className="u7b00c8">The Word. Across your <span className="ub8bc62">world.</span></p>
<p className="u9a3d6a">A premium digital Bible experience for personal revelation, deeper study and inspired ministry: your Bible, study resources and personal insights in one workspace.</p>
<div className="uba2fef">
<Link className="u5c4e6f" to={WebsiteDownloadRoute}>Get the app</Link>
<Link className="ubee0d4" to="/bible-online">Open Bible Online</Link>
<a className="ufc8380" href="#promo"><span className="u7c01c9"><svg width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg></span>Watch the TV promo</a>
</div>
<div className="u316a78">
<Link className="uc3e556" to={WebsiteProductMobileRoute}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg>Mobile</Link><Link className="uc3e556" to={WebsiteProductWebRoute}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>Web</Link><Link className="uc3e556" to={WebsiteProductDesktopRoute}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>Desktop</Link><Link className="uc3e556" to={WebsiteProductVoiceRoute}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>Voice</Link></div>
</div>
<div className="u1c0f7c"><div className="u939366"><img className="u024490" src={heroIpad} alt="ROR Bible+ Reader on iPad showing Joshua 1 with Strong's links and the Personalized Study Experience seal" /></div></div>
</div>
</section><section className="u7869ae" id="promo">
<div className="wrap udc35fb">
<div className="u6c7c29">
<p className="ud434d3">ROR Bible+ TV promo</p><span className="ud6a536" aria-hidden="true"></span>
<h2 className="uc59461">See ROR Bible+ <span className="ub8bc62">in action.</span></h2>
<p className="u5e9fe0">Watch how readers, students and ministers go deeper in the Word.</p>
</div>
<div className="u78164f">
<div ref={posterRef} className="promo-poster u64b517">
<img className="u9753d2" src={tvPoster} alt="" />
<div className="u3f945b" aria-hidden="true"></div>
<button type="button" className="u113805" onClick={playPromo} aria-label="Play the ROR Bible+ TV promo" data-play-promo>
<svg width="36" height="36" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>
</button>
<div className="uf3342a">
<span>0:00 / 2:24</span><span className="u4dc7e3"></span><span>TV promo</span>
</div>
<video className="u5be1ed" ref={videoRef} id="promo-video" hidden style={{ display: 'none' }} controls preload="none" poster={tvPoster}><source src={`${process.env.PUBLIC_URL || ""}/media/ror-bible-plus-tv-promo.mp4`} type="video/mp4" /></video>
</div>
</div>
</div>
</section><section className="ud2629f">
<div className="wrap ua1f9af">
<div className="uedada6">
<div className="u73f33a">
<p className="ud434d3">Discover the depth of Scripture</p><span className="ud6a536" aria-hidden="true"></span>
<h2 className="uc59461">Everything you need to go deeper in <span className="ub8bc62">the Word.</span></h2>
</div>
<Link className="u96dab7" to={WebsiteFeaturesRoute}>See all features <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
</div>
<div className="u75373c"><div className="card-lift ud82446">
<div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M9 7h6"/></svg></div>
<h3 className="uf68eab">Read with comfort</h3>
<p className="uf80661">Choose a layout, adjust fonts and themes, and follow references in pop-up windows.</p>
</div><div className="card-lift ud82446">
<div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="8" height="16" rx="1.5"/><rect x="13" y="4" width="8" height="16" rx="1.5"/></svg></div>
<h3 className="uf68eab">Compare and understand</h3>
<p className="uf80661">Read translations side by side and follow cross-references in context.</p>
</div><div className="card-lift ud82446">
<div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h10M9 4v2c0 4-2 7-5 9"/><path d="M6 10c1 2 3 4 6 5"/><path d="M13 20l4-9 4 9M14.5 17h5"/></svg></div>
<h3 className="uf68eab">Explore the original words</h3>
<p className="uf80661">Hebrew Greek KJV Bible, Strong’s, LoveWorld Concordance and dictionaries.</p>
</div><div className="card-lift ud82446">
<div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h10l4 4v14H5z"/><path d="M9 12h6M9 16h4"/></svg></div>
<h3 className="uf68eab">Capture your insights</h3>
<p className="uf80661">Highlight precisely, add notes and voice notes, and bookmark verses.</p>
</div></div>
</div>
</section><section className="uca5018">
<div className="wrap u81a29b">
<div className="ua1643c">
<p className="ud434d3">Distinctive to ROR Bible+</p><span className="ud6a536" aria-hidden="true"></span>
<h2 className="uc59461">For readers, students and <span className="ub8bc62">ministers.</span></h2>
</div>
<div className="ua745ac">
<div className="ue0dc9a">
<div className="u958509"><div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.3-4.3"/></svg></div><span className="uf9a5d2">Solution Search</span></div>
<h3 className="u90c0c7">Bring your questions to <span className="ub8bc62">Scripture.</span></h3>
<p className="u5e9fe0">Explore with Student Agent or go deeper with Minister Agent.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Ask everyday questions in plain language</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Student Agent for guided Scripture-based study</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Minister Agent for deeper biblical research, with references and source context</span></li></ul>
</div>
<div className="u76bd7b">
<div className="ue8e5ca"><img className="u024490" src={f2} alt="ROR Bible+ Solution Search shown on iPhone" /></div>
</div>
</div>
<div className="uc0de80">
<div className="ue0dc9a">
<div className="u958509"><div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/></svg></div><span className="uf9a5d2">Personalized Audio Bible</span></div>
<h3 className="u90c0c7">Hear the Word in <span className="ub8bc62">Pastor Chris’s</span> voice.</h3>
<p className="u5e9fe0">Listen to the ROR Audio Bible and explore audio commentaries.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>The ROR Audio Bible in Pastor Chris’s voice</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Pastor Chris audio commentaries</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Read-to-Me and playback controls with verse follow</span></li></ul>
</div>
<div className="u76bd7b">
<div className="ue8e5ca"><img className="u024490" src={f3} alt="ROR Bible+ Personalized Audio Bible shown on iPhone" /></div>
</div>
</div>
<div className="ua745ac">
<div className="ue0dc9a">
<div className="u958509"><div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 21h12"/><path d="M8 21V11h8v10"/><path d="M5 11h14l-2-4H7z"/><path d="M12 3v4"/></svg></div><span className="uf9a5d2">@Pulpit</span></div>
<h3 className="u90c0c7">From revelation to <span className="ub8bc62">ministration.</span></h3>
<p className="u5e9fe0">Shape your study into a message with Scripture and personal notes.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>A sermon preparation workspace</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Organize Scripture, personal notes and research</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Keep source context close to your message</span></li></ul>
</div>
<div className="u76bd7b">
<div className="ue8e5ca"><img className="u024490" src={f4} alt="ROR Bible+ @Pulpit shown on iPhone" /></div>
</div>
</div>
<div className="uc0de80">
<div className="ue0dc9a">
<div className="u958509"><div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg></div><span className="uf9a5d2">ROAR Study Bible</span></div>
<h3 className="u90c0c7">Go deeper with <span className="ub8bc62">ROAR.</span></h3>
<p className="u5e9fe0">Explore Scripture-linked annotations from Rev. Chris Oyakhilome.</p>
<ul className="ua8091c"><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Rev. Chris Oyakhilome’s Annotated Reference Study Bible</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Scripture-linked annotations</span></li><li className="u23b391"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Integrated study resources</span></li></ul>
</div>
<div className="u76bd7b">
<div className="ue8e5ca"><img className="u024490" src={f8} alt="ROR Bible+ ROAR Study Bible shown on iPhone" /></div>
</div>
</div>
</div>
</section><section className="u1717c3">
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
