const PropTypes = require('prop-types');
const React = require('react');
const {getRouter} = require('capybara-router');
const Base = require('../shared/base');
const MemberModal = require('../../../core/components/member-modal');

module.exports = class Member extends Base {
  static get propTypes() {
    return {
      params: PropTypes.object.isRequired,
      groups: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          note: PropTypes.string
        }).isRequired).isRequired
      }),
      member: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        organization: PropTypes.string,
        groupId: PropTypes.string,
        note: PropTypes.string,
        pictures: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
      })
    };
  }

  constructor(props) {
    super(props);

    this.state.isShowModal = true;
    this.$listens.push(
      getRouter().listen('ChangeStart', (action, toState) => {
        const isShowModal = [
          'web.users.members.new-member',
          'web.users.members.details'
        ].indexOf(toState.name) >= 0;
        this.setState({isShowModal});
      })
    );
  }

  onSubmittedMemberForm = () => {
    if (this.props.member) {
      // Updated the member.
      getRouter().go({
        name: 'web.users.members',
        params: this.props.params
      }, {reload: true});
    } else {
      // Created a new member.
      getRouter().go({
        name: 'web.users.members',
        params: {}
      }, {reload: true});
    }
  };

  onHideModal = () => {
    getRouter().go({
      name: 'web.users.members',
      params: this.props.params
    });
  };

  render() {
    const {groups, member} = this.props;
    const {$isApiProcessing} = this.state;

    return (
      <MemberModal
        isApiProcessing={$isApiProcessing}
        isShowModal={this.state.isShowModal}
        groups={groups}
        member={member}
        onHide={this.onHideModal}
        onSubmitted={this.onSubmittedMemberForm}
      />
    );
  }
};
