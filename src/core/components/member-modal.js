const classNames = require('classnames');
const progress = require('nprogress');
const PropTypes = require('prop-types');
const React = require('react');
const {Formik, Form, Field} = require('formik');
const Draggable = require('react-draggable').default;
const Modal = require('react-bootstrap/Modal').default;
const MemberSchema = require('webserver-form-schema/member-schema');
const defaultAvatar = require('../../resource/default-avatar@2x.png');
const avatarMask = require('../../resource/avatar-mask.png');
const SelectField = require('./fields/select-field');
const Slider = require('./fields/slider');
const _ = require('../../languages');
const MemberValidator = require('../../web/validations/members/member-validator');
const utils = require('../utils');
const api = require('../apis/web-api');

module.exports = class Member extends React.PureComponent {
  static get propTypes() {
    return {
      isApiProcessing: PropTypes.bool.isRequired,
      isShowModal: PropTypes.bool.isRequired,
      onSubmitted: PropTypes.func.isRequired, // The form submitted callback.
      onHide: PropTypes.func.isRequired,
      defaultPictureUrl: PropTypes.string,
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

  static get defaultProps() {
    return {defaultPictureUrl: null, groups: {items: []}, member: null};
  }

  state = {
    pictureRotateDegrees: 0,
    isIncorrectPicture: null,
    avatarPreviewUrl: null
  };

  constructor(props) {
    super(props);
    this.avatarWrapperRef = React.createRef();
    this.avatarFile = null;
    this.state.wrapperSize = null;
    this.state.boundary = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
  }

  componentDidMount() {
    if (document.getElementById('avatar-wrapper')) {
      this.setState({wrapperSize: document.getElementById('avatar-wrapper').clientHeight});
    }
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

  generateRotatePictureHandler = isClockwise => event => {
    event.preventDefault();
    const degrees = isClockwise ? 90 : -90;
    this.setState(prevState => ({pictureRotateDegrees: prevState.pictureRotateDegrees + degrees}));
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

  onDraggingMaskArea = (event, data) => {
    this.setState({photoOffset: {x: data.x, y: data.y}});
  };

  updateBoundary = zoomScale => {
    const {wrapperSize} = this.state;
    const calculateBoundary = ((wrapperSize * zoomScale) - wrapperSize) / zoomScale / 2;
    this.setState({
      boundary: {
        left: -calculateBoundary,
        top: -calculateBoundary,
        right: calculateBoundary,
        bottom: calculateBoundary
      }
    });
  }

  onSubmitForm = values => {
    const data = {...values};
    const {avatarPreviewUrl, pictureRotateDegrees, photoOffset, isIncorrectPicture} = this.state;
    const {defaultPictureUrl, member, onSubmitted} = this.props;
    const zoomFactor = values.zoom / 100;
    const tasks = [];
    const wrapperSize = document.getElementById('avatar-wrapper').clientHeight;

    if (this.avatarFile) {
      // The user upload a file.
      tasks.push(
        utils.convertPicture(avatarPreviewUrl,
          zoomFactor,
          pictureRotateDegrees,
          photoOffset,
          wrapperSize
        )
      );
    } else if (member && (pictureRotateDegrees || zoomFactor !== 1 || photoOffset)) {
      // The user modify the exist picture.
      tasks.push(
        utils.convertPicture(
          `data:image/jpeg;base64,${member.pictures[0]}`,
          zoomFactor,
          pictureRotateDegrees,
          photoOffset,
          wrapperSize
        )
      );
    } else if (member) {
      // The user didn't modify the picture.
      data.pictures = member.pictures;
    } else if (defaultPictureUrl) {
      // Register a member from the event.
      tasks.push(
        utils.convertPicture(
          defaultPictureUrl,
          zoomFactor,
          pictureRotateDegrees,
          photoOffset,
          wrapperSize
        )
      );
    }

    progress.start();
    Promise.all(tasks).then(([imageData]) => {
      if (imageData) {
        data.pictures = [imageData];
      }

      if (data.pictures && data.pictures.length) {
        if (isIncorrectPicture) {
          this.setState({isIncorrectPicture: null});
        }
      } else {
        // Incorrect picture.
        if (!isIncorrectPicture) {
          this.setState({isIncorrectPicture: true});
        }

        return;
      }

      if (member) {
        // Update the member.
        return api.member.updateMember(data).then(onSubmitted);
      }

      // Add a new member.
      return api.member.addMember(data).then(onSubmitted);
    })
      .finally(progress.done);
  };

  formRender = ({errors, touched, values}) => {
    const {isApiProcessing} = this.props;
    const {boundary} = this.state;
    const avatarPreviewStyle = {backgroundImage: `url('${this.props.defaultPictureUrl || defaultAvatar}')`};
    const zoomScale = values.zoom / 100;

    if (this.props.member) {
      avatarPreviewStyle.backgroundImage = `url("data:image/jpeg;base64,${this.props.member.pictures[0]}")`;
    }

    if (this.state.avatarPreviewUrl) {
      // The user upload a new picture.
      avatarPreviewStyle.backgroundImage = `url('${this.state.avatarPreviewUrl}')`;
    }

    avatarPreviewStyle.transform = `scale(${zoomScale})`;
    if (this.state.pictureRotateDegrees) {
      avatarPreviewStyle.transform += ` rotate(${this.state.pictureRotateDegrees}deg)`;
    }

    return (
      <Form>
        <div className="modal-body">
          <div className="avatar-uploader d-flex flex-column align-items-center">
            <label ref={this.avatarWrapperRef} className="avatar-wrapper" id="avatar-wrapper">
              <div style={{transform: avatarPreviewStyle.transform}}>
                <Draggable
                  bounds={boundary}
                  scale={zoomScale}
                  onDrag={this.onDraggingMaskArea}
                >
                  <div className="avatar-img" style={avatarPreviewStyle}/>
                </Draggable>
              </div>
              <div className="avatar-mask">
                <img src={avatarMask}/>
              </div>
            </label>

            <label className="btn btn-outline-primary mt-2">
              <input className="d-none" type="file" accept=".jpg,.png" onChange={this.onChangeAvatar}/>
              {_('Upload Image')}
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
                  <Field
                    name="zoom"
                    component={Slider}
                    step={20}
                    min={100}
                    max={300}
                    onChangeInput={() => {
                      this.updateBoundary(zoomScale);
                    }}
                  />
                </div>
              </div>
              <i className="far fa-image fa-fw fa-lg ml-2"/>
            </div>
          </div>
          <div className="form-group">
            <label>{_('Name')}</label>
            <Field
              name="name"
              type="text"
              placeholder={_('Enter Your Name')}
              maxLength={MemberSchema.name.max}
              className={classNames('form-control', {'is-invalid': errors.name && touched.name})}
            />
            {
              errors.name && touched.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )
            }
          </div>
          <div className="form-group">
            <label>{_('Organization')}</label>
            <Field
              name="organization"
              type="text"
              placeholder={_('Enter the organization')}
              maxLength={MemberSchema.organization.max}
              className={classNames('form-control', {'is-invalid': errors.organization && touched.organization})}
            />
            {
              errors.organization && touched.organization && (
                <div className="invalid-feedback">{errors.organization}</div>
              )
            }
            <small className="form-text text-muted">{_('Letters within 32 characters.')}</small>
          </div>
          <SelectField labelName={_('Group')} wrapperClassName="px-2" name="group">
            <option value="">{_('N/A')}</option>
            {this.props.groups.items.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </SelectField>
          <div className="form-group">
            <label>{_('Note')}</label>
            <Field
              name="note"
              type="text"
              placeholder={_('Enter Your Note')}
              maxLength={MemberSchema.note.max}
              className={classNames('form-control', {'is-invalid': errors.note && touched.note})}
            />
            {
              errors.note && touched.note && (
                <div className="invalid-feedback">{errors.note}</div>
              )
            }
          </div>
        </div>
        <div className="modal-footer flex-column">
          <div className="form-group w-100 mx-0">
            <button disabled={isApiProcessing} type="submit" className="btn btn-primary btn-block rounded-pill">
              {this.props.member ? _('Confirm') : _('New')}
            </button>
          </div>
          <button
            className="btn btn-info btn-block m-0 rounded-pill"
            type="button"
            onClick={this.props.onHide}
          >
            {_('Close')}
          </button>
        </div>
      </Form>
    );
  };

  render() {
    const {isShowModal, member, onHide} = this.props;

    return (
      <Modal autoFocus={false} show={isShowModal} onHide={onHide}>
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h5">{member ? _('Modify Member') : _('New Member')}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={this.generateInitialValue(member)}
          validate={utils.makeFormikValidator(MemberValidator)}
          onSubmit={this.onSubmitForm}
        >
          {this.formRender}
        </Formik>
      </Modal>
    );
  }
};
