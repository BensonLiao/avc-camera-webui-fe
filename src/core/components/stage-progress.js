const PropTypes = require('prop-types');
const React = require('react');
const classNames = require('classnames');

module.exports = class StageProgress extends React.PureComponent {
  static get propTypes() {
    return {
      progressStatus: PropTypes.string.isRequired,
      progressPercentage: PropTypes.number,
      stage: PropTypes.string.isRequired,
      title: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      title: 'progressing',
      progressPercentage: -1
    };
  }

  render() {
    const {
      progressStatus,
      progressPercentage,
      title,
      stage
    } = this.props;
    return (
      <div className={classNames('stage-progress', {draw: progressStatus === 'done'})}>
        <div className="rounded-border-container">
          <div className="loading-spinners">
            <svg className={classNames('checkmark', {show: progressStatus === 'done'})} viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <svg className={classNames('crossmark', {show: progressStatus === 'fail'})} viewBox="0 0 52 52">
              <circle className="crossmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="crossmark-cross" fill="none" d="M16 16 36 36 M36 16 16 36"/>
            </svg>
            <div className={classNames('loading-dots', {'hide-loading': progressPercentage === 0 || progressStatus !== 'start'})}>
              {progressPercentage === -1 ? (
                <div className="spinner">
                  <div className="double-bounce1"/>
                  <div className="double-bounce2"/>
                </div>
              ) : (
                <div className={`pie-wrapper pie-wrapper--solid progress-${progressPercentage}`}/>
              )}
            </div>
          </div>
          <div className="stage">{stage}</div>
          <div className={classNames('divider', {draw: progressStatus === 'done'})}/>
          <div className="progress-title">{title}</div>
        </div>
      </div>
    );
  }
};
