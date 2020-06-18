const classNames = require('classnames');
const {Link, getRouter} = require('capybara-router');
const PropTypes = require('prop-types');
const React = require('react');
const _ = require('../../../languages');
const Confidence = require('webserver-form-schema/constants/event-filters/confidence');
const EnrollStatus = require('webserver-form-schema/constants/event-filters/enroll-status');

module.exports = class EventsSidebar extends React.PureComponent {
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
      }).isRequired,
      type: PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.currentRoute = getRouter().findRouteByName('web.users.events');
  }

  /**
   * Convert router params to an array.
   * @param {Array<String>|String|null} param
   * @returns {Array<String>}
   */
  convertArrayParams = param => {
    let result = [];

    if (Array.isArray(param)) {
      result = [...param];
    } else if (param) {
      result = [param];
    }

    return result;
  };

  /**
   * Clean filter on user clicks.
   * @param {*} event
   * @returns {void}
   */
  onClickCleanFilters = event => {
    event.preventDefault();
    getRouter().go({
      name: this.currentRoute.name,
      params: {type: this.props.type}
    });
  };

  /**
   * Generate the handler to toggle filter.
   * @param {String} paramKey
   * @param {String} value
   * @returns {Function} The handler.
   */
  generateToggleFilterHandler = (paramKey, value) => () => {
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
    const {params} = this.props;
    const confidence = this.convertArrayParams(params.confidence);
    const enrollStatus = this.convertArrayParams(params.enrollStatus);

    return (
      <div className="card-body">
        <span>{_('Similarity')}</span>
        <div className="checkbox-group mt-3 pl-2">
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-low-similar"
              checked={confidence.indexOf(Confidence.low) >= 0}
              onChange={this.generateToggleFilterHandler('confidence', Confidence.low)}/>
            <label className="form-check-label" htmlFor="input-checkbox-low-similar">
              {_(`confidence-${Confidence.low}`)}
            </label>
          </div>
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-medium-similar"
              checked={confidence.indexOf(Confidence.medium) >= 0}
              onChange={this.generateToggleFilterHandler('confidence', Confidence.medium)}/>
            <label className="form-check-label" htmlFor="input-checkbox-medium-similar">
              {_(`confidence-${Confidence.medium}`)}
            </label>
          </div>
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-high-similar"
              checked={confidence.indexOf(Confidence.high) >= 0}
              onChange={this.generateToggleFilterHandler('confidence', Confidence.high)}/>
            <label className="form-check-label" htmlFor="input-checkbox-high-similar">
              {_(`confidence-${Confidence.high}`)}
            </label>
          </div>
        </div>

        <span>{_('Recognition Result')}</span>
        <div className="checkbox-group mt-3 mb-2 pl-2">
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="input-checkbox-register"
              checked={enrollStatus.indexOf(EnrollStatus.registered) >= 0}
              onChange={this.generateToggleFilterHandler('enrollStatus', EnrollStatus.registered)}/>
            <label className="form-check-label" htmlFor="input-checkbox-register">
              {_(`enroll-status-${EnrollStatus.registered}`)}
            </label>
          </div>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="input-checkbox-anonymous"
              checked={enrollStatus.indexOf(EnrollStatus.unknown) >= 0}
              onChange={this.generateToggleFilterHandler('enrollStatus', EnrollStatus.unknown)}/>
            <label className="form-check-label" htmlFor="input-checkbox-anonymous">
              {_(`enroll-status-${EnrollStatus.unknown}`)}
            </label>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {type,
      systemInformation: {isEnableFaceRecognition,
        isEnableAgeGender,
        isEnableHumanoidDetection}} = this.props;
    return (
      <div className="left-menu fixed-top sub shadow-sm">
        <h2>{_('Events')}</h2>
        <div className="filter-wrapper">
          <div className="header d-flex justify-content-between align-items-center  text-size-12">
            <span>{_('Filters')}</span>
            <a className="text-primary font-weight-bold" href="#" onClick={this.onClickCleanFilters}>{_('Clean')}</a>
          </div>

          <div className={classNames('card sub mb-3', {active: type === 'face-recognition' && isEnableFaceRecognition})}>
            <div className="card-header text-truncate">
              {
                isEnableFaceRecognition ?
                  <a className="text-decoration-none d-flex justify-content-between align-items-center">
                    <span>{_('Facial Recognition')}</span>
                    <i className="fas fa-chevron-up"/>
                  </a> :
                  <a className="text-decoration-none d-flex justify-content-between align-items-center">
                    <span>{_('Facial Recognition')}</span>
                    <span className="badge badge-danger badge-pill">{_('Inactivated')}</span> <i className="fas fa-chevron-down"/>
                  </a>
              }
            </div>
            {type === 'face-recognition' && isEnableFaceRecognition && this.faceRecognitionFilterRender()}
          </div>

          <div className={classNames('card sub mb-3 d-none', {active: type === 'age-gender' && isEnableAgeGender})}>
            <div className="card-header text-truncate">
              {
                isEnableAgeGender ?
                  <Link to={{name: this.currentRoute.name, params: {type: 'age-gender'}}}
                    className="text-decoration-none d-flex justify-content-between align-items-center"
                  >
                    <span>{_('Age Gender')}</span>
                    <i className="fas fa-chevron-down"/>
                  </Link> :
                  <a className="text-decoration-none d-flex justify-content-between align-items-center">
                    <span>{_('Age Gender')}</span>
                    <span className="badge badge-danger badge-pill">{_('Inactivated')}</span>
                    <i className="fas fa-chevron-down"/>
                  </a>
              }
            </div>
          </div>

          <div className={classNames('card sub mb-3 d-none', {active: type === 'humanoid-detection' && isEnableHumanoidDetection})}>
            <div className="card-header text-truncate">
              {
                isEnableHumanoidDetection ?
                  <Link to={{name: this.currentRoute.name, params: {type: 'humanoid-detection'}}}
                    className="text-decoration-none d-flex justify-content-between align-items-center"
                  >
                    <span>{_('Human Detection')}</span>
                    <i className="fas fa-chevron-down"/>
                  </Link> :
                  <a className="text-decoration-none d-flex justify-content-between align-items-center">
                    <span>{_('Human Detection')}</span>
                    <span className="badge badge-danger badge-pill">{_('Inactivated')}</span>
                    <i className="fas fa-chevron-down"/>
                  </a>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
};
