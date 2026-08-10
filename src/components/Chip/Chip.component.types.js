import PropTypes from 'prop-types';

export const ButtonPropTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool
};
