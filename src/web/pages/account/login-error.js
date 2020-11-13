import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'capybara-router';
import i18n from '../../../i18n';
import Once from '../../../core/components/one-time-render';
import AccountContainer from './account-container';
import withGlobalStatus from '../../withGlobalStatus';

const LoginError = ({params: {loginFailedRemainingTimes}}) => {
  return (
    <AccountContainer page="page-login-lock">
      <div className="card shadow mb-5">
        <div className="card-body">
          <Once>
            <div className="text-center" style={{margin: '8rem 0'}}>
              <p className="text-dark font-weight-bold m-0">
                {i18n.t('Incorrect Password')}
              </p>
              <p className="text-dark">
                {i18n.t('You have {{0}} attempt(s) remaining...', {0: loginFailedRemainingTimes})}
              </p>
            </div>
            <Link to="/login" className="btn btn-primary btn-block rounded-pill mt-5">
              {i18n.t('Login Again')}
            </Link>
          </Once>
        </div>
      </div>
    </AccountContainer>
  );
};

LoginError.propTypes = {
  params: PropTypes.shape({
    loginFailedRemainingTimes: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired
  }).isRequired
};

export default withGlobalStatus(LoginError);
