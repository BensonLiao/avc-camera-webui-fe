import {Formik, Form, Field} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React from 'react';
import {Tab} from 'react-bootstrap';
import api from '../../../core/apis/web-api';
import i18n from '../../../i18n';
import notify from '../../../core/notify';
import SelectField from '../../../core/components/fields/select-field';

const TCPIPDDNS = ({ddnsInfo, isApiProcessing}) => {
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

  return (
    <Formik
      initialValues={ddnsInfo}
      onSubmit={onSubmitDDNSForm}
    >
      {({values}) => (
        <Tab.Content>
          <Tab.Pane eventKey="tab-ddns">
            <Form>
              <div className="form-group d-flex justify-content-between align-items-center">
                <label className="mb-0">{i18n.t('Enable DDNS')}</label>
                <div className="custom-control custom-switch">
                  <Field name="isEnableDDNS" type="checkbox" className="custom-control-input" id="switch-ddns-enable"/>
                  <label className="custom-control-label" htmlFor="switch-ddns-enable">
                    <span>{i18n.t('common.button.on')}</span>
                    <span>{i18n.t('common.button.off')}</span>
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
                  disabled={!values.isEnableDDNS}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block rounded-pill"
                disabled={isApiProcessing}
              >{i18n.t('common.button.apply')}
              </button>
            </Form>
          </Tab.Pane>
        </Tab.Content>
      )}
    </Formik>
  );
};

TCPIPDDNS.propTypes = {
  ddnsInfo: PropTypes.shape({
    isEnableDDNS: PropTypes.bool.isRequired,
    ddnsProvider: PropTypes.string.isRequired,
    ddnsHost: PropTypes.string.isRequired,
    ddnsAccount: PropTypes.string.isRequired,
    ddnsPassword: PropTypes.string.isRequired,
    ddnsRefreshStatus: PropTypes.bool.isRequired,
    ddnsHostStatus: PropTypes.bool.isRequired
  }).isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

export default TCPIPDDNS;
