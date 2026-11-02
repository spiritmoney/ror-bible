import React, { useState } from 'react';
import useKingsChat from 'hooks/useKingsChat';
import logo from 'assets/website/logo.png';
import appLogo from 'assets/logo.png.png';
import { ReactComponent as KingschatIcon } from 'assets/kingschat.svg';
import { useLocation } from 'react-router-dom';
import { HomeRoute } from 'navigation/routes';

const ReaderLogin: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useKingsChat();
  const location = useLocation();
  const from = (location.state as any)?.from;

  const handleKingsChatLogin = () => {
    setLoading(true);
    login(setLoading, from || HomeRoute);
  };

  return (
    <section className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Reader showcase panel */}
      <div className="relative flex-1 lg:min-h-screen bg-gradient-to-br from-[var(--ds-blue)] to-[var(--ds-navy)] flex flex-col items-center justify-center px-8 py-12 text-white overflow-hidden font-montserrat">
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
            Access the KJV Strong's Bible, enhanced Concordance and Hebrew &amp;
            Greek Dictionaries — all in one premium reading experience.
          </p>
        </div>
      </div>

      {/* Login panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-[var(--ds-blue)] text-center font-montserrat">
            Welcome
          </h2>
          <p className="mt-2 text-sm text-slate-500 text-center">
            Sign in to continue to your Bible
          </p>

          <button
            type="button"
            onClick={handleKingsChatLogin}
            disabled={loading}
            className="mt-10 w-full flex items-center justify-center gap-3 rounded-full bg-[var(--ds-blue)] hover:brightness-110 disabled:opacity-60 text-white font-semibold py-3.5 px-6 transition-[filter] ds-btn-lift ds-focus-visible font-montserrat"
          >
            {loading ? (
              <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <KingschatIcon className="w-6 h-6" />
            )}
            {loading ? 'Signing in…' : 'Login with KingsChat'}
          </button>

          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing you agree to our Terms &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReaderLogin;
