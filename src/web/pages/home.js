const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const filesize = require('filesize');
const {Formik, Form, Field} = require('formik');
const Base = require('./shared/base');
const _ = require('../../languages');
const utils = require('../../core/utils');
const deviceNameValidator = require('../validations/system/device-name-validator');

module.exports = class Home extends Base {
  static get propTypes() {
    return {
      status: PropTypes.shape({
        deviceName: PropTypes.string,
        faceRecognition: PropTypes.oneOf(['on', 'off']).isRequired,
        ageGender: PropTypes.oneOf(['on', 'off']).isRequired,
        humanoidDetection: PropTypes.oneOf(['on', 'off']).isRequired,
        state: PropTypes.string.isRequired,
        usedDiskSize: PropTypes.number.isRequired,
        totalDiskSize: PropTypes.number.isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.deviceName = props.status.deviceName;

    this.onSubmitDeviceNameForm = this.onSubmitDeviceNameForm.bind(this);
    this.deviceNameFormRender = this.deviceNameFormRender.bind(this);
  }

  onSubmitDeviceNameForm(values) {
    // Todo: not implementation
    console.log(values);
  }

  deviceNameFormRender({errors, touched}) {
    const classTable = {
      deviceName: classNames(['form-control', {'is-invalid': errors.deviceName && touched.deviceName}])
    };

    return (
      <Form className="form-group">
        <Field name="deviceName" type="text" className={classTable.deviceName}/>
        <small className="form-text text-muted">
          {_('Please enter letters between 1 and 32.')}
        </small>
        <button className="d-none" type="submit"/>
      </Form>
    );
  }

  render() {
    const usedDiskPercentage = Math.ceil((this.props.status.usedDiskSize / this.props.status.totalDiskSize) * 100);
    const classTable = {
      faceRecognitionState: classNames({
        'text-success': this.props.status.faceRecognition === 'on',
        'text-muted': this.props.status.faceRecognition === 'off'
      }),
      ageGenderState: classNames({
        'text-success': this.props.status.faceRecognition === 'on',
        'text-muted': this.props.status.faceRecognition === 'off'
      }),
      humanoidDetectionState: classNames({
        'text-success': this.props.status.faceRecognition === 'on',
        'text-muted': this.props.status.faceRecognition === 'off'
      })
    };

    return (
      <div className="main-content">
        <div className="page-home">
          <div className="container-fluid">
            <div className="row">
              <div className="col-8 pr-24">
                {/* The video */}
                <div className="video-wrapper mb-5">
                  <video width="100%">
                    <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4"/>
                  </video>
                  <div className="cover d-flex justify-content-center align-items-center">
                    <button className="btn-play" type="button"><i className="fas fa-play fa-fw"/></button>
                  </div>
                  <div className="controls d-flex justify-content-between align-items-center">
                    <div>
                      <button className="btn-stream active" type="button">{_('Stream {0}', ['01'])}</button>
                      <button className="btn-stream" type="button">{_('Stream {0}', ['02'])}</button>
                    </div>
                    <div>
                      <button className="btn-action" type="button"><i className="fas fa-camera"/></button>
                      <button className="btn-action" type="button"><i className="fas fa-expand-arrows-alt"/></button>
                    </div>
                  </div>
                </div>

                {/* System information */}
                <div className="card border-0 shadow">
                  <table>
                    <thead>
                      <tr>
                        <th>{_('Device name')}</th>
                        <th>{_('Smart functions')}</th>
                        <th>{_('Device status')}</th>
                        <th>{_('SD card')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="align-top">
                          <Formik
                            initialValues={{deviceName: this.state.deviceName}}
                            validate={utils.makeFormikValidator(deviceNameValidator)}
                            render={this.deviceNameFormRender}
                            onSubmit={this.onSubmitDeviceNameForm}/>
                        </td>
                        <td className="align-top">
                          <span>{_('Face recognition: ')}</span>
                          <span className={classTable.faceRecognitionState}>
                            {_(`state-${this.props.status.faceRecognition}`)}
                          </span>
                          <br/>
                          <span>{_('Age gender: ')}</span>
                          <span className={classTable.ageGenderState}>
                            {_(`state-${this.props.status.ageGender}`)}
                          </span>
                          <br/>
                          <span>{_('Humanoid detection: ')}</span>
                          <span className={classTable.humanoidDetectionState}>
                            {_(`state-${this.props.status.humanoidDetection}`)}
                          </span>
                        </td>
                        <td className="align-top">
                          <span className="badge badge-pill badge-success">{_('Green')}</span>
                        </td>
                        <td className="align-top">
                          <div className="progress">
                            <div className="progress-bar" style={{width: `${usedDiskPercentage}%`}}>
                              {`${usedDiskPercentage}%`}
                            </div>
                          </div>
                          <p>
                            {
                              _('Free: {0}, Total: {1}', [
                                filesize(this.props.status.totalDiskSize - this.props.status.usedDiskSize),
                                filesize(this.props.status.totalDiskSize)
                              ])
                            }
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
