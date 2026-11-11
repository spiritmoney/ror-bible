import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { HEADER_HEIGHT } from './constants';
import WebsiteLayout from './WebsiteLayout';
import PageHero from './PageHero';
import WebsitePageMeta from './WebsitePageMeta';
import MarketingSourceBand from './MarketingSourceBand';
import './appMarketingPages.css';

import give2 from '../../assets/give/give2.png';
import giveGiftCard from '../../assets/give/giveGiftCard.png';

type GivePageProps = {
  isModal?: boolean;
  onClose?: () => void;
};

function EspeesBlock({ code, address }: { code: string; address: string }) {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p className="mkt-label">ESPEES Code:</p>
        <p className="mkt-body mkt-stat">{code}</p>
      </div>
      <div>
        <p className="mkt-label">ESPEES Address</p>
        <p className="mkt-body break-all">{address}</p>
      </div>
    </div>
  );
}

export default function GivePage({
  isModal = false,
  onClose,
}: GivePageProps): JSX.Element {
  const ESPEES_CODE = 'LCIS';
  const ESPEES_ADDRESS = '0x1b99090a8f2a29e58fee789a3f4e1038cd1067ec';
  const PAYMENT_ENDPOINT = 'https://espees-proxy.vercel.app/create-product';
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [DRAWER_W, setDrawerW] = useState(50);
  const [platform, setPlatform] = useState<'espees' | 'kingspay'>('espees');
  const [amount, setAmount] = useState('0.00');
  const [payerId, setPayerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const submitEspeesPayment = async () => {
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      setPaymentMessage('Please enter a valid amount greater than 0.');
      return;
    }

    setIsSubmitting(true);
    setPaymentMessage('');

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const callbackPath = location.pathname || '/give';

    const payload = {
      product_sku: 'RORBIBLE sponsorship from WEBSITE',
      narration: 'RORBIBLE sponsorship from WEBSITE',
      price: parsedAmount,
      merchant_wallet: ESPEES_ADDRESS,
      success_url: `${origin}${callbackPath}?payment=success`,
      fail_url: `${origin}${callbackPath}?payment=fail`,
      ...(payerId.trim() ? { user_data: { user_id: payerId.trim() } } : {}),
    };

    try {
      const response = await axios.post(PAYMENT_ENDPOINT, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const paymentRef = response?.data?.payment_ref;

      if (paymentRef) {
        setPaymentUrl(`https://payment.espees.org/pay/${paymentRef}`);

        setSuccessToastOpen(true);
        setPaymentMessage('');
      } else {
        setPaymentMessage('Payment reference was not returned by Espees.');
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to process payment at the moment.';
      setPaymentMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSuccessToastOk = () => {
    setSuccessToastOpen(false);
    if (paymentUrl && typeof window !== 'undefined') {
      window.location.href = paymentUrl;
    }
  };

  useEffect(() => {
    const updateDrawerWidth = () => {
      const width = window.innerWidth;
      if (width < 640) setDrawerW(50);
      else if (width < 768) setDrawerW(80);
      else if (width < 1024) setDrawerW(80);
      else setDrawerW(100);
    };

    updateDrawerWidth();
    window.addEventListener('resize', updateDrawerWidth);
    return () => window.removeEventListener('resize', updateDrawerWidth);
  }, []);

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
    };
  }, [isModal, onClose]);

  useEffect(() => {
    if (isModal) return;
    const state = (location.state as any) || {};
    if (!state.scrollTo) return;
    const id = state.scrollTo as string;
    const el = document.getElementById(id);
    if (!el) return;
    const top =
      el.getBoundingClientRect().top + window.pageYOffset - HEADER_HEIGHT;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [location, isModal]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentState = query.get('payment');

    if (paymentState !== 'success' && paymentState !== 'fail') return;

    setSuccessToastOpen(false);
    setPaymentUrl('');
    setPaymentMessage(
      paymentState === 'success'
        ? 'Payment completed successfully. Thank you for giving.'
        : 'Payment was not completed. Please try again.'
    );

    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.search, navigate]);

  const PageInner = (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="website-root app-marketing-page bg-white text-brand-navy font-montserrat"
    >
      <PageHero
        variant="flat"
        eyebrow="Give"
        title={
          <>
            One Seed Can <span className="text-brand-orange">Change the World</span>
          </>
        }
        description="Intimacy with God has the power to transform lives, and living generously is one way we can partner with him. When you surrender to God by living generously, it changes lives."
      />

      <section id="seed" className="mkt-section mkt-band-white">
        <div className="mkt-container mkt-split-65">
          <img
            src={give2}
            alt="One seed can change the world"
            className="mkt-src-img"
            loading="lazy"
          />

          <div id="give_now" className="mkt-form-card">
            <h3 className="mkt-h3-lg">Give Now</h3>
            <p className="mkt-note">Enter ESPEES amount</p>

            <label className="block mt-4">
              <span className="mkt-label">Amount</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mkt-input"
                aria-label="Enter ESPEES amount"
              />
            </label>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="block">
                <span className="mkt-label">Espees or KingsPay:</span>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as 'espees' | 'kingspay')}
                  className="mkt-input"
                >
                  <option value="espees">Espees</option>
                  <option value="kingspay" disabled>
                    KingsPay
                  </option>
                </select>
              </label>
              <label className="block">
                <span className="mkt-label">Enter Fullname:</span>
                <input
                  type="text"
                  placeholder="Enter your fullname here"
                  value={payerId}
                  onChange={(e) => setPayerId(e.target.value)}
                  className="mkt-input"
                />
              </label>
            </div>

            <div className="mt-6">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={submitEspeesPayment}
                className="mkt-btn-give w-full sm:w-auto"
              >
                {isSubmitting ? 'PROCESSING...' : 'GIVE NOW'}
              </button>
            </div>

            {paymentMessage ? (
              <p className="mt-4 mkt-note">{paymentMessage}</p>
            ) : null}

            <p className="mkt-kicker mkt-kicker--spaced mkt-kicker--center">Other Options</p>
            <EspeesBlock code={ESPEES_CODE} address={ESPEES_ADDRESS} />
          </div>
        </div>
      </section>

      <MarketingSourceBand id="give_intro" tone="alt" title="One Seed Can Change the World">
          <p className="mkt-body">
            God&apos;s Word is the seed that has the power to transform lives. Every time someone
            download a Bible, a seed is planted. And every time that person opens their Bibles, that
            seed is watered.
          </p>
          <p className="mkt-body">
            Join our growing community of sowers by making a monthly recurring commitment to reach
            everyone, everywhere with God&apos;s Word.
          </p>
      </MarketingSourceBand>

      <section id="gift_card" className="mkt-section mkt-band-white">
        <div className="mkt-container mkt-split-47 mkt-split-balanced">
          <img src={giveGiftCard} alt="Gift card" className="mkt-src-img" loading="lazy" />
          <div className="mkt-band-copy mkt-band-copy--col">
            <h2 className="mkt-band-title">Gift a Card</h2>
            <p className="mkt-body mkt-band-content">
              Gift inspirational and uplifting Cards to your love ones, colleague friends and more.
              send them these faith fill and encouraging Gift Card to lighting up their day.
            </p>
            <div className="mkt-band-content">
              <button type="button" className="mkt-btn-give">
                SEE MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {successToastOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[520px] rounded-[18px] bg-white p-6 text-center shadow-xl">
            <p className="text-[22px] md:text-[26px] font-semibold text-[#2E2E2E]">
              Payment reference created successfully.
            </p>
            <p className="mt-3 text-[15px] md:text-[17px] text-[#666]">
              Click OK to continue to Espees payment portal.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onSuccessToastOk}
                className="mkt-btn-give h-[48px] px-10 rounded-[12px] text-[18px] font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  if (isModal) {
    return (
      <WebsiteLayout isModal onClose={() => (onClose ? onClose() : navigate(-1))}>
        {PageInner}
      </WebsiteLayout>
    );
  }

  return (
    <WebsiteLayout>
      <WebsitePageMeta
        title="Rhapsody Bible"
        description="The Ultimate Bible Reader & Study Resource Tool!"
      />
      {PageInner}
    </WebsiteLayout>
  );
}
