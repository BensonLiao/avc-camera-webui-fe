import React from 'react';
import {Tab} from 'react-bootstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import utils from '../../../core/utils';
import i18n from '../../../i18n';
import {DEFAULT_PORTS} from '../../../core/constants';

const TCPIPHTTP = ({httpInfo, rtspSettings, httpsSettings, onSubmitHTTPForm}) => {
  const checkValidatePort = values => {
    let defaultPorts = DEFAULT_PORTS;

    let checkDefaultPortList = Object.keys(defaultPorts)
      .filter(items => items !== 'HTTP')
      .reduce((obj, key) => ({
        ...obj,
        [key]: defaultPorts[key]
      }), {});

    checkDefaultPortList = utils.duplicateCheck(Object.values(checkDefaultPortList), values);
    // Check if using http port
    if (
      checkDefaultPortList ||
          values === rtspSettings.udpPort ||
          values === rtspSettings.tcpPort ||
          values === httpInfo.port2 ||
          values === httpsSettings.port) {
      return i18n.t('The specified port is reserved by system or in use!');
    }

    return utils.validatedPortCheck(values);
  };

  return (
    <Formik
      initialValues={httpInfo}
      onSubmit={onSubmitHTTPForm}
    >
      {({values, errors, touched}) => (
        <Tab.Content>
          <Tab.Pane eventKey="tab-http">
            <Form>
              <div className="form-group mb-5">
                <label>{i18n.t('Secondary HTTP Port')}</label>
                <Field
                  name="port"
                  className={classNames('form-control', {'is-invalid': errors.port && touched.port})}
                  type="text"
                  validate={checkValidatePort}
                  placeholder={i18n.t('8080')}
                  value={values.port}
                />
                <ErrorMessage component="div" name="port" className="invalid-feedback"/>
                <p className="text-size-14 text-muted mt-2">{i18n.t('Range: 1024-65535 Default: 8080')}</p>
              </div>
              <button type="submit" className="btn btn-primary btn-block rounded-pill" onClick={onSubmitHTTPForm}>{i18n.t('Apply')}</button>
            </Form>
          </Tab.Pane>
        </Tab.Content>
      )}
    </Formik>
  );
};

TCPIPHTTP.propTypes = {
  httpInfo: PropTypes.shape({
    port: PropTypes.string.isRequired,
    port2: PropTypes.string
  }).isRequired,
  httpsSettings: PropTypes.shape({port: PropTypes.string.isRequired}).isRequired,
  rtspSettings: PropTypes.shape({
    tcpPort: PropTypes.string.isRequired,
    udpPort: PropTypes.string.isRequired
  }).isRequired,
  onSubmitHTTPForm: PropTypes.func.isRequired
};

export default TCPIPHTTP;

