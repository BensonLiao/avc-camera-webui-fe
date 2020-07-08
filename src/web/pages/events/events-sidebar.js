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
      type: PropTypes.string.isRequired,
      currentRouteName: PropTypes.string.isRequired,
      isApiProcessing: PropTypes.bool.isRequired
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
   * Clear filter on user clicks.
   * @param {*} event
   * @returns {void}
   */
  onClickClearFilters = event => {
    event.preventDefault();
    getRouter().go({
      name: this.props.currentRouteName,
      params: {type: this.props.type}
    });
  };

  /**
   * Generate the handler to toggle filter.
   * @param {String} paramKey
   * @param {String} value
   * @returns {Function} The handler.
   */
  toggleFilterHandler = (paramKey, value) => () => {
    const params = this.convertArrayParams(this.props.params[paramKey]);
    const indexOfConfidences = params.indexOf(value);

    if (indexOfConfidences >= 0) {
      params.splice(indexOfConfidences, 1);
    } else {
      params.push(value);
    }

    getRouter().go({
      name: this.props.currentRouteName,
      params: {
        ...this.props.params,
        index: undefined,
        [paramKey]: params
      }
    });
  };

  faceRecognitionFilterRender = () => {
    const {params, isApiProcessing} = this.props;
    const confidence = this.convertArrayParams(params.confidence);
    const enrollStatus = this.convertArrayParams(params.enrollStatus);
    const similarityRender = [
      {confidence: Confidence.low, id: 'input-checkbox-low-similar'},
      {confidence: Confidence.medium, id: 'input-checkbox-medium-similar'},
      {confidence: Confidence.high, id: 'input-checkbox-high-similar'}
    ];
    const resultRender = [
      {status: EnrollStatus.registered, id: 'input-checkbox-register'},
      {status: EnrollStatus.unknown, id: 'input-checkbox-anonymous'}
    ];
    return (
      <div className="card-body">
        <span>{_('Similarity')}</span>
        <div className="checkbox-group mt-3 pl-2">
          {similarityRender.map(item => (
            <div key={item.id} className="form-check mb-3">
              <input type="checkbox" className="form-check-input" id={item.id}
                disabled={isApiProcessing}
                checked={confidence.indexOf(item.confidence) >= 0}
                onChange={this.toggleFilterHandler('confidence', item.confidence)}/>
              <label className="form-check-label" htmlFor={item.id}>
                {_(`confidence-${item.confidence}`)}
              </label>
            </div>
          ))}
        </div>
        <span>{_('Recognition Result')}</span>
        <div className="checkbox-group mt-3 mb-2 pl-2">
          {resultRender.map(item => (
            <div key={item.id} className={classNames('form-check', {'mb-3': item.status === '1'})}>
              <input type="checkbox" className="form-check-input" id={item.id}
                disabled={isApiProcessing}
                checked={enrollStatus.indexOf(item.status) >= 0}
                onChange={this.toggleFilterHandler('enrollStatus', item.status)}/>
              <label className="form-check-label" htmlFor={item.id}>
                {_(`enroll-status-${item.status}`)}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  render() {
    const {
      systemInformation: {isEnableFaceRecognition, isEnableAgeGender, isEnableHumanoidDetection},
      type,
      currentRouteName
    } = this.props;
    return (
      <div className="left-menu fixed-top sub shadow-sm">
        <h2>{_('Events')}</h2>
        <div className="filter-wrapper">
          <div className="header d-flex justify-content-between align-items-center  text-size-12">
            <span>{_('Filters')}</span>
            <a className="text-primary font-weight-bold" href="#" onClick={this.onClickClearFilters}>{_('Clear')}</a>
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
                  <Link to={{name: currentRouteName, params: {type: 'age-gender'}}}
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
                  <Link to={{name: currentRouteName, params: {type: 'humanoid-detection'}}}
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
