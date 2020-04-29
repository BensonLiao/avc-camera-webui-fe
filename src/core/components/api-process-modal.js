const PropTypes = require('prop-types');
const React = require('react');
const Modal = require('react-bootstrap/Modal').default;
const _ = require('../../languages');

module.exports = class ApiProcessModal extends React.PureComponent {
  static get propTypes() {
    return {
      isShowModal: PropTypes.bool.isRequired,
      onHide: PropTypes.func.isRequired,
      modalTitle: PropTypes.string
    };
  }

  static get defaultProps() {
    return {modalTitle: 'Server processing, please wait...'};
  }

  render() {
    const {isShowModal, onHide, modalTitle} = this.props;

    return (
      <Modal backdrop="static" autoFocus={false} show={isShowModal} onHide={onHide}>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h5">{_(modalTitle)}</Modal.Title>
        </Modal.Header>
      </Modal>
    );
  }
};
