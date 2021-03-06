import classNames from 'classnames';
import React from 'react';
import {useFormikContext, Field} from 'formik';
import i18n from '../../../i18n';
import iconCursor from '../../../resource/cursor-24px.svg';
import iconHotkeyBackspace from '../../../resource/hotkey-backspace-32px.svg';
import iconHotkeyDeleted from '../../../resource/hotkey-delete-32px.svg';
import MotionDetectionSettingsSchema from 'webserver-form-schema/motion-detection-settings-schema';
import Slider from '../../../core/components/fields/slider';
import {useContextState} from '../../stateProvider';

const MotionDetectionSettings = () => {
  const {isApiProcessing} = useContextState();
  const {values} = useFormikContext();

  return (
    <div className="col-5 pl-4 pr-0">
      <div className="card shadow">
        <div className="card-header">{i18n.t('analytics.motionDetection.title')}</div>
        <div className="card-body">
          <div className="form-group d-flex justify-content-between align-items-center">
            <label className="mb-0">{i18n.t('analytics.motionDetection.enableMD')}</label>
            <div className="custom-control custom-switch">
              <Field name="isEnable" type="checkbox" className="custom-control-input" id="switch-motion-detection"/>
              <label className="custom-control-label" htmlFor="switch-motion-detection">
                <span>{i18n.t('common.button.on')}</span>
                <span>{i18n.t('common.button.off')}</span>
              </label>
            </div>
          </div>
          <div className="form-group mb-3">
            <span className="form-text text-primary">{i18n.t('analytics.motionDetection.mdHelper')}</span>
          </div>

          <hr/>

          <div className={classNames('form-group', values.isEnable ? '' : 'd-none')}>
            <div className="d-flex justify-content-between align-items-center">
              <label>{i18n.t('analytics.motionDetection.sensitivity')}</label>
              <span className="text-primary text-size-14">{values.sensibility}</span>
            </div>
            <Field
              disableStepper
              name="sensibility"
              component={Slider}
              step={1}
              min={MotionDetectionSettingsSchema.sensibility.min}
              max={MotionDetectionSettingsSchema.sensibility.max}
            />
          </div>
          <div className="form-group">
            <div className="card-header l-24 light text-size-18">{i18n.t('analytics.motionDetection.noteArea')}</div>
            <div className="card-body l-32 light px-3 py-3">
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="font-italic text-size-14">•{i18n.t('analytics.motionDetection.note1')}</span>
                <div className="d-flex align-items-center drag-icon">
                  <img src={iconCursor}/>
                  <span className="text-size-12">{i18n.t('analytics.motionDetection.drag')}</span>
                </div>
              </div>
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="font-italic text-size-14">•{i18n.t('analytics.motionDetection.note2')}</span>
                <div className="d-flex justify-content-end align-items-center flex-wrap">
                  <img src={iconHotkeyBackspace}/>
                  <span className="font-italic text-size-14 mx-2">{i18n.t('analytics.motionDetection.or')}</span>
                  <img src={iconHotkeyDeleted}/>
                </div>
              </div>
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="font-italic text-size-14">•{i18n.t('analytics.motionDetection.note3')}</span>
              </div>
            </div>
          </div>

          <button disabled={isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill">
            {i18n.t('common.button.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MotionDetectionSettings;
