const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const {Formik, Form, Field} = require('formik');
const Modal = require('react-bootstrap/Modal').default;
// const SimpleCrypto = require('simple-crypto-js').default;
const api = require('../../core/apis/web-api');
const Password = require('../../core/components/fields/password');
// const simpleCrypto = new SimpleCrypto(SimpleCrypto.generateRandom);

module.exports = class ADBConfig extends React.PureComponent {
  static get propTypes() {
    return {params: PropTypes.shape({enable: PropTypes.oneOf(['on', 'off'])})};
  }

  static get defaultProps() {
    return {params: {}};
  }

  state = {
    isShowModal: true,
    isEnable: null,
    isPersist: null,
    port: null
  }

  hideModal = () => {
    this.setState({isShowModal: false});
  };

  onSubmitForm = values => {
    const {params} = this.props;
    // if (values.rootPassword !== simpleCrypto.decrypt(window.rootPassword)) {
    //   return;
    // }

    if (params.enable) {
      api.system.updateADBConfig({
        isEnable: params.enable === 'on' || false,
        isPersist: true,
        port: 5555
      }).then(response => {
        this.setState(prevState => ({
          ...prevState,
          ...response.data
        }), () => {
          this.hideModal();
        });
      });
    } else {
      api.system.getADBConfig()
        .then(response => {
          this.setState(prevState => ({
            ...prevState,
            ...response.data
          }), () => {
            this.hideModal();
          });
        });
    }
  }

  formRender = () => {
    return (
      <Form>
        <Modal.Body>
          <div className="form-group has-feedback">
            <label>Password</label>
            <Field
              name="rootPassword"
              component={Password}
              inputProps={{
                className: 'form-control',
                placeholder: 'Enter password to view/update config'
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex-column">
          <div className="form-group w-100 mx-0">
            <button type="submit" className="btn btn-primary btn-block rounded-pill">
              Confirm
            </button>
          </div>
        </Modal.Footer>
      </Form>
    );
  };

  render() {
    const {isEnable, isPersist, port} = this.state;
    return ReactDOM.createPortal(
      <>
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem'
        }}
        >
          <div>{`is enable: ${isEnable}`}</div>
          <div>{`is persist: ${isPersist}`}</div>
          <div>{`port: ${port}`}</div>
        </div>
        <Modal
          backdrop="static"
          show={this.state.isShowModal}
          onHide={this.hideModal}
        >
          <Modal.Header className="d-flex justify-content-between align-items-center">
            <Modal.Title as="h5">ADB Config</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{rootPassword: ''}}
            onSubmit={this.onSubmitForm}
          >
            {this.formRender}
          </Formik>
        </Modal>
      </>
      ,
      document.body
    );
  }
};
