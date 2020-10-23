import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Link, RouterView, getRouter} from 'capybara-router';
import Loading from '../../../core/components/loading';
import i18n from '../../i18n';
import withGlobalStatus from '../../withGlobalStatus';

const router = getRouter();

export default withGlobalStatus(
  class Notification extends React.Component {
    static get propTypes() {
      return {$listens: PropTypes.arrayOf(PropTypes.func.isRequired).isRequired};
    }

    state = {currentRouteName: router.currentRoute.name}

    constructor(props) {
      super(props);
      props.$listens.push(
        router.listen('ChangeStart', (action, toState) => {
          this.setState({currentRouteName: toState.name});
        })
      );
      if (this.state.currentRouteName === 'web.notification') {
        setTimeout(() => {
          router.go({name: 'web.notification.smtp'});
        });
      }
    }

    render() {
      const {currentRouteName} = this.state;

      return (
        <>
          {/* Left menu */}
          <div className="left-menu fixed-top">
            <h2>{i18n.t('Notification Settings')}</h2>
            <nav className="nav flex-column">
              <div className="accordion" id="accordion-notification-menu">
                <a
                  href="#"
                  data-toggle="collapse"
                  data-target="#basic-settings"
                  title={i18n.t('Notification Method')}
                  className={classNames(
                    'nav-link collapse show d-flex justify-content-between align-items-center',
                    {active: ['web.notification.smtp', 'web.notification.io'].indexOf(currentRouteName) >= 0},
                    {collapsed: currentRouteName === 'web.notification.cards'}
                  )}
                >
                  <span className="text-truncate">{i18n.t('Notification Method')}</span>
                  <i className="fas fa-chevron-up"/>
                </a>
                <div id="basic-settings" className={classNames('collapse', {show: currentRouteName !== 'web.notification.cards'})} data-parent="#accordion-notification-menu">
                  <Link
                    className={classNames('nav-link', {active: currentRouteName === 'web.notification.smtp'})}
                    to="/notification/smtp"
                    title={i18n.t('Email')}
                  >
                    {i18n.t('Email')}
                  </Link>
                  <Link
                    className={classNames('nav-link', {active: currentRouteName === 'web.notification.io'})}
                    to="/notification/io"
                    title={i18n.t('I/O')}
                  >
                    {i18n.t('I/O')}
                  </Link>
                </div>
              </div>
              <Link
                className={classNames('nav-link', {active: currentRouteName === 'web.notification.cards'})}
                to="/notification/cards"
                title={i18n.t('Smart Notification')}
              >
                {i18n.t('Smart Notification')}
              </Link>
            </nav>
          </div>

          {/* Main content */}
          <RouterView><Loading/></RouterView>
        </>
      );
    }
  }
);

