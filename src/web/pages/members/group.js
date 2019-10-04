const React = require('react');
const Modal = require('react-bootstrap/Modal').default;
const {getRouter} = require('capybara-router');
const _ = require('../../../languages');

module.exports = class Group extends React.PureComponent {
  state = {
    isShowModal: true
  };

  hideModal = () => {
    this.setState({isShowModal: false});
  };

  hiddenModal() {
    const router = getRouter();
    router.go({
      name: 'web.members',
      params: router.currentParams
    });
  }

  render() {
    return (
      <Modal
        show={this.state.isShowModal}
        autoFocus={false}
        onHide={this.hideModal}
        onExited={this.hiddenModal}
      >
        <Modal.Header>
          <Modal.Title as="h5">{_('Create a group')}</Modal.Title>
        </Modal.Header>
      </Modal>
    );
  }
};
