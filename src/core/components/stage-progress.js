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
      <div>
        <i className={classNames('far fa-check-circle',
          {'stage-progress-done': progressStatus === 'done'})}/>
        {`${title}...${progressPercentage}%`}
      </div>
    );
  }
};
