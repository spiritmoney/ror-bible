import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { HEADER_HEIGHT } from './constants';
import WebsiteLayout from './WebsiteLayout';
import PageHero from './PageHero';
import './appMarketingPages.css';

import giveBanner from '../../assets/give/giveBanner.png';
import giveText from '../../assets/give/giveText.png';
import give2 from '../../assets/give/give2.png';
import givePay from '../../assets/give/givePay.png';
import giveGiftCard from '../../assets/give/giveGiftCard.png';

type GivePageProps = {
  isModal?: boolean;
  onClose?: () => void;
};

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
    <div className="website-root app-marketing-page bg-brand-pale text-brand-navy font-montserrat">
      <PageHero
        eyebrow="Give"
        title="Partner with the mission"
        description="Your generosity helps put God's Word in more hands—every gift plants seed that grows for generations."
      />
      <section className="relative w-full overflow-hidden">
        <img
          src={giveBanner}
          alt="Give banner"
          className="w-full h-auto object-cover"
          draggable={false}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-[7%] md:pl-[7%] lg:pl-[7%]">
          <img
            src={giveText}
            alt="Give - Let's reach everyone, everywhere, every day"
            className="w-[100%] min-w-[170px] max-w-[520px] h-auto"
            draggable={false}
          />
        </div>
      </section>

      <section
        className="max-w-6xl mx-auto px-6 py-14 text-center"
        id="give_intro"
      >
        <p className="text-[25px] md:text-[28px] leading-[1.42] font-medium text-[#2B2B2B]">
          Intimacy with God has the power to transform lives, and living
          generously is one way we can partner with him. When you surrender to
          God by living generously, it changes lives.
        </p>
      </section>

      <section className="bg-[#6D757E] py-14 md:py-16" id="seed">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-12">
          <div className="text-white">
            <h2 className="text-[38px] md:text-[50px] leading-[1.05] font-medium tracking-[-0.02em] max-w-[560px]">
              One Seed Can Change the World
            </h2>
            <p className="mt-6 text-[20px] md:text-[29px] leading-[1.48] font-normal text-white/90 max-w-[560px]">
              God's Word is the seed that has the power to transform lives.
              Every time someone download a Bible, a seed is planted. And every
              time that person opens their Bibles, that seed is watered.
            </p>
            <p className="mt-5 text-[20px] md:text-[29px] leading-[1.48] font-normal text-white/90 max-w-[560px]">
              Join our growing community of sowers by making a monthly recurring
              commitment to reach everyone, everywhere with God's Word.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src={give2}
              alt="One seed can change the world"
              className="w-full max-w-[430px] rounded-[26px] object-cover"
              draggable={false}
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20" id="give_now">
        <h3 className="text-center mb-5 text-[40px] md:text-[56px] leading-[1.1] font-semibold text-[#222]">
          Give Now
        </h3>

        <div className="mt-16 app-marketing-form-card max-w-[980px] mx-auto px-4 md:px-10 pb-10 pt-20">
          <div className="w-full flex justify-center -mt-[120px] mb-8">
            <div className="w-full max-w-[420px]">
              <img
                src={givePay}
                alt="Payment header"
                className="w-full h-auto rounded-t-[24px]"
                draggable={false}
              />

              <div className="bg-[#EAE7E9] rounded-b-[24px] px-3 pb-4 pt-3 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
                <p className="text-center text-[22px] text-[#3E3E3E] font-medium">
                  Enter ESPEES amount
                </p>

                <div className="mt-3 h-[58px] rounded-[16px] bg-white px-4 flex items-center gap-3">
                  <span
                    className="h-[35px] w-[34px] flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg
                      width="34"
                      height="35"
                      viewBox="0 0 34 35"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.6378 0C25.8271 0 33.2758 7.44866 33.2758 16.638C33.2758 23.5554 29.0546 29.4858 23.0477 31.9957H32.0529V35H1.22247V31.9957H10.2281C4.22117 29.4858 0 23.5554 0 16.638C0 7.44866 7.44866 0 16.638 0H16.6378ZM2.40758 15.1358H10.3862V8.91921H21.1197V12.0151H13.5148V15.0863H21.1197V18.1822H13.4679L13.5148 22.8527H21.1197V25.9013H10.3862V18.1402H2.40758C3.15834 25.337 9.24229 30.9466 16.6378 30.9466C24.0334 30.9466 30.1173 25.337 30.8681 18.1402H22.7288V15.1359H30.8681C30.1173 7.93912 24.0335 2.32959 16.6378 2.32959C9.24229 2.32959 3.15834 7.93925 2.40758 15.1359V15.1358Z"
                        fill="#515151"
                      />
                    </svg>
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-transparent outline-none text-[44px] leading-none font-semibold text-[#4D4D4D]"
                    aria-label="Enter ESPEES amount"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[760px] mx-auto">
            <div>
              <label className="block text-[18px] md:text-[22px] font-semibold text-[#707070] mb-2">
                Espees or KingsPay:
              </label>
              <select
                value={platform}
                onChange={e =>
                  setPlatform(e.target.value as 'espees' | 'kingspay')
                }
                className="w-full h-[54px] rounded-[14px] px-4 text-[18px] md:text-[22px] bg-white border border-transparent outline-none text-[#646464]"
              >
                <option value="espees">Espees</option>
                <option value="kingspay" disabled>
                  KingsPay
                </option>
              </select>
            </div>
            <div>
              <label className="block text-[18px] md:text-[22px] font-semibold text-[#707070] mb-2">
                Enter Fullname:
              </label>
              <input
                type="text"
                placeholder="Enter your fullname here"
                value={payerId}
                onChange={e => setPayerId(e.target.value)}
                className="w-full h-[54px] rounded-[14px] px-4 text-[18px] md:text-[22px] bg-white border border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex justify-center mt-7">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={submitEspeesPayment}
              className="h-[56px] px-14 rounded-[16px] bg-[#1E96AF] text-white text-[20px] md:text-[24px] font-semibold tracking-[0.01em]"
            >
              {isSubmitting ? 'PROCESSING...' : 'GIVE NOW'}
            </button>
          </div>

          {paymentMessage ? (
            <p className="text-center mt-4 text-[15px] md:text-[16px] text-[#5D5D5D]">
              {paymentMessage}
            </p>
          ) : null}

          <div className="max-w-[760px] mx-auto mt-9 flex items-center gap-4 text-[#5B5B5B]">
            <div className="h-[1px] bg-[#CFCBCF] flex-1" />
            <span className="text-[20px] md:text-[28px] leading-none font-medium">
              Other Options
            </span>
            <div className="h-[1px] bg-[#CFCBCF] flex-1" />
          </div>

          <div className="max-w-[760px] mx-auto mt-8 grid grid-cols-1 md:grid-cols-[1fr_auto_2fr] items-center gap-5 text-[#4F4F4F]">
            <div>
              <p className="text-[20px] md:text-[26px] font-semibold text-[#8D8C8F]">
                ESPEES Code:
              </p>
              <p className="text-[19px] md:text-[43px] leading-[1.1] font-semibold text-[#4F4F4F] mt-1">
                {ESPEES_CODE}
              </p>
            </div>

            <div className="hidden md:block w-[1px] h-[74px] bg-[#C7C7C9]" />

            <div>
              <p className="text-[19px] md:text-[26px] font-semibold text-[#8D8C8F]">
                ESPEES Address
              </p>
              <p className="text-[18px] md:text-[30px] leading-[1.25] font-medium text-[#4F4F4F] mt-1 break-all">
                {ESPEES_ADDRESS}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 md:py-24" id="gift_card">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          <div>
            <h3 className="text-[40px] md:text-[56px] leading-[1.05] font-semibold text-[#242424]">
              Gift a Card
            </h3>
            <p className="mt-6 text-[20px] md:text-[28px] leading-[1.5] font-normal text-[#4A4A4A] max-w-[620px]">
              Gift inspirational and uplifting Cards to your love ones,
              colleague friends and more. send them these faith fill and
              encouraging Gift Card to lighting up their day.
            </p>
            <button
              type="button"
              className="mt-8 inline-flex items-center rounded-full border border-[#979797] px-6 py-2 text-[16px] leading-none font-semibold text-[#474747]"
            >
              SEE MORE
            </button>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src={giveGiftCard}
              alt="Gift card"
              className="w-full max-w-[430px] rounded-[26px] object-cover"
              draggable={false}
            />
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
                className="h-[48px] px-10 rounded-[12px] bg-[#1E96AF] text-white text-[18px] font-semibold"
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

  return <WebsiteLayout>{PageInner}</WebsiteLayout>;
}
