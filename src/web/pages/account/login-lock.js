import dayjs from 'dayjs';
import React, {useState, useEffect} from 'react';
import {Link} from 'capybara-router';
import i18n from '../../../i18n';
import Once from '../../../core/components/one-time-render';
import AccountContainer from './account-container';
import withGlobalStatus from '../../withGlobalStatus';

const LoginLock = ({params}) => {
  const [loginLockRemainingMs, setLoginLockRemainingMs] = useState(params.loginLockExpiredTime - Date.now());
  const [disableLoginLink, setDisableLoginLink] = useState(true);
  const formatedLoginLockTime = dayjs(loginLockRemainingMs).format('mm:ss');

  useEffect(() => {
    let remainingMs = loginLockRemainingMs;
    let timerId = setInterval(() => {
      remainingMs -= 1000;

      if (remainingMs >= 0) {
        setLoginLockRemainingMs(remainingMs);
      } else {
        clearInterval(timerId);
        timerId = null;
        setDisableLoginLink(false);
      }
    }, 1000);
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [loginLockRemainingMs]);

  return (
    <AccountContainer page="page-login-lock">
      <div className="card shadow mb-5">
        <div className="card-body text-dark text-center">
          <Once>
            <div style={{margin: '5rem 0'}}>
              <p className="font-weight-bold m-0">
                {i18n.t('Too Many Login Attempts!')}
              </p>
              <p>
                {i18n.t('Please try again in 5 minutes.')}
              </p>
            </div>
          </Once>

          {
            disableLoginLink ? (
              <a href="#disabled" className="btn btn-primary btn-block rounded-pill mt-4 disabled">
                {i18n.t('{{0}} Remaining', {0: formatedLoginLockTime})}
              </a>
            ) : (
              <Once>
                <Link to="/login" className="btn btn-primary btn-block rounded-pill mt-4">
                  {i18n.t('Login Again')}
                </Link>
              </Once>
            )
          }
        </div>
      </div>
    </AccountContainer>
  );
};

LoginLock.propTypes = {
  params: function (props, propName, componentName) {
    if (
      !props[propName].loginLockExpiredTime ||
      Number.isNaN(props[propName].loginLockExpiredTime)
    ) {
      return new Error(
        `Invalid prop "${propName}.loginLockExpiredTime" supplied to ${componentName}. Validation failed.`
      );
    }
  }.isRequired
};

export default withGlobalStatus(LoginLock);
