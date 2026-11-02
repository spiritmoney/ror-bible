// src/main.tsx
import Protected from 'components/Protected';
import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { lockAtom } from 'store/atoms/general';
import ScrollToTop from '../components/ScrollToTop';
import SuspenseLoader from '../components/SuspenseLoader';
import IsAuth from '../components/isAuth/index';
import ReaderLogin from '../components/ReaderLogin';
import WelcomeScreen from '../components/WelcomeScreen';
import { useUser } from 'hooks/useUser';
import { isElectron } from '../utils/general';
import {
  AnnotateRoute,
  FavouritesRoute,
  VoiceNoteRoute,
} from '../navigation/routes';
import {
  AdminRoute,
  AuthRoute,
  DashboardRoute,
  EmailSentRoute,
  ForgetPasswordRoute,
  HomeRoute,
  LoginRoute,
  RegisterRoute,
  ResetPasswordRoute,
  StoreRoute,
  WelcomeRoute,
} from '../navigation/routes';
import Notification from 'components/Notification';
import ProductDetails from 'screens/Store/product_Details.';
import StoreBible from 'screens/Store/store_translations';
import Workspace from 'components/Workspace';
import DashboardAudio from 'screens/DashboardAudio';
import DashboardStore from 'screens/DashboardStore';
import Homepage from 'screens/Website/landingPage';
import About from 'screens/Website/about';
import Product from 'screens/Website/product';
import Give from 'screens/Website/give';
import Partner from 'screens/Website/partner';
import SingleReader from 'components/SingleReaderArea';

export interface IMain {}

const Auth = lazy(() => import('../screens/Auth/Choose'));
const DeskAuth = lazy(() => import('../screens/Auth/DesktopChoose'));
const Dashboard = lazy(() => import('../screens/Dashboard'));
const Store = lazy(() => import('../screens/Store'));
const Favourites = lazy(() => import('../screens/Favourites'));
const ResetPassword = lazy(() => import('../screens/Auth/ResetPasswordScreen'));
const Register = lazy(() => import('../screens/Auth/RegisterScreen'));
const ForgetPassword = lazy(
  () => import('../screens/Auth/ForgetPasswordScreen')
);
const EmailSent = lazy(() => import('../screens/Auth/EmailSentScreen'));
const Admin = lazy(() => import('../screens/Admin'));
const Users = lazy(() => import('../screens/Admin/Users'));

const Lock = lazy(() => import('../screens/LockScreen'));

// SimpleSuspense must be a real component (not a plain helper function) so its
// hook calls (useRecoilValue) are tracked per-instance, independent of how many
// times it's used in the tree or whether the enclosing AppRoutes render returns
// early (e.g. the login gate below).
const SimpleSuspense: React.FunctionComponent<{
  component: React.FunctionComponent;
  componentProps?: any;
}> = ({ component: Component, componentProps }) => {
  const lock = useRecoilValue(lockAtom);
  return (
    <Suspense fallback={<SuspenseLoader fullscreen />}>
      <Notification />
      {lock && <Lock />}
      {!lock && <Component {...componentProps} />}
    </Suspense>
  );
};

