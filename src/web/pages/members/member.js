const PropTypes = require('prop-types');
const React = require('react');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const defaultAvatar = require('webserver-prototype/src/resource/default-avatar@2x.png');
const avatarMask = require('webserver-prototype/src/resource/avatar-mask.png');
const avatarMask2x = require('webserver-prototype/src/resource/avatar-mask@2x.png');
const Base = require('../shared/base');
const Slider = require('../../../core/components/fields/slider');
const _ = require('../../../languages');

module.exports = class Member extends Base {
  static get propTypes() {
    return {
      parentRouteName: PropTypes.string.isRequired
    };
  }

  constructor(props) {
    super(props);
    const router = getRouter();

    this.state.isShowModal = true;
    this.$listens.push(
      router.listen('ChangeSuccess', (action, toState) => {
        const isShowModal = [
          'web.members.new-member',
          'web.members.details'
        ].indexOf(toState.name) >= 0;
        this.setState({isShowModal});
      })
    );
  }

  hideModal = () => {
    const router = getRouter();
    router.go({
      name: this.props.parentRouteName,
      params: this.props.params
    });
  };

  onSubmitForm(values) {
    console.log(values);
  }

  formRender() {
    return (
      <Form>
        <div className="modal-body">
          <div className="avatar-uploader">
            <label className="avatar-wrapper">
              <div className="avatar-img" style={{'background-image': `url('${defaultAvatar}')`}}/>
              <img className="avatar-mask" src={avatarMask} srcSet={`${avatarMask2x} 2x`}/>
              <input type="file" className="d-none" accept=".jpg,.png"/>
            </label>
            <p className="text-center text-muted text-size-14 mb-1">
              {_('Please upload your face photo.')}
            </p>
            <div className="d-flex justify-content-center align-items-center">
              <button className="btn btn-link text-muted" type="button">
                <i className="fas fa-undo fa-fw"/>
              </button>
              <button className="btn btn-link text-muted" type="button">
                <i className="fas fa-redo fa-fw"/>
              </button>
              <i className="far fa-image fa-fw fa-sm ml-3"/>
              <div className="form-group mb-0 ml-2">
                <div className="none-selection">
                  <Field name="zoom" component={Slider} step={10}
                    min={0}
                    max={100}/>
                </div>
              </div>
              <i className="far fa-image fa-fw fa-lg ml-2"/>
            </div>
          </div>
          <div className="form-group">
            <label>{_('Name')}</label>
            <Field name="name" className="form-control" type="text" placeholder={_('Please enter your name.')}/>
          </div>
          <div className="form-group">
            <label>{_('Organization')}</label>
            <input className="form-control" type="text" placeholder={_('Please enter the organization.')}/>
            <small className="form-text text-muted">{_('Letters within 32 characters.')}</small>
          </div>
          <div className="form-group">
            <label>{_('Group')}</label>
            <div className="select-wrapper border rounded-pill overflow-hidden px-2">
              <select className="form-control border-0">
                <option value="">{_('None')}</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>{_('Note')}</label>
            <input className="form-control" type="text" placeholder={_('Please enter your note.')}/>
          </div>
        </div>
        <div className="modal-footer flex-column">
          <div className="form-group w-100 mx-0">
            <button type="submit" className="btn btn-primary btn-block rounded-pill">
              {_('New')}
            </button>
          </div>
          <button className="btn btn-secondary btn-block m-0 rounded-pill"
            type="button" onClick={this.hideModal}
          >
            {_('Close')}
          </button>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <Modal autoFocus={false} show={this.state.isShowModal} onHide={this.hideModal}>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h5">{_('New member')}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{name: '', zoom: 50}}
          render={this.formRender}
          onSubmit={this.onSubmitForm}/>
      </Modal>
    );
  }
};
