const PropTypes = require('prop-types');
const React = require('react');
const classNames = require('classnames');

module.exports = class StageProgress extends React.PureComponent {
  static get propTypes() {
    return {
      progressStatus: PropTypes.string.isRequired,
      progressPercentage: PropTypes.number.isRequired,
      title: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      title: 'progressing'
    };
  }

  render() {
    const {
      progressStatus,
      progressPercentage,
      title
    } = this.props;
    return (
      <div className="stage-progress">
        <div className="loading-spinners">
          <svg className={classNames('checkmark', {'d-none': progressStatus !== 'done'})} viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          <div className={classNames('loading-dots', {'d-none': progressStatus === 'done'})}>
            <div className="spinner"/>
          </div>
        </div>
        <span>{`${title} ... ${progressPercentage}%`}</span>
      </div>
    );
  }
};
