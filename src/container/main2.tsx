import Protected from 'components/Protected';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from 'react-router-dom';
// import { createBrowserHistory, createHashHistory } from 'history';
import { useRecoilValue } from 'recoil';
import { lockAtom } from 'store/atoms/general';
import ScrollToTop from '../components/ScrollToTop';
import SuspenseLoader from '../components/SuspenseLoader';
import IsAuth from '../components/isAuth/index';
import { isElectron } from '../utils/general';
import { AnnotateRoute, FavouritesRoute, VoiceNoteRoute } from '../navigation/routes';
import {
  AdminRoute,
  AuthRoute,
  DashboardRoute,
  EmailSentRoute,
  ForgetPasswordRoute,
  LoginRoute,
  RegisterRoute,
  ResetPasswordRoute,
  StoreRoute
} from '../navigation/routes';
import Notification from 'components/Notification';
import ProductDetails from 'screens/Store/product_Details';
import StoreBible from 'screens/Store/store_translations';
import Workspace from 'components/Workspace';
import DashboardAudio from 'screens/DashboardAudio';
import DashboardStore from 'screens/DashboardStore';
import Homepage from 'screens/Website/landingPage';
import About from 'screens/Website/about';
// import WorkspaceWithRoutes from './workSpaceWithRoutes';

export interface IMain { }

const Auth = lazy(() => import('../screens/Auth/Choose'));
const DeskAuth = lazy(() => import('../screens/Auth/DesktopChoose'));
const Dashboard = lazy(() => import('../screens/Dashboard'));
const Store = lazy(() => import('../screens/Store'));
const Favourites = lazy(() => import('../screens/Favourites'));
const ResetPassword = lazy(() => import('../screens/Auth/ResetPasswordScreen'));
const Login = lazy(() => import('../screens/Auth/LoginScreen'));
const Register = lazy(() => import('../screens/Auth/RegisterScreen'));
const ForgetPassword = lazy(
  () => import('../screens/Auth/ForgetPasswordScreen')
);
const EmailSent = lazy(() => import('../screens/Auth/EmailSentScreen'));
const Admin = lazy(() => import('../screens/Admin'));
const Users = lazy(() => import('../screens/Admin/Users'));

const Lock = lazy(() => import('../screens/LockScreen'));
// const history = isElectron() ? createHashHistory() : createBrowserHistory();


const Main: React.FunctionComponent<IMain> = () => {
  const SimpleSuspense = (Component: React.FunctionComponent, props?: any) => {
    const lock = useRecoilValue(lockAtom);
    const location = useLocation();
    const state = (location.state as any) || {};
    const backgroundLocation = state.backgroundLocation;
  
    return (
      <Suspense fallback={<SuspenseLoader fullscreen />}>
        <Notification />
        {lock && <Lock />}
        {!lock && <Component {...props} />}
      </Suspense>
    );
  };
  return (
    <main className="font-raleway">
      <Suspense fallback={<SuspenseLoader fullscreen />}>
        {isElectron() ?
          <HashRouter>
            <ScrollToTop />
            <Routes>
              <Route
                path={AuthRoute}
                element={
                  <IsAuth>
                    <DeskAuth />
                  </IsAuth>
                }
              />
              <Route
                path={LoginRoute}
                element={
                  <IsAuth>
                    <Login />
                  </IsAuth>
                }
              />
              <Route
                path={DashboardRoute}
                element={<Protected>{SimpleSuspense(Dashboard)}</Protected>}
              />

              <Route
                path={DashboardRoute + '/:id'}
                element={<Protected>{SimpleSuspense(Dashboard)}</Protected>}
              />

              <Route
                path={AnnotateRoute + '/:id'}
                element={<Protected>{SimpleSuspense(Dashboard)}</Protected>}
              />

              <Route
                path={VoiceNoteRoute + '/:id'}
                element={<Protected>{SimpleSuspense(Dashboard)}</Protected>}
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

              <Route
                path={AdminRoute}
                element={<Protected>{SimpleSuspense(Admin)}</Protected>}
              >
                <Route path={AdminRoute} element={SimpleSuspense(Users)} />
              </Route>
            </Routes>
          </HashRouter> :
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* <Route
              path={AuthRoute}
              element={
                <IsAuth>
                  <Auth />
                </IsAuth>
              }
              />*/}
              <Route
              path={LoginRoute}
              element={
                  <Login />
              }
              /> 
              <Route
                path={DashboardRoute}
                element={<Protected>{SimpleSuspense(Dashboard)}</Protected>}
              />
              {/* <Route path="/store" element={<DashboardStore/>} /> */}
              {/* <Route path="/store/product/:SKU" element={<Workspace nav='product'  />} /> */}
              <Route path="/store/audioBibles" element={<DashboardStore nav='store_audio'/>} />
              <Route path="/store/product/:sku" element={<DashboardStore nav='product'/>} />
              <Route path="/bible-online" element={<DashboardStore nav='multi_layout'/>} />
              <Route path="/store/bible" element={<DashboardStore nav='store_bible'/>} />
              <Route path="/store" element={<DashboardStore nav='store_bible'/>} />
              <Route path="/xml-convert/json" element={<DashboardStore nav='xml'/>} />
              <Route path="/home" element={<Homepage/>} />
              <Route path="/" element={<Homepage/>} />
              <Route path="/about" element={<About/>} />
              
              <Route
                path={DashboardRoute + '/:id'}
                element={<Protected>{SimpleSuspense(Dashboard)}</Protected>}
              />

              <Route
                path={AnnotateRoute + '/:id'}
                element={<Protected>{SimpleSuspense(Dashboard)}</Protected>}
              />

              <Route
                path={VoiceNoteRoute + '/:id'}
                element={<Protected>{SimpleSuspense(Dashboard)}</Protected>}
              />

              <Route
                path={StoreRoute}
                element={<Protected>{SimpleSuspense(Store)}</Protected>}
              />

              <Route
                path={FavouritesRoute}
                element={<Protected>{SimpleSuspense(Store)}</Protected>}
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

              {/* <Route
              path={AdminRoute}
              element={<Protected>{SimpleSuspense(Admin)}</Protected>}
            >
              <Route path={AdminRoute} element={SimpleSuspense(Users)} />
            </Route> */}
            </Routes>
          </BrowserRouter>}
      </Suspense>
    </main>
  );
};

export default Main;
