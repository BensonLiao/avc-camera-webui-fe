const classNames = require('classnames');
const progress = require('nprogress');
const PropTypes = require('prop-types');
const React = require('react');
const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const Modal = require('react-bootstrap/Modal').default;
const defaultAvatar = require('webserver-prototype/src/resource/default-avatar@2x.png');
const avatarMask = require('webserver-prototype/src/resource/avatar-mask.png');
const avatarMask2x = require('webserver-prototype/src/resource/avatar-mask@2x.png');
const MemberSchema = require('webserver-form-schema/member-schema');
const Base = require('../shared/base');
const Slider = require('../../../core/components/fields/slider');
const _ = require('../../../languages');
const MemberValidator = require('../../validations/members/member-validator');
const utils = require('../../../core/utils');
const api = require('../../../core/apis/web-api');

module.exports = class Member extends Base {
  static get propTypes() {
    return {
      parentRouteName: PropTypes.string.isRequired,
      groups: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          note: PropTypes.string
        }).isRequired).isRequired
      }),
      member: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        pictures: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
      })
    };
  }

  constructor(props) {
    super(props);
    const router = getRouter();

    this.avatarWrapperRef = React.createRef();
    this.avatarFile = null;
    this.state.isShowModal = true;
    this.state.avatarPreviewUrl = null;
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

  onChangeAvatar = event => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    this.avatarFile = file;
    if (this.state.avatarPreviewUrl) {
      window.URL.revokeObjectURL(this.state.avatarPreviewUrl);
    }

    this.setState({avatarPreviewUrl: window.URL.createObjectURL(this.avatarFile)});
  };

  onSubmitForm = values => {
    const data = {...values};

    progress.start();
    if (this.avatarFile) {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const size = 400;
      const offset = {x: 0, y: 0};
      let rate;

      img.src = this.state.avatarPreviewUrl;
      rate = img.height / img.width;
      if (img.width < img.height) {
        img.width = size;
        img.height = Math.round(img.width * rate);
      } else {
        img.height = size;
        img.width = Math.round(img.height / rate);
      }

      img.width = Math.round(img.width * values.zoom * 0.01);
      img.height = Math.round(img.height * values.zoom * 0.01);
      offset.x = -Math.round((img.width - size) / 2);
      offset.y = -Math.round((img.height - size) / 2);

      canvas.width = size;
      canvas.height = size;
      context.drawImage(img, offset.x, offset.y, img.width, img.height);

      data.pictures = [canvas.toDataURL('image/png').replace('data:image/png;base64,', '')];
    }

    api.member.addMember(data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        getRouter().renderError(error);
      })
      .finally(progress.done);
  };

  formRender = ({errors, touched, values}) => {
    const avatarPreviewStyle = {
      transform: 'scale(1)',
      backgroundImage: `url('${defaultAvatar}')`
    };
    if (this.props.member) {
      avatarPreviewStyle.backgroundImage = `url("data:image/jpeg;base64,${this.props.member.pictures[0]}")`;
    }

    if (this.state.avatarPreviewUrl) {
      avatarPreviewStyle.transform = `scale(${values.zoom * 0.01})`;
      avatarPreviewStyle.backgroundImage = `url('${this.state.avatarPreviewUrl}')`;
    }

    return (
      <Form>
        <div className="modal-body">
          <div className="avatar-uploader">
            <label ref={this.avatarWrapperRef} className="avatar-wrapper">
              <div className="avatar-img" style={avatarPreviewStyle}/>
              <img className="avatar-mask" src={avatarMask} srcSet={`${avatarMask2x} 2x`}/>
              <input type="file" className="d-none" accept=".jpg,.png" onChange={this.onChangeAvatar}/>
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
                  <Field name="zoom" component={Slider} step={20}
                    min={100}
                    max={300}/>
                </div>
              </div>
              <i className="far fa-image fa-fw fa-lg ml-2"/>
            </div>
          </div>
          <div className="form-group">
            <label>{_('Name')}</label>
            <Field name="name" type="text" placeholder={_('Please enter your name.')}
              maxLength={MemberSchema.name.max}
              className={classNames('form-control', {'is-invalid': errors.name && touched.name})}/>
            {
              errors.name && touched.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )
            }
          </div>
          <div className="form-group">
            <label>{_('Organization')}</label>
            <Field name="organization" type="text" placeholder={_('Please enter the organization.')}
              maxLength={MemberSchema.organization.max}
              className={classNames('form-control', {'is-invalid': errors.organization && touched.organization})}/>
            {
              errors.organization && touched.organization && (
                <div className="invalid-feedback">{errors.organization}</div>
              )
            }
            <small className="form-text text-muted">{_('Letters within 32 characters.')}</small>
          </div>
          <div className="form-group">
            <label>{_('Group')}</label>
            <div className="select-wrapper border rounded-pill overflow-hidden px-2">
              <Field name="group" component="select" className="form-control border-0">
                <option value="">{_('None')}</option>
                {
                  this.props.groups.items.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))
                }
              </Field>
            </div>
          </div>
          <div className="form-group">
            <label>{_('Note')}</label>
            <Field name="note" type="text" placeholder={_('Please enter your note.')}
              maxLength={MemberSchema.note.max}
              className={classNames('form-control', {'is-invalid': errors.note && touched.note})}/>
            {
              errors.note && touched.note && (
                <div className="invalid-feedback">{errors.note}</div>
              )
            }
          </div>
        </div>
        <div className="modal-footer flex-column">
          <div className="form-group w-100 mx-0">
            <button type="submit" className="btn btn-primary btn-block rounded-pill">
              {this.props.member ? _('Confirm') : _('New')}
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
  };

  render() {
    const {member} = this.props;
    let initialValues;
    if (member) {
      initialValues = {
        id: member.id,
        name: member.name,
        organization: member.organization,
        group: member.groupId,
        note: member.note,
        zoom: 120
      };
    } else {
      initialValues = {
        name: '',
        organization: '',
        group: '',
        note: '',
        zoom: 120
      };
    }

    return (
      <Modal autoFocus={false} show={this.state.isShowModal} onHide={this.hideModal}>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h5">{member ? _('Modify member') : _('New member')}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validate={utils.makeFormikValidator(MemberValidator)}
          render={this.formRender}
          onSubmit={this.onSubmitForm}/>
      </Modal>
    );
  }
};