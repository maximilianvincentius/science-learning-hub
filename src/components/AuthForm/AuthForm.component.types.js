import PropTypes from 'prop-types';

export const AuthFormPropTypes = {
  title: PropTypes.string.isRequired,
  showFullName: PropTypes.bool,
  showDateOfBirth: PropTypes.bool,
  showRememberMe: PropTypes.bool,
  submitText: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  linkHref: PropTypes.string.isRequired
};
