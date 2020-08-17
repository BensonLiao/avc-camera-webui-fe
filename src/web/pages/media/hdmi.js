// const classNames = require('classnames');
// const PropTypes = require('prop-types');
const React = require('react');
// const progress = require('nprogress');
const {Formik, Form} = require('formik');
const {Link} = require('capybara-router');
const Base = require('../shared/base');
const HDMISettingsSchema = require('webserver-form-schema/hdmi-settings-schema');
const StreamResolution = require('webserver-form-schema/constants/stream-resolution');
const _ = require('../../../languages');
// const api = require('../../../core/apis/web-api');
const SelectField = require('../../../core/components/fields/select-field');

module.exports = class HDMI extends Base {
//   static get propTypes() {
//     return {
//       hdmiSettings: PropTypes.shape({
//         resolution: PropTypes.string.isRequired,
//         frameRate: PropTypes.string.isRequired
//       }).isRequired
//     };
//   }

  constructor(props) {
    super(props);
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
      StreamResolution.all().filter(x => Number(x) <= 8 && Number(x) !== 4).map(x => ({
        label: _(`stream-resolution-${x}`),
        value: x
      }));
  }

  hdmiSettingsFormRender = () => {
    return (
      <>
        <Form className="card-body">

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
          <button disabled={this.state.$isApiProcessing} type="submit" className="btn btn-block btn-primary rounded-pill mt-5">
            {_('Apply')}
          </button>
        </Form>

      </>
    );
  }

  render() {
    const {hdmiSettings} = this.props;

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
                    onSubmit={this.onSubmitHDMISettingsForm}
                  >
                    {this.hdmiSettingsFormRender}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
