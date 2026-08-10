import PropTypes from 'prop-types';

export const TabsPropTypes = {
  about: PropTypes.string.isRequired,
  quizContent: PropTypes.string.isRequired
};

export const TabsDefaultProps = {
  about: '',
  quizContent: ''
};
