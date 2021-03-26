import classNames from 'classnames';
import {Field} from 'formik';
import React, {useState, useMemo} from 'react';
import {Tab} from 'react-bootstrap';
import SDCardRecordingDuration from 'webserver-form-schema/constants/sdcard-recording-duration';
import SDCardRecordingType from 'webserver-form-schema/constants/sdcard-recording-type';
import SDCardRecordingStream from 'webserver-form-schema/constants/sdcard-recording-stream';
import SDCardRecordingLimit from 'webserver-form-schema/constants/sdcard-recording-limit';
import SDCardPrerecordingDuration from 'webserver-form-schema/constants/sdcard-prerecording-duration';
import i18n from '../../../i18n';
import i18nUtils from '../../../i18n/utils';
import PropTypes from 'prop-types';
import SelectField from '../../../core/components/fields/select-field';
import {connectForm} from '../../../core/components/form-connect';
import utils from '../../../core/utils';
import FormikEffect from '../../../core/components/formik-effect';
import StreamCodec from 'webserver-form-schema/constants/stream-codec';
import {useConfirm} from '../../../core/components/confirm';
import {useContextState} from '../../stateProvider';
import CustomTooltip from '../../../core/components/tooltip';

const SDCardRecording = connectForm(({
  streamSettings,
  sdCardRecordingSettings,
  onSubmit,
  isWaitingApiCall,
  formik: {errors, values: formValues, setValues}
}) => {
  const confirm = useConfirm();
  const [isDisableForm, setIsDisableForm] = useState(true);
  const {isApiProcessing} = useContextState();

  const processOptions = useMemo(() => {
    return {
      type: SDCardRecordingType.all().map(x => i18nUtils.getSDCardRecordingType(x)),
      stream: SDCardRecordingStream.all().map(x => {
        const {value, label} = i18nUtils.getSDCardRecordingStream(x);
        let channel = x === '1' ? 'channelA' : 'channelB';
        return {
          value,
          label: label + ' ' + i18nUtils.getStreamResolutionOption(streamSettings[channel].resolution).label
        };
      }),
      limit: SDCardRecordingLimit.all().map(x => i18nUtils.getSDCardRecordingLimit(x))
    };
  }, [streamSettings]);

  /**
   * Manually set onChange for sdRecordingType and several other form fields
   * @param {object} event - Native event object
   * @returns {void}
   */
  const onUpdateRecordingType = event => {
    const recordingType = event.target.value;
    event.persist();

    if (recordingType === SDCardRecordingType.disconnection) {
      setValues({
        ...formValues,
        sdRecordingStream: SDCardRecordingStream[1],
        sdRecordingDuration: SDCardRecordingDuration[4],
        sdPrerecordingDuration: SDCardPrerecordingDuration[4],
        sdRecordingLimit: SDCardRecordingLimit.stop,
        sdRecordingType: recordingType
      });
    } else if (recordingType === SDCardRecordingType.event) {
      setValues({
        ...formValues,
        sdRecordingStream: SDCardRecordingStream[1],
        sdRecordingDuration: SDCardRecordingDuration[4],
        sdPrerecordingDuration: SDCardPrerecordingDuration[4],
        sdRecordingLimit: SDCardRecordingLimit.override,
        sdRecordingType: recordingType
      });
    } else if (recordingType === SDCardRecordingType.continuous) {
      setValues({
        ...formValues,
        sdRecordingStream: SDCardRecordingStream[1],
        sdRecordingDuration: SDCardRecordingDuration[5],
        sdPrerecordingDuration: SDCardPrerecordingDuration[0],
        sdRecordingLimit: SDCardRecordingLimit.override,
        sdRecordingType: recordingType
      });
    }
  };

  /**
   * Formik effect onChange function
   * @param {object} nextValues
   * @param {object} prevValues
   * @returns {void}
   */
  const onChangeRecordingValues = ({nextValues}) => {
    const initialValues = {...sdCardRecordingSettings};

    let bool = true;
    Object.keys(initialValues).forEach(key => {
      let typedCurrentValue = typeof initialValues[key] === 'number' ? Number(nextValues[key]) : Boolean(nextValues[key]);
      if (initialValues[key] !== typedCurrentValue) {
        bool = false;
      }
    });

    setIsDisableForm(bool);
  };

  const handleSubmit = formValues => _ => {
    confirm.open({
      title: i18n.t('sdCard.basic.modal.recordingOnOffTitle'),
      body: formValues.sdRecordingEnabled ?
        i18n.t('sdCard.basic.modal.recordingOnBody') :
        i18n.t('sdCard.basic.modal.recordingOffBody')
    })
      .then(isConfirm => {
        if (isConfirm) {
          onSubmit(formValues);
        }
      });
  };

  const isDisableField = formValues.sdRecordingEnabled === false || formValues.sdEnabled === false || isWaitingApiCall;
  let frameRate = streamSettings[Number(formValues.sdRecordingStream) === Number(SDCardRecordingStream[1]) ? 'channelA' : 'channelB'].frameRate;
  let codec = streamSettings[Number(formValues.sdRecordingStream) === Number(SDCardRecordingStream[1]) ? 'channelA' : 'channelB'].codec;

  return (
    <Tab.Content>
      <Tab.Pane eventKey="tab-sdcard-recording">
        <FormikEffect onChange={onChangeRecordingValues}/>
        <div className="form-group d-flex justify-content-between align-items-center mb-2">
          <label className="mb-0">{i18n.t('sdCard.basic.enableRecording')}</label>
          <CustomTooltip show={!formValues.sdEnabled} title={i18n.t('sdCard.basic.enable')}>
            <div className="custom-control custom-switch">
              <Field
                name="sdRecordingEnabled"
                type="checkbox"
                className="custom-control-input"
                style={formValues.sdEnabled ? {} : {pointerEvents: 'none'}}
                id="switch-recording"
                disabled={formValues.sdEnabled === false || isWaitingApiCall}
              />
              <label
                className={classNames('custom-control-label', {'custom-control-label-disabled': formValues.sdEnabled === false || isWaitingApiCall})}
                htmlFor="switch-recording"
              >
                <span>{i18n.t('common.button.on')}</span>
                <span>{i18n.t('common.button.off')}</span>
              </label>
            </div>
          </CustomTooltip>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <div className="form-group pr-3 mb-0">
              <SelectField
                readOnly={isDisableField}
                labelName={i18n.t('sdCard.basic.recordingType')}
                name="sdRecordingType"
                onChange={event => onUpdateRecordingType(event)}
              >
                {processOptions.type.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </SelectField>
              <div>
                <label>{i18n.t('sdCard.basic.recordingResolution')}</label>
                <CustomTooltip title={i18n.t('sdcard.recording.resolutionHelper')}>
                  <i className="fas fa-question-circle helper-text text-primary ml-2"/>
                </CustomTooltip>
              </div>
              <SelectField
                noMb
                labelName=""
                labelClassName="d-none"
                readOnly={isDisableField}
                name="sdRecordingStream"
              >
                {processOptions.stream.map(stream => (
                  <option
                    key={stream.value}
                    disabled={stream.value === SDCardRecordingStream[2] &&
                   streamSettings.channelB.codec !== StreamCodec.h264}
                    value={stream.value}
                  >
                    {stream.label}
                  </option>
                ))}
              </SelectField>
              <div className="sd-fr-codec mt-2 mb-4">
                <div className="d-flex">
                  <span className="col-6 fr-codec-label">
                    {i18n.t('sdCard.basic.fps')}
                  </span>
                  <span className="col-6">
                    {frameRate}
                  </span>
                </div>
                <div className="d-flex">
                  <span className="col-6 fr-codec-label">
                    {i18n.t('sdCard.basic.codec')}
                  </span>
                  <span className="col-6">
                    {codec}
                  </span>
                </div>
              </div>
              <SelectField
                readOnly={isDisableField}
                labelName={i18n.t('sdCard.basic.recordingDuration')}
                name="sdRecordingDuration"
              >
                {SDCardRecordingDuration.all().map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </SelectField>
              <SelectField
                readOnly={isDisableField || formValues.sdRecordingType.toString() === SDCardRecordingType.continuous}
                labelName={i18n.t('sdCard.basic.prerecordingDuration')}
                name="sdPrerecordingDuration"
              >
                {SDCardPrerecordingDuration.all().map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </SelectField>
              <SelectField
                readOnly={isDisableField}
                formClassName="mb-0"
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
        <div
          className="horizontal-border"
          style={{
            width: 'calc(100% + 3rem)',
            marginLeft: '-1.5rem'
          }}
        />
        <div className="d-flex mt-4">
          <button
            className="btn btn-primary rounded-pill ml-auto px-40px"
            disabled={!utils.isObjectEmpty(errors) || isDisableForm || isApiProcessing}
            type="button"
            onClick={handleSubmit(formValues)}
          >
            {i18n.t('common.button.apply')}
          </button>
        </div>
      </Tab.Pane>
    </Tab.Content>
  );
});

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
  sdCardRecordingSettings: PropTypes.shape({
    sdRecordingDuration: PropTypes.number.isRequired,
    sdRecordingEnabled: PropTypes.bool.isRequired,
    sdRecordingLimit: PropTypes.number.isRequired,
    sdRecordingStatus: PropTypes.number.isRequired,
    sdRecordingStream: PropTypes.number.isRequired,
    sdRecordingType: PropTypes.number.isRequired,
    sdPrerecordingDuration: PropTypes.number.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  isWaitingApiCall: PropTypes.bool.isRequired
};

export default SDCardRecording;
