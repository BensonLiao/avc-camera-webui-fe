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
    const router = getRouter();

    this.avatarWrapperRef = React.createRef();
    this.avatarFile = null;
    this.state.pictureRotateDegrees = 0;
    this.state.isIncorrectPicture = null;
    this.state.isShowModal = true;
    this.state.avatarPreviewUrl = null;
    this.$listens.push(
      router.listen('ChangeStart', (action, toState) => {
        const isShowModal = [
          'web.members.new-member',
          'web.members.details'
        ].indexOf(toState.name) >= 0;
        this.setState({isShowModal});
      })
    );
  }

  generateInitialValue = member => {
    if (member) {
      return {
        id: member.id,
        name: member.name,
        organization: member.organization || '',
        group: member.groupId,
        note: member.note || '',
        zoom: 100
      };
    }

    return {
      name: '',
      organization: '',
      group: '',
      note: '',
      zoom: 100
    };
  };

  hideModal = () => {
    getRouter().go({
      name: this.props.parentRouteName,
      params: this.props.params
    });
  };

  generateRotatePictureHandler = isClockwise => event => {
    event.preventDefault();
    const degrees = isClockwise ? 90 : -90;
    this.setState(prevState => ({
      pictureRotateDegrees: prevState.pictureRotateDegrees + degrees
    }));
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
    const convertPicture = (imgSrc, zoomRate, pictureRotateDegrees) => {
      /*
      @returns {String} base64 jpeg string
       */
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const size = 300;
      let rate;

      img.src = imgSrc;
      rate = img.height / img.width;
      if (img.width < img.height) {
        img.width = size;
        img.height = Math.round(img.width * rate);
      } else {
        img.height = size;
        img.width = Math.round(img.height / rate);
      }

      img.width = Math.round(img.width * zoomRate * 0.01);
      img.height = Math.round(img.height * zoomRate * 0.01);

      canvas.width = size;
      canvas.height = size;
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(pictureRotateDegrees * Math.PI / 180);
      context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
      context.restore();

      return canvas.toDataURL('image/jpeg', 0.9).replace('data:image/jpeg;base64,', '');
    };

    if (this.avatarFile) {
      data.pictures = [
        convertPicture(this.state.avatarPreviewUrl, values.zoom, this.state.pictureRotateDegrees)
      ];
    } else if (this.props.member && (this.state.pictureRotateDegrees || values.zoom !== 100)) {
      // The user modify the exist picture.
      data.pictures = [
        convertPicture(
          `data:image/jpeg;base64,${this.props.member.pictures[0]}`,
          values.zoom,
          this.state.pictureRotateDegrees
        )
      ];
    } else if (this.props.member) {
      // The user didn't modify the picture.
      data.pictures = this.props.member.pictures;
    }

    if (data.pictures && data.pictures.length) {
      if (this.state.isIncorrectPicture) {
        this.setState({isIncorrectPicture: null});
      }
    } else {
      if (!this.state.isIncorrectPicture) {
        this.setState({isIncorrectPicture: true});
      }

      return;
    }

    progress.start();
    if (this.props.member) {
      // Update the member.
      api.member.updateMember(data)
        .then(() => {
          getRouter().go({name: 'web.members', params: this.props.params}, {reload: true});
        })
        .catch(error => {
          progress.done();
          utils.renderError(error);
        });
    } else {
      // Add a new member.
      api.member.addMember(data)
        .then(() => {
          getRouter().go({name: 'web.members', params: {}}, {reload: true});
        })
        .catch(error => {
          progress.done();
          utils.renderError(error);
        });
    }
  };

  formRender = ({errors, touched, values}) => {
    const avatarPreviewStyle = {backgroundImage: `url('${defaultAvatar}')`};
    if (this.props.member) {
      avatarPreviewStyle.backgroundImage = `url("data:image/jpeg;base64,${this.props.member.pictures[0]}")`;
    }

    if (this.state.avatarPreviewUrl) {
      // The user upload a new picture.
      avatarPreviewStyle.backgroundImage = `url('${this.state.avatarPreviewUrl}')`;
    }

    avatarPreviewStyle.transform = `scale(${values.zoom * 0.01})`;
    if (this.state.pictureRotateDegrees) {
      avatarPreviewStyle.transform += ` rotate(${this.state.pictureRotateDegrees}deg)`;
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
            <p className={classNames('text-center text-size-14 mb-1', this.state.isIncorrectPicture ? 'text-danger' : 'text-muted')}>
              {_('Please upload your face photo.')}
            </p>
            <div className="d-flex justify-content-center align-items-center">
              <button className="btn btn-link text-muted" type="button" onClick={this.generateRotatePictureHandler(false)}>
                <i className="fas fa-undo fa-fw"/>
              </button>
              <button className="btn btn-link text-muted" type="button" onClick={this.generateRotatePictureHandler(true)}>
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

    return (
      <Modal autoFocus={false} show={this.state.isShowModal} onHide={this.hideModal}>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h5">{member ? _('Modify member') : _('New member')}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={this.generateInitialValue(member)}
          validate={utils.makeFormikValidator(MemberValidator)}
          render={this.formRender}
          onSubmit={this.onSubmitForm}/>
      </Modal>
    );
  }
};
