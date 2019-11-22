const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const {Link, getRouter} = require('capybara-router');
const Confidence = require('webserver-form-schema/constants/event-filters/confidence');
const EnrollStatus = require('webserver-form-schema/constants/event-filters/enroll-status');
const _ = require('../../../languages');
const Base = require('../shared/base');

module.exports = class Events extends Base {
  static get propTypes() {
    return {
      params: PropTypes.shape({
        type: PropTypes.oneOf(['face-recognition', 'age-gender', 'humanoid-detection']),
        confidence: PropTypes.oneOfType([
          PropTypes.oneOf(Confidence.all()),
          PropTypes.arrayOf(PropTypes.oneOf(Confidence.all()))
        ]),
        enrollStatus: PropTypes.oneOfType([
          PropTypes.oneOf(EnrollStatus.all()),
          PropTypes.arrayOf(PropTypes.oneOf(EnrollStatus.all()))
        ])
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
    this.currentRoute = getRouter().findRouteByName('web.events');
    this.state.type = props.params.type || 'face-recognition';
  }

  convertArrayParams = param => {
    /*
    @param param {Array<String>|String|null}
    @returns {Array<String>}
     */
    let result = [];

    if (Array.isArray(param)) {
      result = [...param];
    } else if (param) {
      result = [param];
    }

    return result;
  };

  onClickCleanFilters = event => {
    event.preventDefault();
    getRouter().go({
      name: this.currentRoute.name,
      params: {type: this.state.type}
    });
  };

  generateToggleFilterHandler = (paramKey, value) => () => {
    /*
    @param paramKey {String}
    @param value {String}
     */
    const params = this.convertArrayParams(this.props.params[paramKey]);
    const indexOfConfidences = params.indexOf(value);

    if (indexOfConfidences >= 0) {
      params.splice(indexOfConfidences, 1);
    } else {
      params.push(value);
    }

    getRouter().go({
      name: this.currentRoute.name,
      params: {
        ...this.props.params,
        index: undefined,
        [paramKey]: params
      }
    });
  };

  faceRecognitionFilterRender = () => {
    const confidence = this.convertArrayParams(this.props.params.confidence);
    const enrollStatus = this.convertArrayParams(this.props.params.enrollStatus);

    return (
      <div className="card-body">
        <span>{_('Similarity')}</span>
        <div className="checkbox-group mt-3 pl-2">
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-low-similar"
              checked={confidence.indexOf(Confidence.low) >= 0}
              onChange={this.generateToggleFilterHandler('confidence', Confidence.low)}/>
            <label className="form-check-label" htmlFor="input-checkbox-low-similar">{_('Low')}</label>
          </div>
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-medium-similar"
              checked={confidence.indexOf(Confidence.medium) >= 0}
              onChange={this.generateToggleFilterHandler('confidence', Confidence.medium)}/>
            <label className="form-check-label" htmlFor="input-checkbox-medium-similar">{_('Medium')}</label>
          </div>
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-high-similar"
              checked={confidence.indexOf(Confidence.high) >= 0}
              onChange={this.generateToggleFilterHandler('confidence', Confidence.high)}/>
            <label className="form-check-label" htmlFor="input-checkbox-high-similar">{_('High')}</label>
          </div>
        </div>

        <span>{_('Recognition result')}</span>
        <div className="checkbox-group mt-3 mb-2 pl-2">
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-register"
              checked={enrollStatus.indexOf(EnrollStatus.registered) >= 0}
              onChange={this.generateToggleFilterHandler('enrollStatus', EnrollStatus.registered)}/>
            <label className="form-check-label" htmlFor="input-checkbox-register">{_('Registered')}</label>
          </div>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="input-checkbox-anonymous"
              checked={enrollStatus.indexOf(EnrollStatus.unknown) >= 0}
              onChange={this.generateToggleFilterHandler('enrollStatus', EnrollStatus.unknown)}/>
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
            <a className="text-size-14" href="#" onClick={this.onClickCleanFilters}>{_('Clean')}</a>
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
