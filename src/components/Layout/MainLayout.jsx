import PropTypes from 'prop-types';
import { useContext, useCallback } from 'react';
import { Layout, Modal } from 'antd';

import AuthForm from '../AuthForm';
import Searchbar from '../Searchbar';
import { routes } from '../../constants';
import { article as articleSvg, home as homeSvg, simulation as simulationSvg } from '../../assets/icons';
import { AuthContext } from '../../context/AuthContext';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { frontendRoutes } = routes;
const { getUserFromToken } = authService;

const _showModalAuthForm = (setOpenAuthForm) => {
  setOpenAuthForm(true);
};
const _hideModalAuthForm = (setOpenAuthForm) => () => {
  setOpenAuthForm(false);
};
const _getInitials = () => {
  const { fullName: name } = getUserFromToken();

  if (!name) {
    return 'U';
  }
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
};
const _renderHeader = (setOpenAuthForm, isAuthenticated, logout) => (
  <Header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-8 sm:gap-2">
    <div className="flex items-center justify-between rounded-full border gap-2 border-white/70 bg-white/75 px-4 py-3 shadow-[0_10px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl md:gap-0">
      <h1 className="text-lg font-semibold text-slate-900 sm:text-xl lg:text-2xl sm:flex hidden">Science Hub</h1>
      <div className="flex flex-1 w-full max-w-xs items-center lg:max-w-sm">
        <Searchbar />
      </div>
      <div className="flex items-center gap-10">
        <div className="hidden items-center gap-5 text-sm font-semibold text-slate-600 lg:flex">
          <a className="transition-colors hover:text-[--primary]" href={frontendRoutes.home}>
            Home
          </a>
          <a className="transition-colors hover:text-[--primary]" href={frontendRoutes.simulation}>
            Simulation
          </a>
          <a className="transition-colors hover:text-[--primary]" href={frontendRoutes.article}>
            Article
          </a>
        </div>
        {isAuthenticated ? (
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 transition-all hover:shadow-md"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF385C] text-sm font-semibold text-white">
                {_getInitials()}
              </span>
              <svg
                className="h-4 w-4 text-gray-500 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="invisible absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-100 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <a href="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                Profile
              </a>
              <hr className="my-1 border-gray-100" />
              <button
                type="button"
                onClick={logout}
                className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            className="flex items-center justify-between rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-[0_10px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl md:gap-0rounded-full bg-white border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 hover:border-gray-900"
            onClick={() => _showModalAuthForm(setOpenAuthForm)}
          >
            Login
          </button>
        )}
      </div>
    </div>
  </Header>
);
const _renderContent = (children, paddingBody) => (
  <main className="relative min-h-screen flex-1">
    <div
      id="main-content"
      tabIndex={-1}
      className={`px-4 sm:px-6 lg:px-8 ${paddingBody ? 'mt-14 pb-32 lg:pb-14 lg:mt-16' : 'py-24 lg:py-16'} w-full mx-auto focus:outline-none`}
    >
      <div className={paddingBody ? 'p-6' : ''}>{children}</div>
    </div>
  </main>
);
const _renderFooter = () => (
  <div className="flex self-center justify-between my-2 lg:hidden">
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-white/70 bg-white/80 p-3 text-slate-700 shadow-[0_12px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl lg:flex lg:items-center lg:text-xl lg:font-semibold">
      <div className="flex w-full justify-around">
        <a
          className="flex flex-col items-center text-sm transition-colors hover:text-sky-700"
          href={frontendRoutes.home}
        >
          <img src={homeSvg} alt="home-svg" className="text-black w-6 h-6 text-3xl" /> Home
        </a>
        <a
          href={frontendRoutes.simulation}
          className="flex flex-col items-center text-sm transition-colors hover:text-sky-700"
        >
          <img src={simulationSvg} alt="simulation-svg" className="text-black w-6 h-6 text-3xl" /> Simulation
        </a>
        <a
          className="flex flex-col items-center text-sm transition-colors hover:text-sky-700"
          href={frontendRoutes.article}
        >
          <img src={articleSvg} alt="article-svg" className="text-black w-6 h-6 text-3xl" /> Article
        </a>
      </div>
    </div>
  </div>
);
const _renderAuthForm = (setOpenAuthForm, isLoginForm, setIsAuthenticated, login) => (
  <AuthForm
    hideModalFunc={_hideModalAuthForm(setOpenAuthForm)}
    isLoginForm={isLoginForm}
    setIsAuthenticated={setIsAuthenticated}
    login={login}
  />
);

const MainLayout = ({ children, paddingBody }) => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, openAuthForm, setOpenAuthForm, logout, login } = useContext(AuthContext);

  const handleLogout = useCallback(() => {
    Modal.confirm({
      title: 'Are you sure you want to log out?',
      onOk: () => {
        logout();
        navigate('/');
      },
      okText: 'Log Out',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true
    });
  }, [logout, navigate]);

  const isLoginForm = true;
  return (
    <Layout className="flex flex-col min-h-screen w-full px-4 py-4 mt-10">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg focus:outline-2 focus:outline-sky-600"
      >
        Skip to content
      </a>
      {_renderHeader(setOpenAuthForm, isAuthenticated, handleLogout)}
      {_renderContent(children, paddingBody)}
      {_renderFooter(setOpenAuthForm, isAuthenticated, logout)}
      {openAuthForm && _renderAuthForm(setOpenAuthForm, isLoginForm, setIsAuthenticated, login)}
    </Layout>
  );
};
MainLayout.propTypes = { children: PropTypes.node, paddingBody: PropTypes.bool };
MainLayout.defaultProps = { paddingBody: false };
export default MainLayout;
