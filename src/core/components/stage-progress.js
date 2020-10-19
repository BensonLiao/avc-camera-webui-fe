const PropTypes = require('prop-types');
const React = require('react');
const classNames = require('classnames');
const LoadingIndicator = require('../components/loading-indicator').default;

module.exports = class StageProgress extends React.PureComponent {
  static get propTypes() {
    return {
      progressStatus: PropTypes.string.isRequired,
      progressPercentage: PropTypes.number,
      stage: PropTypes.string,
      title: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      title: 'progressing',
      stage: '',
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
          <LoadingIndicator
            isDetermined={progressPercentage !== -1}
            percentage={progressPercentage}
            status={progressStatus}
          />
          <div className="stage">{stage}</div>
          <div className={classNames('divider', {draw: progressStatus === 'done'})}/>
          <div className="progress-title">{title}</div>
        </div>
      </div>
    );
  }
};
