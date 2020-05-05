const PropTypes = require('prop-types');
const React = require('react');
const Modal = require('react-bootstrap/Modal').default;
const _ = require('../../languages');

module.exports = class ConfirmModal extends React.PureComponent {
  static get propTypes() {
    return {
      isShowModal: PropTypes.bool.isRequired,
      onHide: PropTypes.func.isRequired,
      onConfirm: PropTypes.func.isRequired,
      modalTitle: PropTypes.string,
      modalBody: PropTypes.string,
      isConfirmDisable: PropTypes.bool
    };
  }

  static get defaultProps() {
    return {
      modalTitle: 'Confirm',
      modalBody: 'Please confirm your action',
      isConfirmDisable: false
    };
  }

  render() {
    const {
      isShowModal,
      onHide,
      onConfirm,
      modalTitle,
      modalBody,
      isConfirmDisable
    } = this.props;
    return (
      <Modal
        show={isShowModal}
        autoFocus={false}
        onHide={onHide}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{_(modalTitle)}</h4>
          </div>
          <div className="modal-body">
            <p>{_(modalBody)}</p>
          </div>
          <div className="modal-footer flex-column">
            <div className="form-group w-100 mx-0">
              <button
                disabled={isConfirmDisable}
                type="button"
                className="btn btn-primary btn-block rounded-pill"
                onClick={onConfirm}
              >
                {_('Confirm')}
              </button>
            </div>
            <button
              type="button"
              className="btn btn-info btn-block rounded-pill"
              onClick={onHide}
            >
              {_('Cancel')}
            </button>
          </div>
        </div>
      </Modal>
    );
  }
};
