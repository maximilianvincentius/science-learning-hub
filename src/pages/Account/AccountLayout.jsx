import { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined, UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

import { AuthContext } from '../../context/AuthContext';
import { routes } from '../../constants';

const { frontendRoutes } = routes;

const AccountLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    Modal.confirm({
      title: 'Are you sure you want to log out?',
      onOk: () => {
        logout();
        navigate('/');
      },
      okText: 'Log Out',
      okType: 'danger',
      centered: true
    });
  };

  return (
    <div className="mx-auto w-full max-w-[960px] px-4 py-10 sm:px-6 lg:py-14">
      <button
        type="button"
        onClick={() => {
          navigate(-1);
        }}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftOutlined />
        Back
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            <nav className="flex flex-row lg:flex-col gap-1">
              <a
                href={frontendRoutes.profile}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(frontendRoutes.profile);
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(frontendRoutes.profile)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <UserOutlined className="text-base" />
                Profile
              </a>
              <a
                href={frontendRoutes.changePassword}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(frontendRoutes.changePassword);
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(frontendRoutes.changePassword)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LockOutlined className="text-base" />
                Change Password
              </a>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
