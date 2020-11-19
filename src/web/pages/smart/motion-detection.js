import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import {getRouter} from 'capybara-router';
import progress from 'nprogress';
import PropTypes from 'prop-types';
import React, {useState, useRef} from 'react';
import api from '../../../core/apis/web-api';
import BreadCrumb from '../../../core/components/fields/breadcrumb';
import i18n from '../../../i18n';
import iconHotkeyBackspace from '../../../resource/hotkey-backspace-32px.svg';
import iconHotkeyDeleted from '../../../resource/hotkey-delete-32px.svg';
import iconCursor from '../../../resource/cursor-24px.svg';
import MotionDetectionSettingsSchema from 'webserver-form-schema/motion-detection-settings-schema';
import MaskArea from '../../../core/components/fields/mask-area';
import Slider from '../../../core/components/fields/slider';
import {useContextState} from '../../stateProvider';
import withGlobalStatus from '../../withGlobalStatus';

const MotionDetection = ({motionDetectionSettings, motionDetectionSettings: {areas, isEnable}}) => {
  const {isApiProcessing} = useContextState();
  const [maskAreaStates, setMaskAreaStates] = useState([
    {isVisible: Boolean(areas[0]) && isEnable},
    {isVisible: Boolean(areas[1]) && isEnable},
    {isVisible: Boolean(areas[2]) && isEnable},
    {isVisible: Boolean(areas[3]) && isEnable}
  ]);

  const videoWrapperRef = useRef(null);
  const maskAreaRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const generateInitialValues = settings => {
    return {...settings};
  };

  const generateDeleteMaskAreaHandler = index => event => {
    // Delete if backspace or delete key is detected
    if (event.keyCode === 8 || event.keyCode === 46) {
      setMaskAreaStates(prevState => {
        const maskAreaStates = [...prevState];
        maskAreaStates[index].isVisible = false;
        return maskAreaStates;
      });
    }
  };

  const generateVideoWrapperMouseDownHandler = form => event => {
    const width = videoWrapperRef.current.offsetWidth;
    const height = videoWrapperRef.current.offsetHeight;
    const rect = videoWrapperRef.current.getBoundingClientRect();
    const position = {
      x: Math.round((event.clientX - rect.left) / width * 100),
      y: Math.round((event.clientY - rect.top) / height * 100),
      width: 1,
      height: 1
    };
    const maskAreas = [...form.initialValues.areas];
    const mouseDownEvent = {...event};

    for (let index = 0; index < maskAreaStates.length; index += 1) {
      if (!maskAreaStates[index].isVisible) {
        maskAreaStates[index].isVisible = true;
        maskAreas[index] = position;
        form.resetForm({
          values: {
            ...form.initialValues,
            isEnable: form.values.isEnable,
            areas: maskAreas
          }
        });
        setMaskAreaStates(maskAreaStates);

        setTimeout(() => {
          for (let maskAreaIndex = 0; maskAreaIndex < maskAreaStates.length; maskAreaIndex += 1) {
            // Recover other areas.
            if (maskAreaIndex !== index) {
              form.setFieldValue(`areas.${maskAreaIndex}`, form.values.areas[maskAreaIndex]);
            }
          }

          maskAreaRefs[index].current.dispatchEvent(
            new MouseEvent('mousedown', mouseDownEvent)
          );
        });
        return;
      }
    }
  };

  const onSubmitMotionDetectionSettingsForm = values => {
    progress.start();
    api.smartFunction.updateMotionDetectionSettings({
      isEnable: values.isEnable,
      sensibility: values.sensibility,
      areas: (() => {
        const result = [];

        maskAreaStates.forEach((state, index) => {
          if (state.isVisible) {
            result.push(values.areas[index]);
          }
        });
        return result;
      })()
    })
      .then(getRouter().reload)
      .finally(progress.done);
  };

  return (
    <div className="page-smart">
      <div className="container-fluid">
        <Formik
          initialValues={generateInitialValues(motionDetectionSettings)}
          onSubmit={onSubmitMotionDetectionSettingsForm}
        >
          {form => {
            const {values} = form;
            const maskAreaItems = [0, 1, 2, 3];
            return (
              <Form className="row">
                <BreadCrumb
                  path={[i18n.t('Analytics Settings'), i18n.t('Motion Detection')]}
                  routes={['/analytic/face-recognition']}
                />
                <div className="col-7 pl-3 pr-0">
                  <div ref={videoWrapperRef} id="md-video-wrapper" className="video-wrapper">
                    <img
                      className="img-fluid"
                      draggable={false}
                      src="/api/snapshot"
                      onMouseDown={generateVideoWrapperMouseDownHandler(form)}
                    />
                    {
                      maskAreaItems.map(index => (
                        maskAreaStates[index].isVisible ? (
                          <div key={index} className="draggable-wrapper" tabIndex={-1} onKeyDown={generateDeleteMaskAreaHandler(index)}>
                            <Field
                              rightBottomCornerRef={maskAreaRefs[index]}
                              name={`areas.${index}`}
                              component={MaskArea}
                              text={i18n.t('Detection Zone')}
                              className="bounding-primary"
                              parentElementId="md-video-wrapper"
                            />
                          </div>
                        ) :
                          <div key={index}/>
                      ))
                    }
                  </div>
                </div>

                <div className="col-5 pl-4 pr-0">
                  <div className="card shadow">
                    <div className="card-header">{i18n.t('Motion Detection')}</div>
                    <div className="card-body">
                      <div className="form-group d-flex justify-content-between align-items-center">
                        <label className="mb-0">{i18n.t('Enable Motion Detection')}</label>
                        <div className="custom-control custom-switch">
                          <Field name="isEnable" type="checkbox" className="custom-control-input" id="switch-motion-detection"/>
                          <label className="custom-control-label" htmlFor="switch-motion-detection">
                            <span>{i18n.t('ON')}</span>
                            <span>{i18n.t('OFF')}</span>
                          </label>
                        </div>
                      </div>
                      <div className="form-group mb-3">
                        <span className="form-text text-primary">{i18n.t('Create detection zones on the live view screen.')}</span>
                      </div>

                      <hr/>

                      <div className={classNames('form-group', values.isEnable ? '' : 'd-none')}>
                        <div className="d-flex justify-content-between align-items-center">
                          <label>{i18n.t('Sensitivity')}</label>
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
                        <div className="card-header l-24 light text-size-18">{i18n.t('Note Area')}</div>
                        <div className="card-body l-32 light px-3 py-3">
                          <div className="mb-2 d-flex justify-content-between align-items-center">
                            <span className="font-italic text-size-14">•{i18n.t('To set a zone:')}</span>
                            <div className="d-flex align-items-center drag-icon">
                              <img src={iconCursor}/>
                              <span className="text-size-12">{i18n.t('Drag')}</span>
                            </div>
                          </div>
                          <div className="mb-2 d-flex justify-content-between align-items-center">
                            <span className="font-italic text-size-14">•{i18n.t('To erase a zone:')}</span>
                            <div className="d-flex justify-content-end align-items-center flex-wrap">
                              <img src={iconHotkeyBackspace}/>
                              <span className="font-italic text-size-14 mx-2">{i18n.t('or')}</span>
                              <img src={iconHotkeyDeleted}/>
                            </div>
                          </div>
                          <div className="mb-2 d-flex justify-content-between align-items-center">
                            <span className="font-italic text-size-14">•{i18n.t('Up to 4 detection zones can be set.')}</span>
                          </div>
                        </div>
                      </div>

                      <button disabled={isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill">
                        {i18n.t('Apply')}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

MotionDetection.propTypes = {
  motionDetectionSettings: PropTypes.shape({
    isEnable: PropTypes.bool.isRequired,
    sensibility: PropTypes.number.isRequired,
    areas: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }).isRequired).isRequired
  }).isRequired
};

export default withGlobalStatus(MotionDetection);
