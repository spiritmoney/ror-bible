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
import lwStore from '../../assets/website/new/loveworld-app-store.png';
import googlePlay from '../../assets/website/new/google-play.png';
import appStore from '../../assets/website/new/app-store.png';
import macos from '../../assets/website/new/macos.png';
import windows from '../../assets/website/new/windows.png';
import linux from '../../assets/website/new/linux.png';
import icon from '../../assets/website/new/ror-bible-plus-icon.png';

export const PLACEHOLDER_PRICES = ['[PRICE]', '[PRICE]', '[PRICE]'] as const;

export default function PricingMain() {
  return (
    <>
<section className="hero u2a5dd6">
<svg className="u16c3e3" aria-hidden="true" viewBox="0 0 1440 160" preserveAspectRatio="none"><path d="M0 120 C 360 40, 720 150, 1440 60 L1440 160 L0 160 Z" fill="#07BDD2" opacity="0.10"/><path d="M0 132 C 380 60, 760 160, 1440 78" fill="none" stroke="#099DB2" strokeWidth="22" opacity="0.55"/><path d="M0 112 C 380 40, 760 140, 1440 56" fill="none" stroke="#FF5900" strokeWidth="3"/><path d="M0 150 C 380 80, 760 176, 1440 98" fill="none" stroke="#07BDD2" strokeWidth="2.5"/></svg>
<div className="wrap ue57381">
<div className="u0f1001">
<p className="ud434d3">Pricing</p><span className="ud6a536" aria-hidden="true"></span>
<h1 className="u0288f9">Start free. Go as deep as <span className="ub8bc62">you study.</span></h1>
<p className="ueba38e">Four plans: Free, Premium, Pro and Max. Download for free, then choose the plan that matches how deeply you study.</p>

</div>

</div>
</section><section className="u0a7241">
<div className="wrap u79dba8">
<div className="u716ddb"><div className="uf60547" role="group" aria-label="Billing period"><button className="u2d49a9" type="button" data-period="monthly" aria-pressed="true">Monthly</button><button className="ue52de3" type="button" data-period="yearly" aria-pressed="false">Yearly</button></div></div>
<div className="ub02896">
<div className="u2431b1">
<span className="tagspacer u210e06"></span>
<div className="ue799f8"><h2 className="u9fed92">Free</h2><span className="u59de19">For everyday reading</span></div>
<div className="uca3073"><span className="uf44268">Free</span><span className="u59de19"></span></div>
<ul className="ubdf0f5"><li className="u7168c1"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Read Scripture in available editions</span></li><li className="u7168c1"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Highlights, notes and bookmarks</span></li><li className="u7168c1"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Cloud sync with your ROR Bible+ account</span></li><li className="u7168c1"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#099DB2" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Exact-word and any-word Bible search</span></li></ul>
<div className="u5ab468"><Link className="ubee0d4" to={WebsiteDownloadRoute}>Download free</Link></div>
</div><div className="u7a9d25">
<span className="tagspacer u210e06"></span>
<div className="ue799f8"><h2 className="uef93cd">Premium</h2><span className="u9bbbcd">For deeper personal study</span></div>
<div className="uca3073"><span className="u3faceb">[PRICE]</span><span className="u9bbbcd" data-per>/ month</span></div>
<ul className="ubdf0f5"><li className="u0d76de"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Everything in Free</span></li><li className="u0d76de"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Parallel study and verse comparison</span></li><li className="u0d76de"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Hebrew and Greek study resources</span></li><li className="u0d76de"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Audio Bible and Read-to-Me</span></li><li className="u0d76de"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Colour search and study layouts</span></li></ul>
<div className="u5ab468"><Link className="u7e7fd6" to={WebsiteDownloadRoute}>Choose Premium</Link></div>
</div><div className="ueaf196">
<span className="u44f160">For ministers</span>
<div className="ue799f8"><h2 className="uef93cd">Pro</h2><span className="u9bbbcd">For students and ministers</span></div>
<div className="uca3073"><span className="u3faceb">[PRICE]</span><span className="u9bbbcd" data-per>/ month</span></div>
<ul className="ubdf0f5"><li className="u0d76de"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Everything in Premium</span></li><li className="u0d76de"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Solution Search: Student Agent and Minister Agent</span></li><li className="u0d76de"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>@Pulpit sermon preparation workspace</span></li><li className="u0d76de"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#072233" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Voice notes</span></li></ul>
<div className="u5ab468"><Link className="uc80603" to={WebsiteDownloadRoute}>Choose Pro</Link></div>
</div><div className="ufcad72">
<span className="u802e85">Everything included</span>
<div className="ue799f8"><h2 className="u13706e">Max</h2><span className="u5f80a9">The complete ROR Bible+</span></div>
<div className="uca3073"><span className="u52fc6a">[PRICE]</span><span className="u5f80a9" data-per>/ month</span></div>
<ul className="ubdf0f5"><li className="ude8688"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Everything in Pro</span></li><li className="ude8688"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Pastor Chris Audio Bible and commentaries</span></li><li className="ude8688"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>ROAR Study Bible</span></li><li className="ude8688"><span className="u3a78e7"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>All available licensed resources</span></li></ul>
<div className="u5ab468"><Link className="u5c4e6f" to={WebsiteDownloadRoute}>Choose Max</Link></div>
</div>
</div>
<p className="uc099f8">Available editions, audio, resources and functions depend on your plan, content catalogue and supported device.</p>
</div>
</section><section className="u0f44dd">
<div className="wrap u9c728e">
<div className="u880611"><p className="ud434d3">Questions</p><span className="ud6a536" aria-hidden="true"></span><h2 className="u710805">Plans and access</h2></div>
<div className="u11cd76"><details className="u56d723">
<summary className="uaff0f3">Which features need a subscription?</summary>
<p className="u07e85c">Some features and resources require a subscription. Available editions, audio, resources and functions depend on your plan, content catalogue and supported device.</p>
</details><details className="u56d723">
<summary className="uaff0f3">Can I use one account on all my devices?</summary>
<p className="u07e85c">Yes. With your ROR Bible+ account, your notes, highlights and bookmarks sync across supported devices.</p>
</details><details className="u56d723">
<summary className="uaff0f3">Do I need an internet connection?</summary>
<p className="u07e85c">Online services require an internet connection. Bible Lite, the progressive web app, offers offline access to your Bible study.</p>
</details><details className="u56d723">
<summary className="uaff0f3">How do I get help?</summary>
<p className="u07e85c">Contact support from inside the ROR Bible+ app, or reach us through the Support page.</p>
</details></div>
</div>
</section><section className="ub9a234">
<div className="wrap uada6f3">
<div className="u3fdbdb">
<h2 className="u79d33f">Download ROR Bible+ and begin your next discovery in <span className="u3d7a5b">the Word.</span></h2>
<p className="ub4344f">Free to download. Some features and resources require a subscription.</p>
</div>
<div className="u3e7f6a">
<div className="u230928">
<a href="#" className="btn-lift u466af7">
<img className="ue0f809" src={lwStore} alt="" /><span className="uad67f1"><span className="u7103c4">Get it on</span>
<span className="uc7be1b">Loveworld App Store</span></span>
</a>
<a href="#" className="btn-lift u466af7">
<img className="ue0f809" src={googlePlay} alt="" /><span className="uad67f1"><span className="u7103c4">Get it on</span>
<span className="uc7be1b">Google Play</span></span>
</a>
<a href="#" className="btn-lift u466af7">
<img className="ue0f809" src={appStore} alt="" /><span className="uad67f1"><span className="u7103c4">Download on the</span>
<span className="uc7be1b">App Store</span></span>
</a>
</div>
<Link className="u74c5a0" to={WebsiteProductDesktopRoute}>Also on MacOS, Windows and Linux →</Link>
</div>
</div>
</section>
    </>
  );
}
