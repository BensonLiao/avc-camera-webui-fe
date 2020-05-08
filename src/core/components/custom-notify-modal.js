const PropTypes = require('prop-types');
const React = require('react');
const Modal = require('react-bootstrap/Modal').default;
const _ = require('../../languages');
const utils = require('../../core/utils');
const classNames = require('classnames');

module.exports = class CustomNotifyModal extends React.PureComponent {
  static get propTypes() {
    return {
      isShowModal: PropTypes.bool.isRequired,
      onHide: PropTypes.func.isRequired,
      modalTitle: PropTypes.string.isRequired,
      modalBody: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
      // Specify modal type, with different backdrop setting, buttons layout.
      modalType: PropTypes.oneOf(['default', 'info', 'process']),
      // On submit/finish actions
      onConfirm: PropTypes.func,
      // Disable button when api is processing
      isConfirmDisable: PropTypes.bool,
      // For overriding default backdrop setting
      backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
    };
  }

  static get defaultProps() {
    return {
      // Default is for processing modal only. All other modals should have a body message
      modalBody: _('Please wait'),
      modalType: 'default',
      onConfirm: null,
      isConfirmDisable: false,
      backdrop: true
    };
  }

  render() {
    const {
      isShowModal,
      onHide,
      onConfirm,
      modalTitle,
      modalBody,
      modalType,
      isConfirmDisable,
      backdrop
    } = this.props;
    return (
      <Modal
        backdrop={modalType === 'process' ? 'static' : backdrop}
        show={isShowModal}
        autoFocus={false}
        centered={modalType === 'process'}
        onHide={onHide}
      >
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h4">{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {utils.isArray(modalBody) ? (
            modalBody.map((element, idx) => {
              return (
                <p key={String(idx)} className={classNames({'modal-loading': modalType === 'process'})}>
                  {element}
                </p>
              );
            })
          ) : (
            <p className={classNames({'modal-loading': modalType === 'process'})}>
              {modalBody}
            </p>
          )}
        </Modal.Body>
        {modalType !== 'process' && (
          <Modal.Footer className="flex-column">
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
            {modalType !== 'info' && (
              <button
                type="button"
                className="btn btn-info btn-block rounded-pill"
                onClick={onHide}
              >
                {_('Cancel')}
              </button>
            )}
          </Modal.Footer>
        )}
      </Modal>
    );
  }
};
