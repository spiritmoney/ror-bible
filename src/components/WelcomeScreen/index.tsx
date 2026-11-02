import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from 'hooks/useUser';
import appLogo from 'assets/logo.png.png';
import { HomeRoute } from 'navigation/routes';

const getSafeReturnTo = (path?: string | null): string => {
  if (!path) return HomeRoute;
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('://')) {
    return HomeRoute;
  }
  return path;
};

const WelcomeScreen: React.FunctionComponent = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = useMemo(() => {
    const routeFrom = (location.state as any)?.from;
    if (routeFrom) return routeFrom;

    const fallback = sessionStorage.getItem('kingschat_last_return_to');
    return fallback || null;
  }, [location.state]);

  const displayName = user.fullName || user.name || '';

  const handleContinue = () => {
    const target = getSafeReturnTo(from);
    sessionStorage.removeItem('kingschat_last_return_to');
    navigate(target, { replace: true });
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#18668D] to-[#0b3b52] px-6 py-12">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Profile picture with small logo badge overlapping bottom-right */}
        <div className="relative w-40 h-40">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/30 bg-white/10 shadow-xl">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-semibold text-white">
                {(displayName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="absolute bottom-5 right-5 translate-x-1/2 translate-y-1/2 w-12 h-12 rounded-full  flex items-center justify-center overflow-hidden">
            <img
              src={appLogo}
              alt="Rhapsody Bible"
              className="w-full h-full object-contain p-0.5"
            />
          </div>
        </div>

        <h1 className="mt-10 text-2xl md:text-3xl font-bold text-white">
          Welcome to ROR Bible{displayName ? `, ${displayName}` : ''}!
        </h1>
        <p className="mt-3 text-white/80 text-sm md:text-base max-w-xs">
          Let's get you started on an immersive study of The Word.
        </p>

        <button
          type="button"
          onClick={handleContinue}
          className="animate-pulse mt-12 rounded-full bg-white text-[#18668D] font-semibold px-10 py-3.5 shadow-xl hover:bg-white/90 transition-colors"
        >
          Start Reading
        </button>
      </div>
    </section>
  );
};

export default WelcomeScreen;
