import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import {getRouter} from 'capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React from 'react';
import {Tab} from 'react-bootstrap';
import IOType from 'webserver-form-schema/constants/io-type';
import GateType from 'webserver-form-schema/constants/gate-type';
import NotificationIOOutSchema from 'webserver-form-schema/notification-io-out-schema';
import i18n from '../../../i18n';
import api from '../../../core/apis/web-api';
import ioOutSettingsValidator from '../../validations/notifications/io-out-settings-validator';
import utils from '../../../core/utils';

const IoOutput = ({isApiProcessing, currentTab, index, ioOutSettings}) => {
  const generateIOOutSettingsSubmitHandler = index => values => {
    progress.start();
    localStorage.setItem('currentTab', currentTab);
    api.notification.updateIOOutSettings(index - 1, values)
      .then(getRouter().reload)
      .finally(progress.done);
  };

  return (
    <Formik
      initialValues={ioOutSettings}
      validate={utils.makeFormikValidator(ioOutSettingsValidator)}
      onSubmit={generateIOOutSettingsSubmitHandler(index)}
    >
      {({values, errors, touched}) => (
        <Tab.Content>
          <Tab.Pane eventKey={`Output ${index}`}>
            <Form>
              <div className="form-group d-flex justify-content-between align-items-center">
                <label>{i18n.t('Enable Digital Output {{0}}', {0: index})}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnable" type="checkbox" className="custom-control-input" id={`switch-output-${index}`}/>
                  <label className="custom-control-label" htmlFor={`switch-output-${index}`}>
                    <span>{i18n.t('ON')}</span>
                    <span>{i18n.t('OFF')}</span>
                  </label>
                </div>
              </div>
              <div>
                <div className="form-group">
                  <label>{i18n.t('Normal State')}</label>
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <Field
                        disabled={!values.isEnable}
                        name="ioType"
                        className="form-check-input"
                        type="radio"
                        id={`input-output${index}-normally-open`}
                        value={IOType.normallyOpen}
                      />
                      <label className="form-check-label" htmlFor={`input-output${index}-normally-open`}>{i18n.t('Normally Open')}</label>
                    </div>
                    <div className="form-check ml-5">
                      <Field
                        disabled={!values.isEnable}
                        name="ioType"
                        className="form-check-input"
                        type="radio"
                        id={`input-output${index}-normally-closed`}
                        value={IOType.normallyClosed}
                      />
                      <label className="form-check-label" htmlFor={`input-output${index}-normally-closed`}>{i18n.t('Normally Closed')}</label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>{i18n.t('Type')}</label>
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <Field
                        disabled={!values.isEnable}
                        name="gateType"
                        className="form-check-input"
                        type="radio"
                        id={`input-output${index}-normal`}
                        value={GateType.normal}
                      />
                      <label className="form-check-label" htmlFor={`input-output${index}-normal`}>{i18n.t('Normal')}</label>
                    </div>
                    <div className="form-check ml-5">
                      <Field
                        disabled={!values.isEnable}
                        name="gateType"
                        className="form-check-input"
                        type="radio"
                        id={`input-output${index}-debounce`}
                        value={GateType.buffer}
                      />
                      <label className="form-check-label" htmlFor={`input-output${index}-debounce`}>{i18n.t('Buffer')}</label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>{i18n.t('Pulse Time (seconds)')}</label>
                  <Field
                    disabled={!values.isEnable}
                    name="pulse"
                    type="text"
                    className={classNames('form-control', {'is-invalid': errors.pulse && touched.pulse})}
                    placeholder={i18n.t('Enter seconds')}
                  />
                  {
                    errors.pulse && touched.pulse && (
                      <div className="invalid-feedback">{errors.pulse}</div>
                    )
                  }
                  <small className="form-text text-muted">
                    {i18n.t('{{0}}-{{1}} Seconds', {
                      0: NotificationIOOutSchema.pulse.min,
                      1: NotificationIOOutSchema.pulse.max
                    })}
                  </small>
                </div>
                <div className="form-group">
                  <label>{i18n.t('Delay Time (seconds)')}</label>
                  <Field
                    disabled={!values.isEnable}
                    name="delay"
                    type="text"
                    className={classNames('form-control', {'is-invalid': errors.delay && touched.delay})}
                    placeholder={i18n.t('Enter seconds')}
                  />
                  {
                    errors.delay && touched.delay && (
                      <div className="invalid-feedback">{errors.delay}</div>
                    )
                  }
                  <small className="form-text text-muted">
                    {i18n.t('{{0}}-{{1}} Seconds', {
                      0: NotificationIOOutSchema.delay.min,
                      1: NotificationIOOutSchema.delay.max
                    })}
                  </small>
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

IoOutput.propTypes = {
  ioOutSettings: PropTypes.shape({
    isEnable: PropTypes.bool.isRequired,
    ioType: PropTypes.oneOf(IOType.all()).isRequired,
    gateType: PropTypes.oneOf(GateType.all()).isRequired,
    pulse: PropTypes.string.isRequired,
    delay: PropTypes.string.isRequired
  }).isRequired,
  currentTab: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

export default IoOutput;

