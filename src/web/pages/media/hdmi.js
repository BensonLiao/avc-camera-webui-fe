const React = require('react');
const progress = require('nprogress');
const PropTypes = require('prop-types');
const {Formik, Form} = require('formik');
const {getRouter} = require('capybara-router');
const Base = require('../shared/base');
const HDMISettingsSchema = require('webserver-form-schema/hdmi-settings-schema');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const i18n = require('../../i18n').default;
const api = require('../../../core/apis/web-api');
const CustomNotifyModal = require('../../../core/components/custom-notify-modal');
const SelectField = require('../../../core/components/fields/select-field');
const BreadCrumb = require('../../../core/components/fields/breadcrumb').default;

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
    this.state.apiProcessModalTitle = i18n.t('Updating hdmi settings');
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
          label: i18n.t(`stream-resolution-${x}`),
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
              <BreadCrumb
                className="px-0"
                path={[i18n.t('Video'), i18n.t('HDMI')]}
                routes={['/media/stream']}
              />
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">
                    {i18n.t('HDMI')}
                  </div>
                  <Formik
                    initialValues={hdmiSettings}
                    onSubmit={this.onSubmit}
                  >
                    {({values}) => (
                      <Form className="card-body">
                        {/* <div className="form-group d-flex justify-content-between align-items-center">
                          <label className="mb-0">{i18n.t('On/Off')}</label>
                          <div className="custom-control custom-switch">
                            <Field
                              name="isEnableHDMI"
                              type="checkbox"
                              className="custom-control-input"
                              id="switch-hdmi"
                            />
                            <label className="custom-control-label" htmlFor="switch-hdmi">
                              <span>{i18n.t('ON')}</span>
                              <span>{i18n.t('OFF')}</span>
                            </label>
                          </div>
                        </div> */}
                        <SelectField
                          labelName={i18n.t('Resolution')}
                          name="resolution"
                        >
                          {this.resolution.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </SelectField>
                        <SelectField labelName={i18n.t('Frame Rate (FPS)')} name="frameRate">
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
                          {i18n.t('Apply')}
                        </button>
                        <CustomNotifyModal
                          isShowModal={isShowModal}
                          modalTitle={i18n.t('HDMI Settings')}
                          modalBody={i18n.t('Are you sure you want to update hdmi settings?')}
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
