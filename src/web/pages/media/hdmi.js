const React = require('react');
const progress = require('nprogress');
const PropTypes = require('prop-types');
const {Formik, Form, Field} = require('formik');
const {Link, getRouter} = require('capybara-router');
const Base = require('../shared/base');
const HDMISettingsSchema = require('webserver-form-schema/hdmi-settings-schema');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const _ = require('../../../languages');
const api = require('../../../core/apis/web-api');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const SelectField = require('../../../core/components/fields/select-field');

module.exports = class HDMI extends Base {
  static get propTypes() {
    return {
      hdmiSettings: PropTypes.shape({
        isEnableHDMI: PropTypes.bool.isRequired,
        resolution: PropTypes.string.isRequired,
        frameRate: PropTypes.string.isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.isShowModal = false;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = _('Updating hdmi settings');
    this.frameRate = ((() => {
      const result = [];
      for (let index = HDMISettingsSchema.frameRate.min; index <= HDMISettingsSchema.frameRate.max; index += 1) {
        result.push({
          label: `${index}`,
          value: `${index}`
        });
      }

      return result;
    })());
    this.resolution =
      StreamResolution.all()
        .filter(x => Number(x) <= 8 && Number(x) !== 4)
        .map(x => ({
          label: _(`stream-resolution-${x}`),
          value: x
        }));
  }

  showModal = () => {
    this.setState({isShowModal: true});
  };

  hideModal = () => {
    this.setState({isShowModal: false});
  };

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  onSubmitHDMISettingsForm = values => {
    progress.start();
    this.setState({
      isShowApiProcessModal: true,
      isShowModal: false
    },
    () => {
      api.multimedia.updateHDMISettings(values)
        .then(getRouter().reload)
        .catch(() => {
          this.hideApiProcessModal();
        })
        .finally(() => {
          progress.done();
        });
    });
  }

  render() {
    const {hdmiSettings} = this.props;
    const {$isApiProcessing, isShowModal, isShowApiProcessModal, apiProcessModalTitle} = this.state;
    return (
      <div className="main-content left-menu-active">
        <div className="section-media">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 px-0">
                <nav>
                  <ol className="breadcrumb rounded-pill">
                    <li className="breadcrumb-item active">
                      <Link to="/media/stream">{_('Video')}</Link>
                    </li>
                    <li className="breadcrumb-item">{_('HDMI')}</li>
                  </ol>
                </nav>
              </div>

              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">
                    {_('HDMI')}
                  </div>
                  <Formik
                    initialValues={hdmiSettings}
                    onSubmit={this.onSubmit}
                  >
                    {({values}) => (
                      <Form className="card-body">
                        {/* <div className="form-group d-flex justify-content-between align-items-center">
                          <label className="mb-0">{_('On/Off')}</label>
                          <div className="custom-control custom-switch">
                            <Field
                              name="isEnableHDMI"
                              type="checkbox"
                              className="custom-control-input"
                              id="switch-hdmi"
                            />
                            <label className="custom-control-label" htmlFor="switch-hdmi">
                              <span>{_('ON')}</span>
                              <span>{_('OFF')}</span>
                            </label>
                          </div>
                        </div> */}
                        <SelectField
                          labelName={_('Resolution')}
                          name="resolution"
                        >
                          {this.resolution.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </SelectField>
                        <SelectField labelName={_('Frame Rate (FPS)')} name="frameRate">
                          {this.frameRate.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </SelectField>
                        <button
                          disabled={$isApiProcessing}
                          type="button"
                          className="btn btn-block btn-primary rounded-pill mt-5"
                          onClick={this.showModal}
                        >
                          {_('Apply')}
                        </button>
                        <CustomNotifyModal
                          isShowModal={isShowModal}
                          modalTitle={_('HDMI Settings')}
                          modalBody={_('Are you sure you want to update hdmi settings?')}
                          isConfirmDisable={$isApiProcessing}
                          onHide={this.hideModal}
                          onConfirm={() => {
                            this.onSubmitHDMISettingsForm(values);
                          }}
                        />
                      </Form>
                    )}
                  </Formik>
                  <CustomNotifyModal
                    modalType="process"
                    backdrop="static"
                    isShowModal={isShowApiProcessModal}
                    modalTitle={apiProcessModalTitle}
                    onHide={this.hideApiProcessModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
