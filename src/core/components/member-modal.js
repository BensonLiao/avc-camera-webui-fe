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
      // The form submitted callback.
      onSubmitted: PropTypes.func.isRequired,
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
    this.state.isIncorrectPicture = null;

    this.avatarWrapperRef = React.createRef();
    this.avatarFile = null;
    this.state.pictureRotateDegrees = 0;
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
          background: props.member ? props.member.pictures[index] ? `data:image/jpeg;base64,${props.member.pictures[index]}` : null : null
        },
        avatarFile: null,
        verified: null,
        isVerifying: false,
        errorMessage: null
      }
    })));
  }

  generateInitialValue = member => {
    const {avatarList, avatarToEdit} = this.state;
    if (member) {
      return {
        id: member.id,
        name: member.name,
        organization: member.organization || '',
        group: member.groupId,
        note: member.note || '',
        zoom: avatarList[avatarToEdit].avatarPreviewStyle.transform.scale * 100
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
    const resetIfAroundTheWorld = avatarList[avatarToEdit].avatarPreviewStyle.transform.rotate === 360 ?
      0 :
      avatarList[avatarToEdit].avatarPreviewStyle.transform.rotate;
    const updateRotation = update(this.state,
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
                     {$set: resetIfAroundTheWorld + degrees}
                  }
               }
            }
         }
      }
    );
    this.setState(updateRotation);
  };

  onChangeAvatar = (avatarName, callback) => event => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const {avatarList} = this.state;
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
          const updateAvatarFile = update(this.state,
            {avatarList: {[avatarName]: {avatarFile: {$set: blob}}}});
          this.setState(updateAvatarFile);
          if (avatarList[avatarName].avatarPreviewStyle.background) {
            window.URL.revokeObjectURL(avatarList[avatarName].avatarPreviewStyle.background);
          }

          const updateAvatarURL = update(this.state,
            {avatarList: {[avatarName]: {avatarPreviewStyle: {background: {$set: window.URL.createObjectURL(blob)}}}}});
          this.setState(updateAvatarURL);
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
    const deleteAvatar = update(this.state,
      {
        avatarList: {
          [this.state.avatarToEdit]: {
            $set: {
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
                background: null
              }
            }
          }
        }
      });
    this.setState(deleteAvatar);
    this.onHideEditModal();
  }

  onDraggingMaskArea = (event, data) => {
    const updatePhotoOffset = update(this.state,
      {
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
    this.setState(updatePhotoOffset);
  };

  updateBoundary = values => {
    const zoomScale = values.zoom / 100;
    const calculateBoundary = ((this.editWrapperSize * zoomScale) - this.editWrapperSize) / zoomScale / 4;
    const updateBoundary = update(this.state,
      {
        avatarList: {
          [this.state.avatarToEdit]: {
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
    this.setState(updateBoundary);
  }

  verifyPhoto = () => {
    const {avatarList, avatarToEdit} = this.state;
    const {member} = this.props;
    this.setState({isShowEditModal: false}, () => {
      if (avatarList[avatarToEdit].avatarFile ||
          (member && (
            avatarList[avatarToEdit].avatarPreviewStyle.transform.scale !== 1 ||
            avatarList[avatarToEdit].avatarPreviewStyle.transform.rotate !== 0 ||
            avatarList[avatarToEdit].photoOffset.x !== 0 ||
            avatarList[avatarToEdit].photoOffset.y !== 0)
          )
      ) {
        // User uploads a new photo or existing photo was edited
        const updateIsVerifying = update(this.state,
          {avatarList: {[avatarToEdit]: {isVerifying: {$set: true}}}});
        this.setState(updateIsVerifying, () => {
          const verifyQueue = [];
          verifyQueue.push(new Promise((resolve, reject) => {
            if ((Math.floor(Math.random() * 2) === 0)) {
              setTimeout(resolve, 3000);
            } else {
              setTimeout(() => {
                reject(new Error('Something failed'));
              }, 3000);
            }
          }));
          Promise.all(verifyQueue)
            .then(() => {
              const updateAvatarVerification = update(this.state,
                {
                  avatarList: {
                    [avatarToEdit]: {
                      verified: {$set: true},
                      isVerifying: {$set: false},
                      errorMessage: {$set: null}
                    }
                  }
                });
              this.setState(updateAvatarVerification);
            }).catch(error => {
              const updateAvatarVerification = update(this.state,
                {
                  avatarList: {
                    [avatarToEdit]: {
                      verified: {$set: false},
                      isVerifying: {$set: false},
                      errorMessage: {$set: error.message}
                    }
                  }
                });
              this.setState(updateAvatarVerification);
            });
        });
      }
    });
  }

  onSubmitForm = values => {
    const data = {...values};
    const {avatarList} = this.state;
    const {defaultPictureUrl, member, onSubmitted} = this.props;
    const tasks = [];
    Object.entries(avatarList).forEach((item, index) => {
      if (item[1].avatarFile) {
        // The user upload a file.
        tasks.push(
          utils.convertPicture(item[1].avatarPreviewStyle.background,
            item[1].avatarPreviewStyle.transform.scale,
            item[1].avatarPreviewStyle.transform.rotate,
            item[1].photoOffset,
            this.editWrapperSize
          )
        );
      } else if (member && (
        item[1].avatarPreviewStyle.transform.rotate !== 0 ||
         item[1].avatarPreviewStyle.transform.scale !== 1 ||
         item[1].photoOffset.x !== 0 ||
         item[1].photoOffset.y !== 0
      )) {
        // The user modify the exist picture.
        tasks.push(
          utils.convertPicture(
            item[1].avatarPreviewStyle.background,
            item[1].avatarPreviewStyle.transform.scale,
            item[1].avatarPreviewStyle.transform.rotate,
            item[1].photoOffset,
            this.editWrapperSize
          )
        );
      } else if (member && item[1].avatarPreviewStyle.background) {
        // The user didn't modify the picture.
        tasks.push(member.pictures[index]);
      } else if (defaultPictureUrl) {
        // Register a member from the event.
        tasks.push(
          utils.convertPicture(
            defaultPictureUrl,
            item[1].avatarPreviewStyle.transform.scale,
            item[1].avatarPreviewStyle.transform.rotate,
            item[1].photoOffset,
            this.editWrapperSize
          )
        );
      }
    });

    progress.start();
    Promise.all(tasks).then(imageData => {
      data.pictures = imageData;
      if (member) {
        // Update the member.
        return api.member.updateMember(data).then(onSubmitted);
      }

      // Add a new member.
      return api.member.addMember(data).then(onSubmitted);
    })
      .finally(progress.done);
    // const {avatarPreviewUrl, pictureRotateDegrees, photoOffset, isIncorrectPicture} = this.state;
    // const {defaultPictureUrl, member, onSubmitted} = this.props;
    // const zoomFactor = values.zoom / 100;
    // const tasks = [];

    // if (this.avatarFile) {
    //   // The user upload a file.
    //   tasks.push(
    //     utils.convertPicture(avatarPreviewUrl,
    //       zoomFactor,
    //       pictureRotateDegrees,
    //       photoOffset,
    //       this.editWrapperSize
    //     )
    //   );
    // } else if (member && (pictureRotateDegrees || zoomFactor !== 1 || photoOffset)) {
    //   // The user modify the exist picture.
    //   tasks.push(
    //     utils.convertPicture(
    //       `data:image/jpeg;base64,${member.pictures[0]}`,
    //       zoomFactor,
    //       pictureRotateDegrees,
    //       photoOffset,
    //       this.editWrapperSize
    //     )
    //   );
    // } else if (member) {
    //   // The user didn't modify the picture.
    //   data.pictures = member.pictures;
    // } else if (defaultPictureUrl) {
    //   // Register a member from the event.
    //   tasks.push(
    //     utils.convertPicture(
    //       defaultPictureUrl,
    //       zoomFactor,
    //       pictureRotateDegrees,
    //       photoOffset,
    //       this.editWrapperSize
    //     )
    //   );
    // }

    // progress.start();
    // Promise.all(tasks).then(([imageData]) => {
    //   if (imageData) {
    //     data.pictures = [imageData];
    //   }

    //   if (data.pictures && data.pictures.length) {
    //     if (isIncorrectPicture) {
    //       this.setState({isIncorrectPicture: null});
    //     }
    //   } else {
    //     // Incorrect picture.
    //     if (!isIncorrectPicture) {
    //       this.setState({isIncorrectPicture: true});
    //     }

    //     return;
    //   }

    //   if (member) {
    //     // Update the member.
    //     return api.member.updateMember(data).then(onSubmitted);
    //   }

    //   // Add a new member.
    //   return api.member.addMember(data).then(onSubmitted);
    // })
    //   .finally(progress.done);
  };

  formRender = ({errors, touched, values}) => {
    const {isApiProcessing} = this.props;
    const {avatarList, isShowEditModal, avatarToEdit} = this.state;
    // const zoomScale = values.zoom / 100;
    const previewReductionRatio = this.listWrapperSize / this.editWrapperSize;
    const errorMessages = Object.entries(avatarList).filter(item => Boolean(item[1].errorMessage));
    return (
      <Form>
        <div className="modal-body">
          <div className="multi-photo-uploader">
            <div className="container d-flex flex-row justify-content-space-between">
              {Object.entries(avatarList).map(avatar => {
                return (
                  <div key={avatar[0]} className={classNames('individual-item d-flex flex-column')}>
                    <div
                      id="photo-wrapper"
                      className={classNames(
                        'photo-wrapper',
                        {'dashed-border': !avatar[1].avatarPreviewStyle.background},
                        {'failed-check': avatar[1].verified === false}
                      )}
                    >
                      <i className={classNames(
                        'fas fa-pen fa-lg fa-fw',
                        {'d-none': !avatar[1].avatarPreviewStyle.background}
                      )}
                      />
                      { avatar[1].avatarPreviewStyle.background ?
                        (
                          // Display photo preview and edit button
                          <>
                            <div
                              className={classNames(
                                'avatar-img',
                                {'is-verifying': avatar[1].isVerifying}
                              )}
                              style={{
                                backgroundImage: `url("${avatar[1].avatarPreviewStyle.background}")`,
                                transform: `scale(${avatar[1].avatarPreviewStyle.transform.scale}) 
                                            rotate(${avatar[1].avatarPreviewStyle.transform.rotate}deg)
                                            translate(${avatar[1].photoOffset.x * previewReductionRatio}px, ${avatar[1].photoOffset.y * previewReductionRatio}px`
                              }}
                              onClick={() => {
                                this.onShowEditModal(avatar[0]);
                              }}
                            />
                            <div className={classNames(
                              'loading-dots',
                              {'d-none': !avatar[1].isVerifying}
                            )}
                            >
                              <div className="spinner">
                                <div className="double-bounce1"/>
                                <div className="double-bounce2"/>
                              </div>
                            </div>
                          </>
                        ) : (
                          // Display upload area
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
          {/* Error message from photo validation */}
          {errorMessages.map(item => {
            return (
              <p key={item[0]} className={classNames('text-size-14 mb-1', 'text-danger')}>
                {`${_(item[0])}: ${_(item[1].errorMessage)}`}
              </p>
            );
          })}

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
          onHide={this.onHideEditModal}
        >
          <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
            <Modal.Title as="h5">{_('Photo Editor')}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="avatar-uploader d-flex flex-column align-items-center">
              <label ref={this.avatarWrapperRef} className="avatar-wrapper" id="avatar-wrapper">
                <div style={{transform: `scale(${avatarList[avatarToEdit].avatarPreviewStyle.transform.scale}) rotate(${avatarList[avatarToEdit].avatarPreviewStyle.transform.rotate}deg)`}}>
                  <Draggable
                    bounds={avatarList[avatarToEdit].boundary}
                    scale={avatarList[avatarToEdit].avatarPreviewStyle.transform.scale}
                    positionOffset={avatarList[avatarToEdit].photoOffset}
                    onDrag={this.onDraggingMaskArea}
                  >
                    <div
                      className="avatar-img"
                      style={{
                        transform: `scale(${avatarList[avatarToEdit].avatarPreviewStyle.transform.scale}) rotate(${avatarList[avatarToEdit].avatarPreviewStyle.transform.rotate}deg)`,
                        backgroundImage: `url("${avatarList[avatarToEdit].avatarPreviewStyle.background}")`
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
                        this.updateBoundary(values);
                      }}
                    />
                  </div>
                </div>
                <i className="far fa-image fa-fw fa-lg ml-2"/>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            { avatarToEdit !== 'Primary' && (
              <button
                className="btn btn-danger btn-block m-0 rounded-pill"
                type="button"
                onClick={this.onDeleteAvatar}
              >
                {_('Delete ')}
              </button>
            )}
            <label className="btn btn-outline-primary btn-block m-0 rounded-pill">
              <input className="d-none" type="file" accept=".jpg,.png" onChange={this.onChangeAvatar(avatarToEdit)}/>
              {_('Change Photo')}
            </label>
            <button
              className="btn btn-primary btn-block m-0 rounded-pill"
              type="button"
              onClick={this.verifyPhoto}
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
          enableReinitialize
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
