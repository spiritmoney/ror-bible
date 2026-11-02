// src/main.tsx
import Protected from 'components/Protected';
import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  HashRouter,
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
  KingsChatCallbackRoute,
  LoginRoute,
  RegisterRoute,
  ResetPasswordRoute,
  StoreRoute,
  WelcomeRoute,
} from '../navigation/routes';
import Notification from 'components/Notification';
import ProductDetails from 'screens/Store/product_Details/index';
import StoreBible from 'screens/Store/store_translations';
import Workspace from 'components/Workspace';
import DashboardAudio from 'screens/DashboardAudio';
import DashboardStore from 'screens/DashboardStore';
import Homepage from 'screens/Website/landingPage';
import About from 'screens/Website/about';
import Product from 'screens/Website/product';
import Give from 'screens/Website/give';
import Partner from 'screens/Website/partner';
import FeaturesPage from 'screens/Website/featuresPage';
import PricingPage from 'screens/Website/pricingPage';
import DownloadPage from 'screens/Website/downloadPage';
import ProductPlatformPage from 'screens/Website/productPlatformPage';
import SingleReader from 'components/SingleReaderArea';
import AuthCallback from 'pages/AuthCallback';

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
const KingsChatCallback = lazy(() => import('../components/KingsChatCallback'));
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
    const state = (location.state as any) || {};
    const backgroundLocation = state.backgroundLocation as
      | (Location | undefined)
      | undefined;

    // Render main routes using backgroundLocation if present (so background page stays mounted)
    // Also include '/about' route among the main routes (normal page render if no background)
    return (
      <>
        <Routes location={backgroundLocation ?? location}>
          {/* Put your existing routes here (unchanged) */}
          <Route path={LoginRoute} element={<ReaderLogin />} />
          <Route path={WelcomeRoute} element={<WelcomeScreen />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path={KingsChatCallbackRoute}
            element={<KingsChatCallback />}
          />
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
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/products/web" element={<ProductPlatformPage platform="web" />} />
          <Route path="/products/mobile" element={<ProductPlatformPage platform="mobile" />} />
          <Route path="/products/desktop" element={<ProductPlatformPage platform="desktop" />} />
          <Route path="/products/voice" element={<ProductPlatformPage platform="voice" />} />

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
    <main className="font-montserrat">
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
