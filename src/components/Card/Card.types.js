import PropTypes from 'prop-types';

export const CardPropTypes = {
  itemId: PropTypes.string,
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  isLocked: PropTypes.bool,
  description: PropTypes.string,
  topic: PropTypes.string,
  author: PropTypes.string,
  containImage: PropTypes.bool,
  isCarousel: PropTypes.bool,
  updatedAt: PropTypes.string,
  progress: PropTypes.number
};
