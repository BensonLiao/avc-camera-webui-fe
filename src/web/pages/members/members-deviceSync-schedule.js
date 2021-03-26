import classNames from 'classnames';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {getRouter} from '@benson.liao/capybara-router';
import Modal from 'react-bootstrap/Modal';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import api from '../../../core/apis/web-api';
import deviceSyncScheduleValidator from '../../validations/members/device-sync-schedule-validator';
import i18n from '../../../i18n';
import DateTimePicker from '../../../core/components/fields/datetime-picker';
import {MEMBER_PAGES} from '../../../core/constants';
import {useContextState} from '../../stateProvider';
import utils from '../../../core/utils';

const DeviceSyncSchedule = ({isShowDBSchedule, hideDBScheduleModal, devices}) => {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [initialValues, setInitialValues] = useState({
    time: 0,
    isEnabled: false,
    interval: 1,
    lastModifiedTime: 0,
    deviceList: []
  });
  const {isApiProcessing} = useContextState();

  const toggleDateTimePicker = event => {
    event.preventDefault();
    return setShowDateTimePicker(prevState => !prevState);
  };

  const onHideDateTimePicker = () => {
    return setShowDateTimePicker(false);
  };

  useEffect(() => {
    if (isShowDBSchedule) {
      api.member.getSyncSchedule().then(({data}) => {
        setInitialValues({
          ...data,
          lastModifiedTime: utils.formatDate(utils.subtractTimezoneOffset(data.lastModifiedTime))
        });
      });
    }
  }, [isShowDBSchedule]);

  const onSubmit = values => {
    localStorage.setItem('currentTab', MEMBER_PAGES.SYNC);
    progress.start();
    api.member.updateSyncSchedule({
      ...values,
      time: utils.addTimezoneOffset(values.time).getTime()
    })
      .then(getRouter().reload)
      .finally(() => {
        hideDBScheduleModal();
        progress.done();
      });
  };

  return (
    <Modal
      show={isShowDBSchedule}
      autoFocus={false}
      className="device-schedule-modal"
      onHide={hideDBScheduleModal}
    >
      <Formik
        enableReinitialize
        initialValues={{
          ...initialValues,
          time: utils.subtractTimezoneOffset(initialValues.time).getTime()
        }}
        validate={deviceSyncScheduleValidator}
        onSubmit={onSubmit}
      >
        {({values, errors, touched}) => (
          <Form className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{i18n.t('userManagement.members.syncSchedule')}</h5>
            </div>
            <div className="modal-body">
              <div className="form-row justify-content-between">
                <div className="form-group d-flex flex-column justify-content-start px-3">
                  <label className="mb-2">{i18n.t('userManagement.members.modal.database.enableSyncSchedule')}</label>
                  <div className="custom-control custom-switch mt-2">
                    <Field
                      name="isEnabled"
                      type="checkbox"
                      className="custom-control-input"
                      id="switch-output"
                    />
                    <label className="custom-control-label" htmlFor="switch-output">
                      <span>{i18n.t('common.button.on')}</span>
                      <span>{i18n.t('common.button.off')}</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-auto">
                    <label>{i18n.t('userManagement.members.modal.database.interval')}</label>
                    <Field
                      name="interval"
                      type="number"
                      placeholder={i18n.t('userManagement.members.modal.database.intervalPlaceholder')}
                      className={classNames('form-control', {'is-invalid': errors.interval && touched.interval})}
                    />
                    <ErrorMessage component="div" name="interval" className="invalid-feedback"/>
                    <small className="text-info">
                      {i18n.t('userManagement.members.modal.database.intervalHelper')}
                    </small>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-auto">
                    <label>{i18n.t('userManagement.members.modal.database.scheduleTime')}</label>
                    <div className="form-row datepicker-wrapper justify-content-end">
                      <Field
                        name="time"
                        component={DateTimePicker}
                        timeTabText={i18n.t('system.dateTime.syncTime')}
                        inputProps={{
                          className: classNames(
                            'btn border date px-4 btn-date-time',
                            {active: showDateTimePicker}
                          ),
                          placeholder: i18n.t('system.dateTime.syncTime'),
                          style: {whiteSpace: 'nowrap'}
                        }}
                        isShowPicker={showDateTimePicker}
                        onClickInput={toggleDateTimePicker}
                        onHide={onHideDateTimePicker}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group device-schedule-table">
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th
                          className="text-center th-checkbox"
                        >
                          {i18n.t('userManagement.members.modal.database.select')}
                        </th>
                        <th>{i18n.t('userManagement.members.host')}</th>
                        <th>{i18n.t('userManagement.members.deviceName')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map(x => (
                        <tr key={x.id}>
                          <td className="text-center td-checkbox">
                            <Field
                              type="checkbox"
                              name="deviceList"
                              id={`schedule-${x.id}`}
                              value={`${x.id}`}
                            />
                            <label htmlFor={`schedule-${x.id}`}/>
                          </td>
                          <td>{x.ip}</td>
                          <td>{x.name}</td>
                        </tr>
                      ))}
                      {
                        /* Empty Message */
                        !devices.length && (
                          <tr className="disable-highlight">
                            <td className="text-size-20 text-center border-0" colSpan="10">
                              <i className="fas fa-frown-open fa-fw text-dark"/> {i18n.t('userManagement.members.noData')}
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              {
                errors.deviceList && (
                  <div className="invalid-feedback" style={{display: 'block'}}>{errors.deviceList}</div>
                )
              }
              <div className="d-flex justify-content-between mt-2">
                <span>
                  {`${i18n.t('common.table.popover.selected')} : ${values.deviceList.length}`}
                </span>
                <span>
                  {`${i18n.t('userManagement.members.lastUpdated')} : ${initialValues.lastModifiedTime}`}
                </span>
              </div>
            </div>
            <div className="modal-footer flex-column">
              <div className="form-group w-100 mx-0">
                <button disabled={isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
                  {i18n.t('common.button.confirm')}
                </button>
              </div>
              <button
                type="button"
                className="btn btn-info btn-block m-0 rounded-pill"
                onClick={hideDBScheduleModal}
              >
                {i18n.t('common.button.close')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

DeviceSyncSchedule.propTypes = {
  isShowDBSchedule: PropTypes.bool.isRequired,
  hideDBScheduleModal: PropTypes.func.isRequired,
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      account: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      ip: PropTypes.string.isRequired,
      port: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      connectionStatus: PropTypes.number.isRequired,
      lastUpdateTime: PropTypes.number.isRequired,
      syncStatus: PropTypes.number.isRequired
    })
  ).isRequired
};

export default DeviceSyncSchedule;
