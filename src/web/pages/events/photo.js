const PropTypes = require('prop-types');
const React = require('react');
const {getRouter} = require('capybara-router');
const Base = require('../shared/base');
const SearchMember = require('../../../core/components/search-member');

module.exports = class Member extends Base {
  static get propTypes() {
    return {member: PropTypes.shape({})};
  }

  constructor(props) {
    super(props);

    this.state.isShowModal = true;
    this.$listens.push(
      getRouter().listen('ChangeStart', (action, toState) => {
        const isShowModal = [
          'web.users.events.photo'
        ].indexOf(toState.name) >= 0;
        this.setState({isShowModal});
      })
    );
  }

  onHideModal = () => {
    getRouter().go({
      name: 'web.users.events',
      params: this.props.params
    });
  };

  render() {
    const {member} = this.props;
    const {$isApiProcessing, isShowModal} = this.state;
    console.log('inside photo');
    return (
      <SearchMember
        isApiProcessing={$isApiProcessing}
        member={member}
        onhide={this.onHideModal}
        isShowModal={isShowModal}
      />
    );
  }
};
