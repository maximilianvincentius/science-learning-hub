import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

import authApi from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';
import { ProfileSkeleton, ProfileError } from './Account.utils';

const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await authApi.get('/users/profile');
      setProfile(data);
    } catch (err) {
      setError(err);
      // message.error('Failed to load user profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};

const ProfileSection = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [fullName, setFullName] = useState('');
  // const [email, setEmail] = useState('');
  // const [dob, setDob] = useState('');

  const { profile, loading, error: profileError, refetch: refetchProfile } = useUserProfile();

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

  if (loading) {
    return <ProfileSkeleton />;
  }
  if (error) {
    return <ProfileError />;
  }

  const { fullName, email, dob } = profile;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FF385C] text-2xl font-semibold text-white shadow-md">
          {fullName
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join('')
            .toUpperCase()}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{fullName}</h2>
        <p className="text-sm text-gray-500">{email}</p>
      </div>

      <hr className="my-6 border-gray-100" />

      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
          <UserOutlined className="text-gray-400" />
          <span className="text-sm text-gray-700">{fullName}</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
          <MailOutlined className="text-gray-400" />
          <span className="text-sm text-gray-700">{email}</span>
        </div>
        {dob && (
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
            <CalendarOutlined className="text-gray-400" />
            <span className="text-sm text-gray-700">
              {new Date(dob).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      <hr className="my-6 border-gray-100" />

      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
      >
        Log Out
      </button>
    </div>
  );
};

export default ProfileSection;