const Main: React.FunctionComponent<IMain> = () => {
  // AppRoutes uses useLocation and implements the background-location (modal) pattern
  function AppRoutes() {
    const location = useLocation();
    const { isLoggedIn } = useUser();
    const state = (location.state as any) || {};
    const backgroundLocation = state.backgroundLocation as
      | (Location | undefined)
      | undefined;

    // Project-wide login gate: every route requires a logged in KingsChat user,
    // except the login screen itself. A logged in user visiting /login is sent
    // straight to the landing page instead of seeing the login screen again.
    // isLoggedIn briefly flips to 'loading' the instant a KingsChat login
    // succeeds (saveUserInfo sets it before the confirming effect runs), right
    // when we're navigating to /welcome — treat that as "still logged in" so we
    // don't bounce back to /login and skip the welcome screen.
    if (isLoggedIn === 'true' && location.pathname === LoginRoute) {
      return <Navigate to={WelcomeRoute} replace />;
    }
    if (isLoggedIn === 'false' && location.pathname !== LoginRoute) {
      return <Navigate to={LoginRoute} replace />;
    }

    // Render main routes using backgroundLocation if present (so background page stays mounted)
    // Also include '/about' route among the main routes (normal page render if no background)
    return (
      <>
        <Routes location={backgroundLocation ?? location}>
          {/* Put your existing routes here (unchanged) */}
          <Route path={LoginRoute} element={<ReaderLogin />} />
          <Route path={WelcomeRoute} element={<WelcomeScreen />} />
          <Route
            path={DashboardRoute}
            element={
              <Protected>
                <SimpleSuspense component={Dashboard} />
              </Protected>
            }
          />
          <Route
            path="/store/audioBibles"
            element={<DashboardStore nav="store_audio" />}
          />
          <Route
            path="/store/resources"
            element={<DashboardStore nav="store_resources" />}
          />
          <Route
            path="/store/translations"
            element={<DashboardStore nav="store_translations" />}
          />
          <Route
            path="/store/freesbies"
            element={<DashboardStore nav="store_freesbies" />}
          />
          <Route
            path="/store/product/:sku"
            element={<DashboardStore nav="product" />}
          />
          <Route
            path="/bible-online"
            element={<DashboardStore nav="multi_layout" />}
          />
          <Route
            path="/store/bible"
            element={<DashboardStore nav="store_bible" />}
          />
          <Route path="/store" element={<DashboardStore nav="store" />} />
          <Route
            path="/xml-convert/json"
            element={<DashboardStore nav="xml" />}
          />
          <Route path="/read" element={<DashboardStore nav="read" />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/" element={<Homepage />} />

          <Route
            path={DashboardRoute + '/:id'}
            element={
              <Protected>
                <SimpleSuspense component={Dashboard} />
              </Protected>
            }
          />
          <Route
            path={AnnotateRoute + '/:id'}
            element={
              <Protected>
                <SimpleSuspense component={Dashboard} />
              </Protected>
            }
          />
          <Route
            path={VoiceNoteRoute + '/:id'}
            element={
              <Protected>
                <SimpleSuspense component={Dashboard} />
              </Protected>
            }
          />
          <Route
            path={StoreRoute}
            element={
              <Protected>
                <SimpleSuspense component={Store} />
              </Protected>
            }
          />
          <Route
            path={FavouritesRoute}
            element={
              <Protected>
                <SimpleSuspense component={Store} />
              </Protected>
            }
          />

          <Route
            path={RegisterRoute}
            element={
              <IsAuth>
                <Register />
              </IsAuth>
            }
          />
          <Route
            path={ForgetPasswordRoute}
            element={
              <IsAuth>
                <ForgetPassword />
              </IsAuth>
            }
          />
          <Route
            path={EmailSentRoute}
            element={
              <IsAuth>
                <EmailSent />
              </IsAuth>
            }
          />
          <Route
            path={ResetPasswordRoute}
            element={
              <IsAuth>
                <ResetPassword />
              </IsAuth>
            }
          />

          {/* Admin nested example kept */}
          <Route
            path={AdminRoute}
            element={
              <Protected>
                <SimpleSuspense component={Admin} />
              </Protected>
            }
          >
            <Route
              path={AdminRoute}
              element={<SimpleSuspense component={Users} />}
            />
          </Route>

          {/* ABOUT as a normal page if user visits directly */}
          <Route path="/about" element={<About />} />

          {/* PRODUCT PAGE as a normal page if user visits directly */}
          <Route path="/product" element={<Product />} />

          {/* GIVE PAGE as a normal page if user visits directly */}
          <Route path="/give" element={<Give />} />

          {/* PARTNER PAGE as a normal page if user visits directly */}
          <Route path="/partner" element={<Partner />} />

          {/* keep any other routes you had... */}
        </Routes>

        {/* If backgroundLocation exists (we navigated with a background), render the modal/overlay route(s) on top */}
        {backgroundLocation && (
          <Routes>
            <Route path="/about" element={<About isModal />} />
            <Route path="/product" element={<Product isModal />} />
            <Route path="/give" element={<Give isModal />} />
            <Route path="/partner" element={<Partner isModal />} />
            {/* <Route path="/bible_online" element={<Product isModal />} /> */}
            {/* add other overlay routes here if you want modal-style for other pages */}
          </Routes>
        )}
      </>
    );
  }

  return (
    <main className="font-raleway">
      <Suspense fallback={<SuspenseLoader fullscreen />}>
        {isElectron() ? (
          <HashRouter>
            <ScrollToTop />
            <AppRoutes />
          </HashRouter>
        ) : (
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
          </BrowserRouter>
        )}
      </Suspense>
    </main>
  );
};

export default Main;
