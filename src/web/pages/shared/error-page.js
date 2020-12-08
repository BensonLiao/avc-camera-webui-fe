import React from 'react';
import PropTypes from 'prop-types';
import imageCode404 from '../../../resource/icon-error-404.svg';
import imageCode500 from '../../../resource/icon-error-500.svg';
import bgCode404 from '../../../resource/bg-error-404-clip.png';
import bgCode500 from '../../../resource/bg-error-500-clip.png';
import i18n from '../../../i18n';

const ErrorPage = ({error: {status}}) => {
  document.title = `${i18n.t('error.error')} - ${window.cameraName} Web-Manager`;
  // We need the following line because backend error data are different from i18n key for now
  const messageTitle = i18n.t(`error.${status === 404 ? 'notFound' : 'internalServerError'}`);
  return (
    <div className="error-page">
      <img className="mw-100" src={status === 404 ? bgCode404 : bgCode500}/>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 text-center mt-5">
            {!window.isNoBrand && (
              <div className="col-center motion-blur">
                <img src={status === 404 ? imageCode404 : imageCode500} className="blur-me"/>
                <img src={status === 404 ? imageCode404 : imageCode500} className="blur-me two"/>
                <img src={status === 404 ? imageCode404 : imageCode500} className="blur-me three"/>
                <img src={status === 404 ? imageCode404 : imageCode500} className="blur-me four"/>
                <img src={status === 404 ? imageCode404 : imageCode500} className="blur-me five"/>
              </div>
            )}
            <div className="message-container mt-5">
              <h2 className="message-status mb-0">{status}</h2>
              <h3 className="message-title">{messageTitle}</h3>
              <a className="btn btn-primary text-light rounded-pill mt-5" href="/">
                {i18n.t('error.backToHome')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ErrorPage.propTypes = {
  error: PropTypes.shape({
    status: PropTypes.number,
    message: PropTypes.string
  })
};

ErrorPage.defaultProps = {
  error: {
    status: 500,
    message: 'Internal Server Error'
  }
};

export default ErrorPage;
