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
import _ from '../../../languages';
import api from '../../../core/apis/web-api';
import ioOutSettingsValidator from '../../validations/notifications/io-out-settings-validator';
import utils from '../../../core/utils';

const IoOutput = props => {
  const {isApiProcessing, currentTab, index, ioOutSettings, isEnableIoOutput} = props;

  const generateIOOutSettingsSubmitHandler = index => values => {
    progress.start();
    localStorage.setItem('currentTab', currentTab);
    api.notification.updateIOOutSettings(index, values)
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
          <Tab.Pane eventKey={`tab-output-${index + 1}`}>
            <Form>
              <div className="form-group d-flex justify-content-between align-items-center">
                <label>{_('Output {0}', [index + 1])}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnable" checked={values.isEnable} type="checkbox" className="custom-control-input" id={`switch-output-${index}`}/>
                  <label className="custom-control-label" htmlFor={`switch-output-${index}`}>
                    <span>{_('ON')}</span>
                    <span>{_('OFF')}</span>
                  </label>
                </div>
              </div>
              <div className={classNames(isEnableIoOutput ? '' : 'd-none')}>
                <div className="form-group">
                  <label>{_('Normal State')}</label>
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <Field
                        name="ioType"
                        className="form-check-input"
                        type="radio"
                        id={`input-output${index}-normally-open`}
                        value={IOType.normallyOpen}
                      />
                      <label className="form-check-label" htmlFor={`input-output${index}-normally-open`}>{_('Normally Open')}</label>
                    </div>
                    <div className="form-check ml-5">
                      <Field
                        name="ioType"
                        className="form-check-input"
                        type="radio"
                        id={`input-output${index}-normally-closed`}
                        value={IOType.normallyClosed}
                      />
                      <label className="form-check-label" htmlFor={`input-output${index}-normally-closed`}>{_('Normally Closed')}</label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>{_('Type')}</label>
                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <Field name="gateType" className="form-check-input" type="radio" id={`input-output${index}-normal`} value={GateType.normal}/>
                      <label className="form-check-label" htmlFor={`input-output${index}-normal`}>{_('Normal')}</label>
                    </div>
                    <div className="form-check ml-5">
                      <Field name="gateType" className="form-check-input" type="radio" id={`input-output${index}-debounce`} value={GateType.buffer}/>
                      <label className="form-check-label" htmlFor={`input-output${index}-debounce`}>{_('Buffer')}</label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>{_('Pulse Time (Seconds)')}</label>
                  <Field
                    name="pulse"
                    type="text"
                    className={classNames('form-control', {'is-invalid': errors.pulse && touched.pulse})}
                    placeholder={_('Enter Seconds')}
                  />
                  {
                    errors.pulse && touched.pulse && (
                      <div className="invalid-feedback">{errors.pulse}</div>
                    )
                  }
                  <small className="form-text text-muted">
                    {_('{0} - {1} Seconds', [NotificationIOOutSchema.pulse.min, NotificationIOOutSchema.pulse.max])}
                  </small>
                </div>
                <div className="form-group">
                  <label>{_('Delay Time (Seconds)')}</label>
                  <Field
                    name="delay"
                    type="text"
                    className={classNames('form-control', {'is-invalid': errors.delay && touched.delay})}
                    placeholder={_('Enter Seconds')}
                  />
                  {
                    errors.delay && touched.delay && (
                      <div className="invalid-feedback">{errors.delay}</div>
                    )
                  }
                  <small className="form-text text-muted">
                    {_('{0} - {1} Seconds', [NotificationIOOutSchema.delay.min, NotificationIOOutSchema.delay.max])}
                  </small>
                </div>
              </div>
              <button disabled={isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill mt-5">
                {_('Apply')}
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
  isEnableIoOutput: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

export default IoOutput;

