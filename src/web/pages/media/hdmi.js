const React = require('react');
const progress = require('nprogress');
const PropTypes = require('prop-types');
const {Formik, Form} = require('formik');
const {getRouter} = require('@benson.liao/capybara-router');
const Base = require('../shared/base');
const HDMISettingsSchema = require('webserver-form-schema/hdmi-settings-schema');
const SensorResolution = require('webserver-form-schema/constants/sensor-resolution');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const i18n = require('../../../i18n').default;
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
      }).isRequired,
      systemInformation: PropTypes.shape({sensorResolution: PropTypes.number.isRequired}).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.isShowModal = false;
    this.state.isShowApiProcessModal = false;
    this.state.apiProcessModalTitle = i18n.t('Updating HDMI settings');
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
        .filter(x => Number(x) <= 8 &&
                     Number(x) !== 4 &&
                     // Remove 4K option if detected sensor is 2K
                     !(`${this.props.systemInformation.sensorResolution}` === SensorResolution['2K'] &&
                        (Number(x) === 0 || Number(x) === 5 || Number(x) === 6)
                     )
        )
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
                path={[i18n.t('video.breadcrumb.videoSettings'), i18n.t('video.breadcrumb.hdmi')]}
                routes={['/media/stream']}
              />
              <div className="col-center">
                <div className="card shadow">
                  <div className="card-header">
                    {i18n.t('HDMI Title')}
                  </div>
                  <Formik
                    initialValues={hdmiSettings}
                    onSubmit={this.onSubmit}
                  >
                    {({values}) => (
                      <Form className="card-body">
                        <SelectField
                          readOnly
                          labelName={i18n.t('Resolution')}
                          name="resolution"
                        >
                          <option value={this.resolution[2].value}>{this.resolution[2].label}</option>
                          ))
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
                          {i18n.t('common.button.apply')}
                        </button>
                        <CustomNotifyModal
                          isShowModal={isShowModal}
                          modalTitle={i18n.t('HDMI')}
                          modalBody={i18n.t('Are you sure you want to update HDMI settings?')}
                          isConfirmDisable={$isApiProcessing}
                          onHide={this.hideModal}
                          onConfirm={() => {
                            this.onSubmitHDMISettingsForm({
                              ...values,
                              resolution: this.resolution[2].value
                            });
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
