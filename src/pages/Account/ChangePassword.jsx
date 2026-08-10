import { useContext, useState } from 'react';
import { Input, Button, message } from 'antd';
import PropTypes from 'prop-types';
import { LockOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { authApi } from '../../api';
import { AuthContext } from '../../context/AuthContext';

const rules = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'Contains uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'Contains lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'Contains number', test: (v) => /\d/.test(v) },
  { label: 'Contains special character', test: (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) }
];

const ValidationIcon = ({ valid }) =>
  valid ? <CheckCircleFilled className="text-green-500" /> : <CloseCircleFilled className="text-gray-300" />;
ValidationIcon.propTypes = { valid: PropTypes.bool.isRequired };

const ChangePassword = () => {
  const { login } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    oldPassword &&
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword &&
    rules.every((r) => r.test(newPassword));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data } = await authApi.patch('/users/password-reset', {
        currentPassword: oldPassword,
        newPassword,
        confirmPassword
      });
      login(true, data);
      message.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      message.error(error.response.data.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Change Password</h2>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Current Password</label>
          <Input.Password
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            prefix={<LockOutlined className="text-gray-400" />}
            visibilityToggle={{ visible: showOld, onVisibleChange: setShowOld }}
            placeholder="Enter current password"
            className="rounded-xl"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">New Password</label>
          <Input.Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            prefix={<LockOutlined className="text-gray-400" />}
            visibilityToggle={{ visible: showNew, onVisibleChange: setShowNew }}
            placeholder="Enter new password"
            className="rounded-xl"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm New Password</label>
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            prefix={<LockOutlined className="text-gray-400" />}
            visibilityToggle={{ visible: showConfirm, onVisibleChange: setShowConfirm }}
            placeholder="Confirm new password"
            className="rounded-xl"
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        {newPassword && (
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Password requirements:</p>
            <div className="space-y-1.5">
              {rules.map((rule) => (
                <div key={rule.label} className="flex items-center gap-2 text-sm">
                  <ValidationIcon valid={rule.test(newPassword)} />
                  <span className={rule.test(newPassword) ? 'text-green-700' : 'text-gray-500'}>{rule.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={!canSubmit}
          loading={submitting}
          onClick={handleSubmit}
          className="!rounded-xl !bg-blue-600 !text-white !h-11 !font-medium hover:!bg-blue-700"
        >
          Change Password
        </Button>
      </div>
    </div>
  );
};

export default ChangePassword;
