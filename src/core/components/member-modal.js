const classNames = require('classnames');
const progress = require('nprogress');
const PropTypes = require('prop-types');
const React = require('react');
const loadImage = require('blueimp-load-image');
const {Formik, Form, Field} = require('formik');
const Draggable = require('react-draggable').default;
const Modal = require('react-bootstrap/Modal').default;
const update = require('immutability-helper');
const MemberSchema = require('webserver-form-schema/member-schema');
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
    return {
      defaultPictureUrl: null,
      groups: {items: []},
      member: null
    };
  }

  state={}

  constructor(props) {
    super(props);
    this.avatarWrapperRef = React.createRef();
    this.avatarFile = null;
    this.state.pictureRotateDegrees = 0;
    this.state.isIncorrectPicture = null;
    this.state.avatarPreviewUrl = null;
    this.state.isShowEditModal = false;
    this.state.avatarToEdit = 'Primary';
    this.editWrapperSize = 128;
    this.listWrapperSize = 88;
    this.state.boundary = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };

    // Initialise avatarList state object
    const nameList = {
      Primary: {},
      'Photo 1': {},
      'Photo 2': {},
      'Photo 3': {},
      'Photo 4': {}
    };
    this.state.avatarList = Object.assign({}, ...Object.keys(nameList).map((item, index) => ({
      [item]: {
        boundary: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        photoOffset: {
          x: 0,
          y: 0
        },
        avatarPreviewStyle: {
          transform: {
            scale: 1,
            rotate: 0
          },
          background: props.member.pictures[index] ? `url("data:image/jpeg;base64,${props.member.pictures[index]}")` : null
        }
      }
    })));
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

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  onHideEditModal = () => {
    this.setState({isShowEditModal: false});
  };

  onShowEditModal = avatarName => {
    this.setState({
      isShowEditModal: true,
      avatarToEdit: avatarName
    });
  };

  generateRotatePictureHandler = isClockwise => event => {
    event.preventDefault();
    const {avatarToEdit, avatarList} = this.state;
    const degrees = isClockwise ? 90 : -90;
    const newState = update(this.state,
      {
        avatarList:
         {
           [avatarToEdit]:
            {
              avatarPreviewStyle:
               {
                 transform:
                  {
                    rotate:
                     {$set: avatarList[avatarToEdit].avatarPreviewStyle.transform.rotate + degrees}
                  }
               }
            }
         }
      }
    );
    this.setState(newState);
  };

  onChangeAvatar = (avatarName, callback) => event => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Ensure correct orientation
    // Orientation info:
    // https://sirv.com/help/articles/rotate-photos-to-be-upright/
    loadImage(file, {
      orientation: 1,
      canvas: true,
      meta: true
    })
      .then(data => {
        const conditionedImage = data.image;
        conditionedImage.toBlob(blob => {
          this.avatarFile = blob;
          if (this.state.avatarList[avatarName].avatarPreviewStyle.background) {
            window.URL.revokeObjectURL(this.state.avatarList[avatarName].avatarPreviewStyle.background);
          }

          const newState = update(this.state, {avatarList: {[avatarName]: {avatarPreviewStyle: {background: {$set: `url('${window.URL.createObjectURL(blob)}')`}}}}});
          this.setState(newState);
        }, `${conditionedImage.type}`);
      })
      .then(() => {
        // Open
        if (callback) {
          callback(avatarName);
        }
      })
      .catch(err => {
        // Handling image loading errors
        console.error(err);
      });
  };

  onDeleteAvatar = () => {
    const newState = update(this.state, {
      avatarList: {
        [this.state.avatarToEdit]: {
          $set: {
            boundary: {},
            photoOffset: {},
            avatarPreviewStyle: {
              transform: {
                scale: 1,
                rotate: 0
              },
              background: null
            }
          }
        }
      }
    });
    this.setState(newState);
    this.onHideEditModal();
  }

  onDraggingMaskArea = (event, data) => {
    const newState = update(this.state, {
      avatarList: {
        [this.state.avatarToEdit]: {
          photoOffset: {
            $set: {
              x: data.x,
              y: data.y
            }
          }
        }
      }
    });
    this.setState(newState);
  };

  updateBoundary = zoomScale => {
    const {avatarToEdit} = this.state;
    const calculateBoundary = ((this.editWrapperSize * zoomScale) - this.editWrapperSize) / zoomScale / 2;
    const newState = update(this.state, {
      avatarList: {
        [avatarToEdit]: {
          boundary: {
            $set: {
              left: -calculateBoundary,
              top: -calculateBoundary,
              right: calculateBoundary,
              bottom: calculateBoundary
            }
          },
          avatarPreviewStyle: {transform: {scale: {$set: zoomScale}}}
        }
      }
    });
    this.setState(newState);
  }

  onSubmitForm = values => {
    const data = {...values};
    const {avatarPreviewUrl, pictureRotateDegrees, photoOffset, isIncorrectPicture} = this.state;
    const {defaultPictureUrl, member, onSubmitted} = this.props;
    const zoomFactor = values.zoom / 100;
    const tasks = [];

    if (this.avatarFile) {
      // The user upload a file.
      tasks.push(
        utils.convertPicture(avatarPreviewUrl,
          zoomFactor,
          pictureRotateDegrees,
          photoOffset,
          this.editWrapperSize
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
          this.editWrapperSize
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
          this.editWrapperSize
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
    const {avatarList, isShowEditModal, avatarToEdit} = this.state;
    const zoomScale = values.zoom / 100;
    // previewReductionRatio = avatarList preview window size / edit preview window size
    const previewReductionRatio = this.listWrapperSize / this.editWrapperSize;
    return (
      <Form>
        <div className="modal-body">
          <div className="multi-photo-uploader">
            <div className="container d-flex flex-row justify-content-space-between">
              {Object.entries(avatarList).map(avatar => {
                return (
                  <div key={avatar[0]} className={classNames('individual-item d-flex flex-column')}>
                    <div id="photo-wrapper" className={classNames('photo-wrapper', {'dashed-border': !avatar[1].avatarPreviewStyle.background})}>
                      <i className={classNames('fas fa-pen fa-lg fa-fw', {'d-none': !avatar[1].avatarPreviewStyle.background})}/>
                      { avatar[1].avatarPreviewStyle.background ?
                        (
                          <div
                            className="avatar-img"
                            style={{
                              transform: `scale(${avatar[1].avatarPreviewStyle.transform.scale}) 
                                            rotate(${avatar[1].avatarPreviewStyle.transform.rotate}deg)
                                            translate(${avatar[1].photoOffset.x * previewReductionRatio}px, ${avatar[1].photoOffset.y * previewReductionRatio}px`,
                              backgroundImage: avatar[1].avatarPreviewStyle.background
                            }}
                            onClick={() => {
                              this.onShowEditModal(avatar[0]);
                            }}
                          />
                        ) : (
                          <label className="btn">
                            <i className="fas fa-plus"/>
                            <input
                              className="d-none"
                              type="file"
                              accept=".jpg,.png"
                              onChange={this.onChangeAvatar(avatar[0], this.onShowEditModal)}
                            />
                          </label>
                        )}
                    </div>
                    <span>
                      {avatar[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <hr/>
          {/* <div className="avatar-uploader d-flex flex-column align-items-center">
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
          </div> */}
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
        <Modal
          autoFocus={false}
          show={isShowEditModal}
          className="edit-modal"
          backdrop="static"
        >
          <Modal.Header className="d-flex justify-content-between align-items-center">
            <Modal.Title as="h5">{_('Photo Editor')}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="avatar-uploader d-flex flex-column align-items-center">
              <label ref={this.avatarWrapperRef} className="avatar-wrapper" id="avatar-wrapper">
                <div style={{transform: `scale(${avatarList[avatarToEdit].avatarPreviewStyle.transform.scale}) rotate(${avatarList[avatarToEdit].avatarPreviewStyle.transform.rotate}deg)`}}>
                  <Draggable
                    bounds={avatarList[avatarToEdit].boundary}
                    scale={zoomScale}
                    onDrag={this.onDraggingMaskArea}
                  >
                    <div
                      className="avatar-img"
                      style={{
                        transform: `scale(${avatarList[avatarToEdit].avatarPreviewStyle.transform.scale}) rotate(${avatarList[avatarToEdit].avatarPreviewStyle.transform.rotate}deg)`,
                        backgroundImage: avatarList[avatarToEdit].avatarPreviewStyle.background
                      }}
                    />
                  </Draggable>
                </div>
                <div className="avatar-mask">
                  <img src={avatarMask}/>
                </div>
              </label>
              <p className="text-center mb-1">
                {_('Drag to reposition photo')}
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
          </Modal.Body>

          <Modal.Footer>
            <button
              className="btn btn-danger btn-block m-0 rounded-pill"
              type="button"
              onClick={this.onDeleteAvatar}
            >
              {_('Delete ')}
            </button>
            <label className="btn btn-outline-primary btn-block m-0 rounded-pill">
              <input className="d-none" type="file" accept=".jpg,.png" onChange={this.onChangeAvatar(this.state.avatarToEdit)}/>
              {_('Change Photo')}
            </label>
            <button
              className="btn btn-primary btn-block m-0 rounded-pill"
              type="button"
              onClick={this.onHideEditModal}
            >
              {_('Save')}
            </button>
          </Modal.Footer>
        </Modal>
      </Form>
    );
  };

  render() {
    const {isShowModal, member, onHide} = this.props;

    return (
      <Modal
        autoFocus={false}
        show={isShowModal}
        className="member-modal"
        backdrop="static"
        onHide={onHide}
      >
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
