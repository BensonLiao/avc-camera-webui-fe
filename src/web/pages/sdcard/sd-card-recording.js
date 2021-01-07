import classNames from 'classnames';
import {Field} from 'formik';
import React from 'react';
import {Tab} from 'react-bootstrap';
import SDCardRecordingDuration from 'webserver-form-schema/constants/sdcard-recording-duration';
import SDCardRecordingType from 'webserver-form-schema/constants/sdcard-recording-type';
import SDCardRecordingStream from 'webserver-form-schema/constants/sdcard-recording-stream';
import SDCardRecordingLimit from 'webserver-form-schema/constants/sdcard-recording-limit';
import i18n from '../../../i18n';
import i18nUtils from '../../../i18n/utils';
import PropTypes from 'prop-types';
import SelectField from '../../../core/components/fields/select-field';

const SDCardRecording = ({streamSettings, formValues, setFieldValue}) => {
  const processOptions = (() => {
    return {
      // filter is temporary, REMOVE when ready
      type: SDCardRecordingType.all().filter(x => x !== '1').map(x => i18nUtils.getSDCardRecordingType(x)),
      stream: SDCardRecordingStream.all().filter(x => x !== '2').map(x => {
        const {value, label} = i18nUtils.getSDCardRecordingStream(x);
        let channel = x === '1' ? 'channelA' : 'channelB';
        return {
          value,
          label: label + ' ' + i18nUtils.getStreamResolutionOption(streamSettings[channel].resolution).label
        };
      }),
      limit: SDCardRecordingLimit.all().map(x => i18nUtils.getSDCardRecordingLimit(x))
    };
  })();

  const wrapperClassName = 'col-sm-6';
  const labelClassName = 'col-form-label col-sm-6';

  const getCurrentStreamSettings = (setFieldValue, event) => {
    setFieldValue('sdRecordingStream', event.target.value);
    if (event.target.value === SDCardRecordingStream[1]) {
      setFieldValue('frameRate', streamSettings.channelA.frameRate);
      setFieldValue('codec', streamSettings.channelA.codec);
    }

    if (event.target.value === SDCardRecordingStream[2]) {
      setFieldValue('frameRate', streamSettings.channelB.frameRate);
      setFieldValue('codec', streamSettings.channelB.codec);
    }
  };

  return (
    <Tab.Content>
      <Tab.Pane eventKey="tab-sdcard-recording">
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{i18n.t('sdCard.basic.enableRecording')}</label>
          <div className="custom-control custom-switch">
            <Field
              name="sdRecordingEnabled"
              type="checkbox"
              className="custom-control-input"
              id="switch-recording"
            />
            <label className={classNames('custom-control-label', {'custom-control-label-disabled': false})} htmlFor="switch-recording">
              <span>{i18n.t('common.button.on')}</span>
              <span>{i18n.t('common.button.off')}</span>
            </label>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <div className="form-group pr-3">
              <SelectField
                row
                wrapperClassName={wrapperClassName}
                labelClassName={labelClassName}
                labelName={i18n.t('sdCard.basic.recordingType')}
                name="sdRecordingType"
              >
                {processOptions.type.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </SelectField>
              <SelectField
                row
                wrapperClassName={wrapperClassName}
                labelClassName={labelClassName}
                labelName={i18n.t('sdCard.basic.recordingResolution')}
                name="sdRecordingStream"
                onChange={event => getCurrentStreamSettings(setFieldValue, event)}
              >
                {processOptions.stream.map(stream => (
                  <option key={stream.value} value={stream.value}>
                    {stream.label}
                  </option>
                ))}
              </SelectField>
              <div className="sd-fr-codec">
                <SelectField
                  row
                  readOnly
                  wrapperClassName={wrapperClassName}
                  labelClassName={labelClassName}
                  labelName={i18n.t('sdCard.basic.fps')}
                  name="frameRate"
                >
                  <option>{formValues.frameRate}</option>
                </SelectField>
                <SelectField
                  row
                  readOnly
                  formClassName="mb-0"
                  wrapperClassName={wrapperClassName}
                  labelClassName={labelClassName}
                  labelName={i18n.t('sdCard.basic.codec')}
                  name="codec"
                >
                  <option>{formValues.codec}</option>
                </SelectField>
              </div>
              <SelectField
                row
                wrapperClassName={wrapperClassName}
                labelClassName={labelClassName}
                labelName={i18n.t('sdCard.basic.recordingDuration')}
                name="sdRecordingDuration"
              >
                {SDCardRecordingDuration.all().map(duration => (
                  <option key={duration} value={duration}>{duration === '0' ? i18n.t('sdCard.basic.constants.storageToFull') : duration}</option>
                ))}
              </SelectField>
              <SelectField
                row
                wrapperClassName={wrapperClassName}
                labelClassName={labelClassName}
                labelName={i18n.t('sdCard.basic.recordingLimit')}
                name="sdRecordingLimit"
              >
                {processOptions.limit.map(limit => (
                  <option key={limit.value} value={limit.value}>{limit.label}</option>
                ))}
              </SelectField>
            </div>
          </div>
        </div>
        <button
          className="btn btn-block btn-primary rounded-pill"
          type="submit"
        >
          {i18n.t('common.button.apply')}
        </button>
      </Tab.Pane>
    </Tab.Content>
  );
};

SDCardRecording.propTypes = {
  streamSettings: PropTypes.shape({
    channelA: PropTypes.shape({
      bandwidthManagement: PropTypes.string.isRequired,
      bitRate: PropTypes.string.isRequired,
      codec: PropTypes.string.isRequired,
      frameRate: PropTypes.string.isRequired,
      gov: PropTypes.string.isRequired,
      resolution: PropTypes.string.isRequired
    }),
    channelB: PropTypes.shape({
      bandwidthManagement: PropTypes.string.isRequired,
      bitRate: PropTypes.string.isRequired,
      codec: PropTypes.string.isRequired,
      frameRate: PropTypes.string.isRequired,
      gov: PropTypes.string.isRequired,
      resolution: PropTypes.string.isRequired
    })
  }).isRequired,
  formValues: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired
};

export default SDCardRecording;
