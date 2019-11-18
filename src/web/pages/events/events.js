const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {Link} = require('capybara-router');
const _ = require('../../../languages');
const Base = require('../shared/base');

module.exports = class Events extends Base {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        type: PropTypes.oneOf(['face-recognition', 'age-gender', 'humanoid-detection'])
      }).isRequired,
      systemInformation: PropTypes.shape({
        isEnableFaceRecognition: PropTypes.bool.isRequired,
        isEnableAgeGender: PropTypes.bool.isRequired,
        isEnableHumanoidDetection: PropTypes.bool.isRequired
      }).isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state.type = props.params.type || 'face-recognition';
  }

  faceRecognitionFilterRender = () => {
    return (
      <div className="card-body">
        <span>{_('Similarity')}</span>
        <div className="checkbox-group mt-3 pl-2">
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-low-similar"/>
            <label className="form-check-label" htmlFor="input-checkbox-low-similar">{_('Low')}</label>
          </div>
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-medium-similar"/>
            <label className="form-check-label" htmlFor="input-checkbox-medium-similar">{_('Medium')}</label>
          </div>
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-high-similar"/>
            <label className="form-check-label" htmlFor="input-checkbox-high-similar">{_('High')}</label>
          </div>
        </div>

        <span>{_('Recognition result')}</span>
        <div className="checkbox-group mt-3 mb-2 pl-2">
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-register"/>
            <label className="form-check-label" htmlFor="input-checkbox-register">{_('Registered')}</label>
          </div>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="input-checkbox-anonymous"/>
            <label className="form-check-label" htmlFor="input-checkbox-anonymous">{_('Unknown')}</label>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      isEnableFaceRecognition,
      isEnableAgeGender,
      isEnableHumanoidDetection
    } = this.props.systemInformation;

    return (
      <div className="left-menu fixed-top">
        <h2>{_('Smart search')}</h2>
        <div className="filter-wrapper">
          <div className="header d-flex justify-content-between align-items-center">
            <span>{_('Filter condition')}</span>
            <a className="text-size-14" href="#">{_('Clean')}</a>
          </div>

          <div className={classNames('card mb-3', {active: this.state.type === 'face-recognition' && isEnableFaceRecognition})}>
            <div className="card-header text-truncate">
              {
                isEnableFaceRecognition ?
                  <Link to={{name: 'web.events', params: {}}}
                    className="text-decoration-none d-flex justify-content-between align-items-center"
                  >
                    <span>{_('Face recognition')}</span> <i className="fas fa-chevron-up"/>
                  </Link> :
                  <a className="text-decoration-none d-flex justify-content-between align-items-center">
                    <span>{_('Face recognition')} <span className="badge badge-danger badge-pill">{_('Not activated')}</span></span> <i className="fas fa-chevron-down"/>
                  </a>
              }
            </div>
            {this.state.type === 'face-recognition' && isEnableFaceRecognition && this.faceRecognitionFilterRender()}
          </div>

          <div className={classNames('card mb-3', {active: this.state.type === 'age-gender' && isEnableAgeGender})}>
            <div className="card-header text-truncate">
              {
                isEnableAgeGender ?
                  <Link to={{name: 'web.events', params: {type: 'age-gender'}}}
                    className="text-decoration-none d-flex justify-content-between align-items-center"
                  >
                    <span>{_('Age gender')}</span> <i className="fas fa-chevron-down"/>
                  </Link> :
                  <a className="text-decoration-none d-flex justify-content-between align-items-center">
                    <span>{_('Age gender')} <span className="badge badge-danger badge-pill">{_('Not activated')}</span></span> <i className="fas fa-chevron-down"/>
                  </a>
              }
            </div>
          </div>

          <div className={classNames('card mb-3', {active: this.state.type === 'humanoid-detection' && isEnableHumanoidDetection})}>
            <div className="card-header text-truncate">
              {
                isEnableHumanoidDetection ?
                  <Link to={{name: 'web.events', params: {type: 'humanoid-detection'}}}
                    className="text-decoration-none d-flex justify-content-between align-items-center"
                  >
                    <span>{_('Humanoid detection')}</span> <i className="fas fa-chevron-down"/>
                  </Link> :
                  <a className="text-decoration-none d-flex justify-content-between align-items-center">
                    <span>{_('Humanoid detection')} <span className="badge badge-danger badge-pill">{_('Not activated')}</span></span> <i className="fas fa-chevron-down"/>
                  </a>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
};
