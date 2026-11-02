import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useKingsChat from 'hooks/useKingsChat';
import { LoginRoute } from 'navigation/routes';
import logo from 'assets/website/logo.png';
import appLogo from 'assets/logo.png.png';
import { ReactComponent as KingschatIcon } from 'assets/kingschat.svg';

const KingsChatCallback: React.FunctionComponent = () => {
  const { exchangeCode } = useKingsChat();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    (async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const origin = params.get('origin') || '';

        if (!code) {
          throw new Error('Missing KingsChat authorization code');
        }

        await exchangeCode(code, origin);
      } catch (err: any) {
        console.error('KingsChat callback error:', err);
        setError(err?.message || 'KingsChat login failed');
        setTimeout(() => {
          navigate(LoginRoute, { replace: true });
        }, 2500);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white px-6">
        <div className="max-w-sm text-center">
          <h2 className="text-xl font-semibold text-[#18668D]">
            KingsChat login failed
          </h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <p className="mt-1 text-xs text-slate-400">
            Redirecting you back to login…
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      <div className="relative flex-1 lg:min-h-screen bg-gradient-to-br from-[#18668D] to-[#0b3b52] flex flex-col items-center justify-center px-8 py-12 text-white overflow-hidden">
        <img src={logo} alt="Rhapsody Bible" className="w-32 md:w-36 mb-6" />
        <img
          src={appLogo}
          alt="Rhapsody Bible"
          className="max-w-[260px] md:max-w-[320px] w-full drop-shadow-2xl select-none"
          draggable={false}
        />
        <div className="mt-8 text-center max-w-md">
          <h1 className="text-xl md:text-2xl font-bold">
            Read. Study. Meditate. Triumph.
          </h1>
          <p className="mt-3 text-white/80 text-sm">
            Completing your KingsChat sign-in securely.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="flex items-center justify-center gap-3 text-[#18668D]">
            <KingschatIcon className="w-6 h-6" />
            <span className="text-xl font-semibold">Logging you in…</span>
          </div>
          <div className="mt-6 flex justify-center">
            <span className="h-10 w-10 rounded-full border-4 border-[#18668D]/25 border-t-[#18668D] animate-spin" />
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Please wait while we finish the secure KingsChat handshake.
          </p>
        </div>
      </div>
    </section>
  );
};

export default KingsChatCallback;
