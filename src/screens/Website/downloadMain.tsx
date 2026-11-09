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
import DownloadPageStoreBadges from '../../components/Website/DownloadPageStoreBadges';
import DesktopDownloadButtons from '../../components/Website/DesktopDownloadButtons';
import icon from '../../assets/website/new/ror-bible-plus-icon.png';

export default function DownloadMain() {
  return (
    <>
<section className="hero u2a5dd6">
<svg className="u16c3e3" aria-hidden="true" viewBox="0 0 1440 160" preserveAspectRatio="none"><path d="M0 120 C 360 40, 720 150, 1440 60 L1440 160 L0 160 Z" fill="#07BDD2" opacity="0.10"/><path d="M0 132 C 380 60, 760 160, 1440 78" fill="none" stroke="#099DB2" strokeWidth="22" opacity="0.55"/><path d="M0 112 C 380 40, 760 140, 1440 56" fill="none" stroke="#FF5900" strokeWidth="3"/><path d="M0 150 C 380 80, 760 176, 1440 98" fill="none" stroke="#07BDD2" strokeWidth="2.5"/></svg>
<div className="wrap ue57381">
<div className="u0f1001">
<p className="ud434d3">Download</p><span className="ud6a536" aria-hidden="true"></span>
<h1 className="u0288f9">Get ROR Bible+ on <span className="ub8bc62">every device.</span></h1>
<p className="ueba38e">Free to download on phone, tablet, browser and computer, with your study synced across them all.</p>

</div>

</div>
</section><section className="u74dd52">
<div className="wrap ub49841">
<div className="card-lift u78cdf0">
<div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg></div>
<h2 className="u83a5da">ROR Bible+ Mobile</h2>
<p className="ue35007">iPhone, iPad and Android</p>
<div className="uc74f11"><DownloadPageStoreBadges /></div>
</div>
<div className="card-lift ucfaa3c">
<div className="u962c0c"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg></div>
<h2 className="u585dff">ROR Bible+ Web</h2>
<p className="uf374b8">Bible Online and Bible Lite (PWA)</p>
<div className="uc74f11"><Link to="/bible-online" className="btn-lift u311bd0"><span className="u76317c">Open Bible Online</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link><a href="#" className="btn-lift u311bd0"><span className="u76317c">Install Bible Lite</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>
</div>
<div className="card-lift u1a30ee">
<div className="u962c0c"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg></div>
<h2 className="u585dff">ROR Bible+ Desktop</h2>
<p className="uf374b8">MacOS, Windows and Linux</p>
<div className="uc74f11"><DesktopDownloadButtons variant="download-page" /></div>
</div>
<div className="card-lift u57f7e8">
<div className="u291155"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></div>
<h2 className="ua9347f">ROR Bible+ Voice</h2>
<p className="u858b7e">Amazon Alexa and Google Home</p>
<div className="uc74f11"><a href="#" className="btn-lift u311bd0"><span className="u76317c">Enable on Amazon Alexa</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a><a href="#" className="btn-lift u311bd0"><span className="u76317c">Enable on Google Home</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>
</div>
</div>
</section><section className="u0f44dd" id="support">
<div className="wrap u22987b">
<div className="u5e325c"><p className="ud434d3">Support</p><span className="ud6a536" aria-hidden="true"></span><h2 className="uc59461">We are here to <span className="ub8bc62">help.</span></h2></div>
<div className="u75373c">
<a className="uff3b82" href="#contact">
<div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><path d="M12 17.5v.01"/></svg></div>
<span className="u164584">Technical support</span>
<span className="u5ab6fa">Contact support from inside the ROR Bible+ app, or send us a message below.</span>
<span className="u219613">Get support<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
<a className="uff3b82" href="https://www.kingchat.online">
<div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg></div>
<span className="u164584">KingsChat</span>
<span className="u5ab6fa">Follow ROR Bible+ on KingsChat for updates and announcements.</span>
<span className="u219613">Follow on KingsChat<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
<a className="uff3b82" href="https://blog.rorbible.plus">
<div className="ue39012"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M9 7h6"/></svg></div>
<span className="u164584">Blog</span>
<span className="u5ab6fa">Keep current with news, guides and stories on our blog.</span>
<span className="u219613">Read the blog<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19688B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
</div>
</div>
</section><section className="ud2629f" id="contact">
<div className="wrap u9c728e">
<div className="ua8f08a"><p className="ud434d3">Contact us</p><span className="ud6a536" aria-hidden="true"></span><h2 className="u710805">Send us a message</h2><p className="u66bdbd">Questions about your account, subscription or a device? Tell us and our team will reply by email.</p></div>
<form className="u07dc41">
<div className="ua30b86"><div className="u89ae4e"><label className="ue7d6fe" htmlFor="name">Name</label><input className="u7585d1" id="name" type="text" /></div><div className="u89ae4e"><label className="ue7d6fe" htmlFor="email">Email</label><input className="u7585d1" id="email" type="email" /></div></div>
<div className="u60496a"><label className="ue7d6fe" htmlFor="topic">Topic</label><select className="u14628e" id="topic"><option>Technical support</option><option>Subscription and account</option><option>Partnership</option><option>Other</option></select></div>
<div className="u60496a"><label className="ue7d6fe" htmlFor="msg">Message</label><textarea className="ud15645" id="msg" rows={5} /></div>
<div><button className="u4bf19a" type="button">Send message</button></div>
</form>
</div>
</section>
    </>
  );
}
