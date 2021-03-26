import classNames from 'classnames';
import ContentEditable from '@benson.liao/react-content-editable';
import {Nav, Tab, Accordion, Card} from 'react-bootstrap';
import React from 'react';
import sanitizeHtml from 'sanitize-html';
import i18n from '../../../i18n';
import {useContextState} from '../../stateProvider';
import {Field} from 'formik';
import {connectForm} from '../../../core/components/form-connect';
import {objectOption} from '../../../core/components/drawing-canvas-editor/canvas/constants/defaults';
import {HUMAN_DETECTION_TYPE} from '../../../core/constants';

const stayTimeRange = {
  min: 0,
  max: 60
};
const stayCountLimitRange = {
  min: 1,
  max: 10
};

const CustomNormalWrapper = (
  <div style={{
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: 'white'
  }}
  />
);
const HumanDetectionSettings = connectForm(({
  formik,
  currentTab,
  setCurrentTab,
  currentAreaId,
  setCurrentAreaId,
  currentLineId,
  setCurrentLineId
}) => {
  const {isApiProcessing} = useContextState();
  const onAccordionSelect = event => {
    setCurrentAreaId(event);
  };

  const onAccordionLineSelect = event => {
    setCurrentLineId(event);
  };

  const validateStayTime = value => {
    if (value < stayTimeRange.min || value > stayTimeRange.max) {
      return true;
    }
  };

  const validateStayCountLimit = value => {
    if (value < stayCountLimitRange.min || value > stayCountLimitRange.max) {
      return true;
    }
  };

  const generateInvalidId = () => {
    let stayTimeIds = '';
    let stayCountLimitIds = '';
    formik.errors.triggerArea.forEach((error, idx) => {
      if (error) {
        if (error.stayTime) {
          stayTimeIds += (stayTimeIds ? ', ' : '') + `${idx + 1}`;
        }

        if (error.stayCountLimit) {
          stayCountLimitIds += (stayCountLimitIds ? ', ' : '') + `${idx + 1}`;
        }
      }
    });
    return {
      stayTimeIds,
      stayCountLimitIds
    };
  };

  const renderErrorMessage = () => {
    const {stayTimeIds, stayCountLimitIds} = generateInvalidId();
    let msg = [];
    if (stayTimeIds) {
      msg.push(
        <div
          key="stayTime"
          className="invalid-feedback"
          style={{display: 'block'}}
        >
          {`${i18n.t('analytics.humanDetection.area')} ${stayTimeIds}: ${i18n.t('validation.invalidStayTime')}`}
        </div>
      );
    }

    if (stayCountLimitIds) {
      msg.push(
        <div
          key="stayCountLimit"
          className="invalid-feedback"
          style={{display: 'block'}}
        >
          {`${i18n.t('analytics.humanDetection.area')} ${stayCountLimitIds}: ${i18n.t('validation.invalidStayCountLimit')}`}
        </div>
      );
    }

    return msg;
  };

  const sanitizeInput = input => {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {}
    });
  };

  const onChangeAreaTitle = idx => value => {
    if (value) {
      formik.setFieldValue(`triggerArea[${idx}].name`, sanitizeInput(value));
    }
  };

  const onChangeLineTitle = idx => value => {
    if (value) {
      formik.setFieldValue(`triggerLine[${idx}].name`, sanitizeInput(value));
    }
  };

  return (
    <div className="setting-panel shadow rounded-0">
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex flex-row align-items-center justify-content-between my-3">
            <label className="mb-0">{i18n.t('analytics.humanDetection.enableHD')}</label>
            <div className="custom-control custom-switch">
              <Field
                name="isEnable"
                type="checkbox"
                className="custom-control-input"
                id="switch-human-detection"
              />
              <label className="custom-control-label" htmlFor="switch-human-detection">
                <span>{i18n.t('common.button.on')}</span>
                <span>{i18n.t('common.button.off')}</span>
              </label>
            </div>
          </div>
          <hr/>
          <Tab.Container activeKey={currentTab}>
            <Nav
              className="px-0 justify-content-center"
              onSelect={event => {
                setCurrentTab(event);
              }}
            >
              {Object.values(HUMAN_DETECTION_TYPE).map(tab => (
                <Nav.Item key={tab} className="w-50 text-center">
                  <Nav.Link
                    eventKey={tab}
                  >
                    {tab === HUMAN_DETECTION_TYPE.LINE ?
                      i18n.t('analytics.humanDetection.triggerLine') :
                      i18n.t('analytics.humanDetection.triggerArea')}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <Tab.Content className="mt-3">
              <Tab.Pane eventKey={HUMAN_DETECTION_TYPE.LINE}>
                <Accordion activeKey={currentLineId} onSelect={onAccordionLineSelect}>
                  {
                    formik.values.triggerLine.map((line, idx) => (
                      <Card key={line.id}>
                        <Accordion.Toggle
                          as={Card.Header}
                          eventKey={`${line.id}`}
                          className="py-2 d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div
                              className="color-block mr-2"
                              style={{
                                background: objectOption.lines[line.id].stroke,
                                width: '1rem',
                                height: '1rem',
                                border: `1px solid ${
                                  objectOption.lines.arrow.borderColor[objectOption.lines[line.id].stroke] ?
                                    objectOption.lines.arrow.borderColor[objectOption.lines[line.id].stroke] :
                                    objectOption.lines.arrow.borderColor.default
                                }`
                              }}
                            />
                            <ContentEditable
                              ellipseOnBlur
                              tag="p"
                              width="180px"
                              maxLength={32}
                              value={line.name}
                              customWrapper={CustomNormalWrapper}
                              onChange={onChangeLineTitle(idx)}
                            />
                            {/* {i18n.t('analytics.humanDetection.line')} {idx + 1} */}
                          </div>
                          <div className="custom-control custom-switch">
                            <Field
                              name={`triggerLine[${idx}].isEnable`}
                              type="checkbox"
                              className="custom-control-input"
                              id={`switch-line-${idx}`}
                            />
                            <label className="custom-control-label" htmlFor={`switch-line-${idx}`}>
                              <span>{i18n.t('common.button.on')}</span>
                              <span>{i18n.t('common.button.off')}</span>
                            </label>
                          </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={`${line.id}`}>
                          <Card.Body>
                            <div key={line.id} className="trigger-settings">
                              <div className="d-flex flex-column">
                                <div className="form-check">
                                  <Field
                                    name={`triggerLine[${idx}].isDisplay`}
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`switch-line-display-${idx}`}
                                  />
                                  <label
                                    className="form-check-label pl-1"
                                    htmlFor={`switch-line-display-${idx}`}
                                  >
                                    {i18n.t('analytics.humanDetection.enableOSD')}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    ))
                  }
                </Accordion>

                {/* <div className="d-flex justify-content-between align-items-center mb-4">
                  <label>Counting Line</label>
                  <div className="text-primary">
                  Clear
                  </div>
                </div>
                <div className="form-group display-text-inputs d-flex">
                  <div className="input-group border">
                    <div className="input-group-prepend ml-2 align-items-center">
                      <div className="color-block" style={{background: 'blue'}}/>
                    </div>
                    <Field
                      name="directionNamingIn"
                      type="text"
                      placeholder="In"
                      autoComplete="off"
                      className={classNames('form-control border-0 shadow-none', {'is-invalid': false})}
                    />
                    <div className="vertical-border m-0 h-100"/>
                    <div className="input-group-prepend ml-2 align-items-center">
                      <div className="color-block" style={{background: 'yellow'}}/>
                    </div>
                    <Field
                      name="directionNamingOut"
                      type="text"
                      placeholder="Out"
                      autoComplete="off"
                      className={classNames('form-control border-0 shadow-none', {'is-invalid': false})}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <label>Counting Number</label>
                  <div className="text-primary">
                    Clear
                  </div>
                </div>
                <hr/>
                <div className="title">
                  <span>Intrusion Area</span>
                </div>
                <div>
                  <div className="form-group">
                    <label>Alert Title</label>
                    <Field
                      name="alertTitle"
                      type="text"
                      placeholder="Alert"
                      className={classNames('form-control', {'is-invalid': false})}
                    />
                    <ErrorMessage component="div" name="alertTitle" className="invalid-feedback"/>
                  </div>
                </div> */}
              </Tab.Pane>
              <Tab.Pane eventKey={HUMAN_DETECTION_TYPE.AREA}>
                <Accordion activeKey={currentAreaId} onSelect={onAccordionSelect}>
                  {formik.values.triggerArea.map((area, idx) => (
                    <Card key={area.id}>
                      <Accordion.Toggle
                        as={Card.Header}
                        eventKey={`${area.id}`}
                        className="py-2 d-flex justify-content-between align-items-center"
                      >
                        <ContentEditable
                          ellipseOnBlur
                          tag="p"
                          width="180px"
                          maxLength={32}
                          value={area.name}
                          customWrapper={CustomNormalWrapper}
                          onChange={onChangeAreaTitle(idx)}
                        />
                        <div className="custom-control custom-switch">
                          <Field
                            name={`triggerArea[${idx}].isEnable`}
                            type="checkbox"
                            className="custom-control-input"
                            id={`switch-area-${idx}`}
                          />
                          <label className="custom-control-label" htmlFor={`switch-area-${idx}`}>
                            <span>{i18n.t('common.button.on')}</span>
                            <span>{i18n.t('common.button.off')}</span>
                          </label>
                        </div>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={`${area.id}`}>
                        <Card.Body>
                          <div className="trigger-settings">
                            <div className="d-flex flex-column justify-content-start">
                              <label className="mb-2">
                                {i18n.t('analytics.humanDetection.loiterTime')}
                              </label>
                              <div className="d-inline-flex form-input mb-2">
                                <Field
                                  name={`triggerArea[${idx}].stayTime`}
                                  type="number"
                                  className={classNames('form-control w-50', {'is-invalid': formik.errors?.triggerArea?.[idx]?.stayTime})}
                                  validate={validateStayTime}
                                />
                                <small className="align-self-end text-muted ml-2">
                                  {`${stayTimeRange.min} - ${stayTimeRange.max} / `}
                                  {i18n.t('analytics.humanDetection.stayTimeUnit', {count: area.stayTime})}
                                </small>
                              </div>
                              <label>
                                {i18n.t('analytics.humanDetection.capacityLimit')}
                              </label>
                              <div className="d-inline-flex form-input mb-3">
                                <Field
                                  name={`triggerArea[${idx}].stayCountLimit`}
                                  type="number"
                                  className={classNames('form-control w-50', {'is-invalid': formik.errors?.triggerArea?.[idx]?.stayCountLimit})}
                                  validate={validateStayCountLimit}
                                />
                                <small className="align-self-end text-muted ml-2">
                                  {`${stayCountLimitRange.min} - ${stayCountLimitRange.max} / `}
                                  {i18n.t('analytics.humanDetection.stayCountLimitUnit', {count: area.stayCountLimit})}
                                </small>
                              </div>
                              <div className="form-check">
                                <Field
                                  name={`triggerArea[${idx}].isDisplay`}
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`switch-area-display-${idx}`}
                                />
                                <label
                                  className="form-check-label pl-1"
                                  htmlFor={`switch-area-display-${idx}`}
                                >
                                  {i18n.t('analytics.humanDetection.enableOSD')}
                                </label>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ))}
                </Accordion>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
          {formik.errors.triggerArea && renderErrorMessage()}
          <hr/>
        </div>
        <div>
          <div className="d-flex">
            <button disabled={isApiProcessing} type="submit" className="btn btn-primary rounded-pill ml-auto px-40px">
              {i18n.t('common.button.apply')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default HumanDetectionSettings;
