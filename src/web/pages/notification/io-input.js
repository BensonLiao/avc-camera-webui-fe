import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import {getRouter} from 'capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React from 'react';
import {Tab} from 'react-bootstrap';
import IOType from 'webserver-form-schema/constants/io-type';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';

const IoInput = ({isApiProcessing, currentTab, isEnableIoIn, ioInSettings}) => {
  const onSubmitIOInSettingsForm = values => {
    progress.start();
    localStorage.setItem('currentTab', currentTab);
    api.notification.updateIOInSettings(values)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  return (
    <Formik
      initialValues={ioInSettings}
      onSubmit={onSubmitIOInSettingsForm}
    >
      {({values}) => (
        <Tab.Content>
          <Tab.Pane eventKey="tab-input">
            <Form>
              <div className="form-group d-flex justify-content-between align-items-center">
                <label>{i18n.t('Input')}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnable" checked={values.isEnable} type="checkbox" className="custom-control-input" id="switch-input"/>
                  <label className="custom-control-label" htmlFor="switch-input">
                    <span>{i18n.t('ON')}</span>
                    <span>{i18n.t('OFF')}</span>
                  </label>
                </div>
              </div>
              <div className={classNames('form-group', isEnableIoIn ? '' : 'd-none')}>
                <label>{i18n.t('Type')}</label>
                <div className="d-flex align-items-center">
                  <div className="form-check">
                    <Field name="ioType" className="form-check-input" type="radio" id="input-input-normally-open" value={IOType.normallyOpen}/>
                    <label className="form-check-label" htmlFor="input-input-normally-open">
                      {i18n.t('Normally Open')}
                    </label>
                  </div>
                  <div className="form-check ml-5">
                    <Field name="ioType" className="form-check-input" type="radio" id="input-input-normally-closed" value={IOType.normallyClosed}/>
                    <label className="form-check-label" htmlFor="input-input-normally-closed">
                      {i18n.t('Normally Closed')}
                    </label>
                  </div>
                </div>
              </div>
              <button disabled={isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
                {i18n.t('Apply')}
              </button>
            </Form>
          </Tab.Pane>
        </Tab.Content>
      )}
    </Formik>
  );
};

IoInput.propTypes = {
  ioInSettings: PropTypes.shape({
    isEnable: PropTypes.bool.isRequired,
    ioType: PropTypes.oneOf(IOType.all()).isRequired
  }).isRequired,
  isEnableIoIn: PropTypes.bool.isRequired,
  currentTab: PropTypes.string.isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

export default IoInput;

