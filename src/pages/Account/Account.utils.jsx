import PropTypes from 'prop-types';

export const getInitials = (profile, user) => {
  const name = profile?.fullName || user?.fullName || 'User';
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
};

export const formatDate = (dateStr) => {
  if (!dateStr) {
    return null;
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return null;
  }
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const validateNewPassword = (pw) => {
  if (!pw) {
    return ['New password is required.'];
  }
  const errors = [];
  if (pw.length < 8) {
    errors.push('Minimum 8 characters.');
  }
  if (!/[A-Z]/.test(pw)) {
    errors.push('Need one uppercase letter.');
  }
  if (!/[a-z]/.test(pw)) {
    errors.push('Need one lowercase letter.');
  }
  if (!/[0-9]/.test(pw)) {
    errors.push('Need one number.');
  }
  return errors;
};

export const validateConfirmPassword = (confirm, newPw) => {
  if (!confirm) {
    return ['Please confirm your new password.'];
  }
  return confirm !== newPw ? ['Passwords do not match.'] : [];
};

// Re-export for convenience
export { default as getUserFromToken } from '../../services/authService';

export const ProfileSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex justify-center">
      <div className="h-20 w-20 rounded-full bg-gray-200" />
    </div>
    <div className="mx-auto h-5 w-32 rounded bg-gray-200" />
    <div className="mx-auto h-4 w-48 rounded bg-gray-200" />
    <hr className="my-6 border-gray-100" />
    <div className="space-y-3">
      <div className="h-11 rounded-xl bg-gray-100" />
      <div className="h-11 rounded-xl bg-gray-100" />
      <div className="h-11 rounded-xl bg-gray-100" />
    </div>
  </div>
);

export const ProfileError = ({ message = 'Something went wrong', onRetry }) => (
  <div className="flex flex-col items-center gap-4 py-12 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-400">!</div>
    <p className="text-sm text-gray-500">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl bg-[#FF385C] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#e0304f]"
      >
        Try Again
      </button>
    )}
  </div>
);

ProfileError.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func
};
