import React, { useState } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'hooks/useUser';
import { LoginRoute } from 'navigation/routes';

type IProfileRow = {
  label: string;
  value?: string | null;
};

const ProfileRow: React.FunctionComponent<IProfileRow> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-2">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-slate-700 font-medium truncate max-w-[60%]">
        {value}
      </dd>
    </div>
  );
};

type IProfileMenu = {
  className?: string;
};

const ProfileMenu: React.FunctionComponent<IProfileMenu> = ({ className }) => {
  const { user, clearUserInfo } = useUser();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  if (!user?.id) return null;

  const anyUser = user as any;
  const displayName = user.fullName || user.name || 'User';

  const handleLogout = () => {
    setShowMenu(false);
    clearUserInfo();
    navigate(LoginRoute);
  };

  return (
    <>
      <div className={clsx('relative', className)}>
        <button
          type="button"
          onClick={() => setShowMenu(prev => !prev)}
          className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-white/60 bg-white/20 shrink-0"
          aria-label="Profile menu"
          aria-expanded={showMenu}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-white">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl text-slate-700 py-2 z-50">
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => {
                  setShowMenu(false);
                  setShowProfile(true);
                }}
              >
                Profile page
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => setShowMenu(false)}
              >
                Settings
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-50"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>

      {showProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-[#18668D]/10">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-[#18668D]">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                {displayName}
              </h3>
              {user.username && (
                <p className="text-sm text-slate-400">@{user.username}</p>
              )}
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <ProfileRow label="Full name" value={displayName} />
              <ProfileRow label="Username" value={user.username} />
              <ProfileRow label="Email" value={user.email} />
              <ProfileRow label="Phone number" value={user.phone_number} />
              <ProfileRow
                label="Country"
                value={user.region || anyUser.country}
              />
              <ProfileRow label="Gender" value={user.gender} />
            </dl>

            <button
              type="button"
              onClick={() => setShowProfile(false)}
              className="mt-6 w-full rounded-lg bg-[#18668D] text-white font-medium py-2.5 hover:bg-[#145676] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileMenu;
