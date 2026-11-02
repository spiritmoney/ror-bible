import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isLoggedInAtom, kingschatTokensAtom, userAtom } from 'store/atoms/user';
import { LOCAL_STORAGE_USER_EMAIL } from 'store/constant';
import logo from 'assets/website/logo.png';
import appLogo from 'assets/logo.png.png';
import { ReactComponent as KingschatIcon } from 'assets/kingschat.svg';
import { HomeRoute, LoginRoute } from 'navigation/routes';

const WORKER_URL = 'https://rorbible-kingschat-auth.loveworldexpo-kclogin.workers.dev/api/exchange';

const decodeState = (raw) => {
  if (!raw) return null;

  try {
    let base64 = raw.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return JSON.parse(atob(base64));
  } catch (error) {
    return null;
  }
};

const isValidReturnTo = (path) => {
  if (!path) return HomeRoute;
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('://')) {
    return HomeRoute;
  }
  return path;
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const [, setUser] = useRecoilState(userAtom);
  const [, setKingschatToken] = useRecoilState(kingschatTokensAtom);
  const [, setIsLoggedIn] = useRecoilState(isLoggedInAtom);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const origin = params.get('origin') || '';
      const decoded = decodeState(origin) || {};
      const returnTo = isValidReturnTo(decoded.returnTo || decoded.from);

      if (!code) {
        navigate(LoginRoute + '?error=no_code', { replace: true });
        return;
      }

      try {
        const res = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Exchange failed');

        const profile = data.profile ?? data.user?.profile ?? data.user;
        const tokens = data.tokens ?? {
          accessToken: data.accessToken ?? data.token,
          refreshToken: data.refreshToken,
          expiresInMillis: data.expiresInMillis,
        };

        const email = profile?.email || profile?.user?.email;
        const safeUser = {
          ...profile,
          email,
          id: profile?.id || email,
          fullName: profile?.name || profile?.fullName || profile?.username,
          name: profile?.name || profile?.fullName || profile?.username,
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          kingsChatTokens: tokens,
          kingsChatid: profile?.id,
        };

        if (email) {
          localStorage.setItem(LOCAL_STORAGE_USER_EMAIL, email);
        }
        localStorage.setItem('kingschat_profile', JSON.stringify(profile));
        localStorage.setItem('kingschat_tokens', JSON.stringify(tokens));
        sessionStorage.setItem('kingschat_last_return_to', returnTo);

        setUser(safeUser);
        setKingschatToken(tokens);
        setIsLoggedIn('true');

        navigate('/welcome', {
          replace: true,
          state: { from: returnTo },
        });
      } catch (err) {
        console.error(err);
        navigate(`${LoginRoute}?error=${encodeURIComponent(err.message)}`, {
          replace: true,
        });
      }
    };
    run();
  }, [navigate, setIsLoggedIn, setKingschatToken, setUser]);

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
}