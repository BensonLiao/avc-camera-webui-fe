import React from 'react';
import PropTypes from 'prop-types';

const ImgWithFallback = ({src, onError, ...props}) => {
  const onImgError = event => {
    if (window.isDebug === 'y') {
      const fakeLiveView = require('../../resource/video-liveview.png');
      event.target.src = fakeLiveView;
    }

    if (onError) {
      onError();
    }
  };

  return (
    <img
      src={src}
      onError={onImgError}
      {...props}
    />
  );
};

ImgWithFallback.propTypes = {
  src: PropTypes.string.isRequired,
  onError: PropTypes.func
};

ImgWithFallback.defaulProps = {onError: null};

export default ImgWithFallback;
