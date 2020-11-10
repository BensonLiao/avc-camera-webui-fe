import React from 'react';
import {Tab} from 'react-bootstrap';
import PropTypes from 'prop-types';
import progress from 'nprogress';
import {getRouter} from 'capybara-router';
import {Formik, Form, Field} from 'formik';
import api from '../../../core/apis/web-api';
import notify from '../../../core/notify';
import i18n from '../../../i18n';
import SelectField from '../../../core/components/fields/select-field';

const TCPIPDDNS = ({isApiProcessing, ddnsInfo, isShowApiProcessModal}) => {
  const onSubmitDDNSForm = values => {
    progress.start();
    api.system.updateDDNSInfo(values)
      .then(response => {
        if (response.data.ddnsHostStatus) {
          notify.showSuccessNotification({
            title: i18n.t('Setting Success'),
            message: i18n.t('DDNS Setting Success')
          });
        } else {
          notify.showErrorNotification({
            title: i18n.t('Setting Failed'),
            message: i18n.t('DDNS Setting Failed')
          });
        }

        getRouter().reload();
      })
      .finally(progress.done);
  };

  const ddnsFormRender = values => {
    return (
      <Tab.Content>
        <Tab.Pane eventKey="tab-ddns">
          <Form>

            <div className="form-group d-flex justify-content-between align-items-center">
              <label className="mb-0">{i18n.t('Enable DDNS')}</label>
              <div className="custom-control custom-switch">
                <Field name="isEnableDDNS" checked={values.isEnableDDNS} type="checkbox" className="custom-control-input" id="switch-ddns-enable"/>
                <label className="custom-control-label" htmlFor="switch-ddns-enable">
                  <span>{i18n.t('ON')}</span>
                  <span>{i18n.t('OFF')}</span>
                </label>
              </div>
            </div>
            <SelectField labelName={i18n.t('Service Provider')} name="ddnsProvider">
              <option value="dyn-dns">DynDNS.org</option>
            </SelectField>
            <div className="form-group">
              <label>{i18n.t('Host Name')}</label>
              <Field
                className="form-control"
                type="text"
                name="ddnsHost"
                placeholder={i18n.t('Enter DDNS host name.')}
                value={values.ddnsHost}
                disabled={!values.isEnableDDNS}
              />
            </div>
            <div className="form-group">
              <label>{i18n.t('Account')}</label>
              <Field
                className="form-control"
                type="text"
                name="ddnsAccount"
                placeholder={i18n.t('Enter DDNS username.')}
                value={values.ddnsAccount}
                disabled={!values.isEnableDDNS}
              />
            </div>
            <div className="form-group">
              <label>{i18n.t('Password')}</label>
              <Field
                className="form-control"
                type="text"
                name="ddnsPassword"
                placeholder={i18n.t('Enter DDNS password.')}
                value={values.ddnsPassword}
                disabled={!values.isEnableDDNS}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block rounded-pill"
              disabled={isApiProcessing || isShowApiProcessModal}
            >{i18n.t('Apply')}
            </button>
          </Form>
        </Tab.Pane>
      </Tab.Content>
    );
  };

  return (
    <Formik
      initialValues={ddnsInfo}
      onSubmit={onSubmitDDNSForm}
    >
      {({values}) => ddnsFormRender(values)}
    </Formik>
  );
};

TCPIPDDNS.propTypes = {
  isApiProcessing: PropTypes.bool.isRequired,
  isShowApiProcessModal: PropTypes.bool.isRequired,
  ddnsInfo: PropTypes.shape({
    isEnableDDNS: PropTypes.bool.isRequired,
    ddnsProvider: PropTypes.string.isRequired,
    ddnsHost: PropTypes.string.isRequired,
    ddnsAccount: PropTypes.string.isRequired,
    ddnsPassword: PropTypes.string.isRequired,
    ddnsRefreshStatus: PropTypes.bool.isRequired,
    ddnsHostStatus: PropTypes.bool.isRequired
  }).isRequired
};

export default TCPIPDDNS;
