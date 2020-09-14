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
      confirmBtnTitle: PropTypes.string,
      // On submit/finish actions
      onConfirm: PropTypes.func,
      // Disable button when api is processing
      isConfirmDisable: PropTypes.bool,
      // For overriding default backdrop setting
      backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
      isLoading: PropTypes.bool,
      // For showing buttons at all
      isShowAllBtns: PropTypes.bool,
      // To show modalBody.length - 1 as a link
      isRedirectLink: PropTypes.bool
    };
  }

  static get defaultProps() {
    return {
      // Default is for processing modal only. All other modals should have a body message
      modalBody: _('Please wait'),
      modalType: 'default',
      confirmBtnTitle: _('Confirm'),
      onConfirm: null,
      isConfirmDisable: false,
      backdrop: true,
      isLoading: false,
      isShowAllBtns: true,
      isRedirectLink: false
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
      confirmBtnTitle,
      isConfirmDisable,
      backdrop,
      isLoading,
      isShowAllBtns,
      isRedirectLink
    } = this.props;
    return (
      <Modal
        // keyboard disallows usage of ESC key to close modal, this is tied with backdrop
        keyboard={backdrop !== 'static'}
        backdrop={backdrop}
        show={isShowModal}
        autoFocus={false}
        centered={modalType === 'process'}
        onHide={onHide}
      >
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h4" className={classNames({'modal-loading': isLoading})}>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {utils.isArray(modalBody) && isRedirectLink ? (
            modalBody.map((element, idx) => {
              const isLink = modalBody.length - 1;
              return typeof element === 'string' && isLink !== idx ? (
                <p key={String(idx)} className={classNames({'modal-loading': modalType === 'process'})}>
                  {element}
                </p>
              ) : typeof element === 'string' && isLink === idx ? (
                <a key={String(idx)} href={element} className={classNames({'modal-loading': modalType === 'process'})}>
                  {element}
                </a>
              ) : (
                <React.Fragment key={String(idx)}>
                  {element}
                </React.Fragment>
              );
            })
          ) : utils.isArray(modalBody) && !isRedirectLink ? (
            modalBody.map((element, idx) => {
              return typeof element === 'string' ? (
                <p key={String(idx)} className={classNames({'modal-loading': modalType === 'process'})}>
                  {element}
                </p>
              ) : (
                <React.Fragment key={String(idx)}>
                  {element}
                </React.Fragment>
              );
            })
          ) : (
            <p className={classNames({'modal-loading': modalType === 'process'})}>
              {modalBody}
            </p>
          )}
        </Modal.Body>
        {modalType !== 'process' && isShowAllBtns && (
          <Modal.Footer className="flex-column">
            <div className="form-group w-100 mx-0">
              <button
                disabled={isConfirmDisable}
                type="button"
                className="btn btn-primary btn-block rounded-pill"
                onClick={onConfirm}
              >
                {confirmBtnTitle}
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
