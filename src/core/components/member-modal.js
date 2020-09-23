const classNames = require('classnames');
require('cropperjs/dist/cropper.min.css');
const Cropper = require('react-cropper').default;
const progress = require('nprogress');
const PropTypes = require('prop-types');
const React = require('react');
const loadImage = require('blueimp-load-image');
const {Formik, Form, Field, ErrorMessage} = require('formik');
const Modal = require('react-bootstrap/Modal').default;
const update = require('immutability-helper');
const MemberSchema = require('webserver-form-schema/member-schema');
const avatarMask = require('../../resource/avatar-mask.png');
const SelectField = require('./fields/select-field');
const Slider = require('./fields/slider');
const _ = require('../../languages');
const MemberValidator = require('../../web/validations/members/member-validator');
const {
  MEMBER_PHOTO_MIME_TYPE,
  MEMBER_PHOTO_SCALE_STEP,
  MEMBER_PHOTO_SCALE_MIN,
  MEMBER_PHOTO_SCALE_MAX
} = require('../constants');
const utils = require('../utils');
const api = require('../apis/web-api');
const CustomNotifyModal = require('./custom-notify-modal');
const CustomTooltip = require('./tooltip');
const FormikEffect = require('./formik-effect');
const Base64DataURLPrefix = `data:${MEMBER_PHOTO_MIME_TYPE};base64,`;

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
      }),
      remainingPictureCount: PropTypes.number.isRequired
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

  cropper = null;

  constructor(props) {
    super();
    this.avatarWrapperRef = React.createRef();
    this.avatarFile = null;
    // Only determine remaining quota if count is less than 5
    this.state.remainingPictureQuota = props.remainingPictureCount < 5 ? props.remainingPictureCount : null;
    this.state.pictureRotateDegrees = 0;
    this.state.avatarPreviewUrl = null;
    this.state.isShowEditModal = false;
    this.state.isShowConfirmModal = false;
    this.state.isFormTouched = false;
    this.state.preEditState = null;
    this.state.avatarToEdit = 'Primary';
    this.editWrapperSize = 300; // px
    this.listWrapperSize = 88; // px
    // Initialise avatarList state object
    const nameList = ['Primary', 'Photo 1', 'Photo 2', 'Photo 3', 'Photo 4'];
    this.state.avatarList = Object.assign({}, ...nameList.map((item, index) => ({
      [item]: {
        avatarPreviewStyle: {
          cropper: {
            scale: 1,
            rotate: 0
          },
          originalImage: props.defaultPictureUrl && index === 0 ?
            // Get photo from event, only add to primary avatar (add new member)
            props.defaultPictureUrl :
            props.member ?
              props.member.pictures[index] ?
                // Get photo from existing member
                Base64DataURLPrefix + props.member.pictures[index] :
                null :
              null,
          croppedImage: props.defaultPictureUrl && index === 0 ?
            props.defaultPictureUrl :
            props.member ?
              props.member.pictures[index] ?
                Base64DataURLPrefix + props.member.pictures[index] :
                null :
              null,
          // Will update on verify suceess, use it on save member
          convertedImage: null
        },
        avatarFile: null,
        verifyStatus: null,
        isVerifying: false,
        errorMessage: null
      }
    })));
  }

  componentDidMount() {
    // Validate event photo on initial load
    if (this.props.defaultPictureUrl) {
      this.verifyPhoto();
    }

    this.updatePictureCount();
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
        zoom: avatarList[avatarToEdit].avatarPreviewStyle.cropper.scale
      };
    }

    return {
      name: '',
      organization: '',
      group: '',
      note: '',
      zoom: avatarList[avatarToEdit].avatarPreviewStyle.cropper.scale
    };
  };

  updatePictureCount() {
    if (this.state.remainingPictureQuota !== null) {
      const {remainingPictureCount, defaultPictureUrl} = this.props;
      // Update remaining picture quota if user uploads or deletes a photo
      this.setState(prevState => ({
        ...prevState,
        remainingPictureQuota: (
          // Subtract 1 if adding photo from event
          defaultPictureUrl ? remainingPictureCount - 1 : remainingPictureCount
        ) - Object.entries(prevState.avatarList).reduce((count, item) => {
          count += item[1].avatarFile ? 1 : 0;
          return count;
        }, 0)
      }));
    }
  }

  onChangeFormValues = () => {
    this.setState({isFormTouched: true});
  }

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  onHideEditModalAndRevertChanges = () => {
    const updateState = update(this.state,
      {
        isShowEditModal: {$set: false},
        avatarList: {[this.state.avatarToEdit]: {$set: this.state.preEditState}}
      });
    this.setState(updateState);
  };

  onShowConfirmModal = () => {
    this.setState({isShowConfirmModal: true});
  }

  onHideConfirmModal = () => {
    this.setState({isShowConfirmModal: false});
  }

  onShowEditModal = avatarName => {
    const updateState = update(this.state,
      {
        isShowEditModal: {$set: true},
        avatarToEdit: {$set: avatarName},
        preEditState: {$set: this.state.avatarList[avatarName]}
      });
    this.setState(updateState);
  };

  onCropperInit = cropper => {
    this.cropper = cropper;
  }

  onCropperReady = () => {
    const {avatarList, avatarToEdit} = this.state;
    const {defaultPictureUrl} = this.props;

    const mask = document.createElement('img');
    mask.src = avatarMask;
    mask.id = 'cropper-mask';
    mask.style = `position: absolute;
      top: 0;
      pointer-events: none;`;
    this.cropper.cropBox.appendChild(mask);

    // Restore to the lastest cropper status if exist
    this.cropper.setData({
      ...avatarList[avatarToEdit].avatarPreviewStyle.cropper,
      scaleX: avatarList[avatarToEdit].avatarPreviewStyle.cropper.scale,
      scaleY: avatarList[avatarToEdit].avatarPreviewStyle.cropper.scale
    });

    if (defaultPictureUrl) {
      const newCropperState = update(
        this.state,
        {
          avatarList:
          {
            [avatarToEdit]:
            {
              avatarPreviewStyle:
              {
                croppedImage:
                {$set: this.cropper.getCroppedCanvas().toDataURL(MEMBER_PHOTO_MIME_TYPE)}
              }
            }
          }
        }
      );
      this.setState(newCropperState);
    }

    // Add mouse wheel event to scale cropper instead of default zoom function
    this.cropper.cropBox.addEventListener('wheel', event => {
      let newScale = this.cropper.imageData.scaleX;
      if (event.deltaY < 0) {
        newScale = newScale + MEMBER_PHOTO_SCALE_STEP > MEMBER_PHOTO_SCALE_MAX ?
          MEMBER_PHOTO_SCALE_MAX :
          newScale + MEMBER_PHOTO_SCALE_STEP;
        this.cropper.scale(newScale, newScale);
      }

      if (event.deltaY > 0) {
        newScale = newScale - MEMBER_PHOTO_SCALE_STEP < MEMBER_PHOTO_SCALE_MIN ?
          MEMBER_PHOTO_SCALE_MIN :
          newScale - MEMBER_PHOTO_SCALE_STEP;
        this.cropper.scale(newScale, newScale);
      }

      const newCropBoxState = update(
        this.state,
        {avatarList: {[this.state.avatarToEdit]: {avatarPreviewStyle: {cropper: {scale: {$set: newScale}}}}}}
      );
      this.setState(newCropBoxState);
    });
  }

  generateOnCropEndHandler = avatarName => _ => {
    const cropperData = this.cropper.getData(true);
    const newCropperState = update(
      this.state,
      {
        avatarList: {
          [avatarName]: {
            avatarPreviewStyle: {
              cropper: {
                x: {$set: cropperData.x},
                y: {$set: cropperData.y},
                width: {$set: cropperData.width},
                height: {$set: cropperData.height},
                scale: {$set: cropperData.scaleX},
                rotate: {$set: cropperData.rotate}
              },
              croppedImage: {$set: this.cropper.getCroppedCanvas().toDataURL(MEMBER_PHOTO_MIME_TYPE)}
            }
          }
        }
      }
    );
    this.setState(newCropperState);
  }

  zoomCropper = values => {
    const zoomScale = values.zoom;
    this.cropper.scale(zoomScale, zoomScale);
    this.generateOnCropEndHandler(this.state.avatarToEdit)(_);
  }

  generateRotatePictureHandler = isClockwise => event => {
    event.preventDefault();
    const {
      avatarToEdit,
      avatarList: {[avatarToEdit]: {avatarPreviewStyle: {cropper: {rotate}}}}
    } = this.state;
    const degrees = isClockwise ? 90 : -90;
    this.cropper.rotate(degrees);
    const updateRotation = update(this.state,
      {
        avatarList:
         {
           [avatarToEdit]:
            {
              avatarPreviewStyle:
               {
                 cropper:
                  {
                    rotate:
                    // reset rotation if photo rotates a full circle
                    {$set: rotate + degrees === 360 || rotate + degrees === -360 ? 0 : rotate + degrees}
                  }
               }
            }
         }
      }
    );
    this.setState(updateRotation);
    this.generateOnCropEndHandler(this.state.avatarToEdit)(_);
  };

  onChangeAvatar = (avatarName, loadEditModal) => event => {
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
          if (avatarList[avatarName].avatarPreviewStyle.originalImage) {
            window.URL.revokeObjectURL(avatarList[avatarName].avatarPreviewStyle.originalImage);
          }

          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            const updateAvatarURL = update(this.state,
              {
                avatarList: {
                  [avatarName]: {
                    avatarPreviewStyle: {
                      originalImage: {$set: base64data},
                      croppedImage: {$set: base64data}
                    }
                  }
                }
              });
            this.setState(updateAvatarURL);
          };
        }, MEMBER_PHOTO_MIME_TYPE);
      })
      .then(() => {
        // Open edit modal for the file user just uploaded
        if (loadEditModal) {
          loadEditModal(avatarName);
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
        isShowEditModal: {$set: false},
        avatarList: {
          [this.state.avatarToEdit]: {
            $set: {
              avatarPreviewStyle: {
                cropper: {
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotate: 0
                },
                originalImage: null,
                croppedImage: null
              },
              avatarFile: null,
              verifyStatus: null,
              isVerifying: false,
              errorMessage: null
            }
          }
        }
      });
    this.setState(deleteAvatar, () => {
      this.updatePictureCount();
    });
  }

  verifyPhoto = () => {
    const {
      avatarToEdit,
      avatarList: {[avatarToEdit]: {avatarFile, verifyStatus, avatarPreviewStyle: {croppedImage}}}
    } = this.state;
    const {member, defaultPictureUrl} = this.props;
    const resetErrorMessage = update(this.state,
      {
        isShowEditModal: {$set: false},
        avatarList: {[avatarToEdit]: {errorMessage: {$set: null}}}
      });

    this.setState(resetErrorMessage, () => {
      utils.convertCropperImage(croppedImage)
        .then(image => {
          // Reference from error: Upload Size Limit (90kb)
          // http://192.168.100.137/cloud/webserver/-/blob/master/src/models/errors.js#L85
          if (utils.getBase64Size(image, 'kb') > 90) {
            const updateErrorMessage = update(this.state,
              {
                avatarList: {
                  [avatarToEdit]: {
                    verifyStatus: {$set: false},
                    errorMessage: {$set: `${_('Cropped image has reached the size limit')}`}
                  }
                }
              });
            this.setState(updateErrorMessage);
          } else if (avatarFile || (defaultPictureUrl && croppedImage === defaultPictureUrl) || member) {
            // Verify photo if user uploads a new photo, photo was grabbed from event or existing photo was edited
            const updateIsVerifying = update(this.state,
              {avatarList: {[avatarToEdit]: {isVerifying: {$set: true}}}});
            this.setState(updateIsVerifying, () => {
              api.member.validatePicture(image)
                .then(() => {
                  const updateAvatarVerification = update(this.state,
                    {
                      avatarList: {
                        [avatarToEdit]: {
                          verifyStatus: {$set: true},
                          isVerifying: {$set: false},
                          errorMessage: {$set: null},
                          avatarPreviewStyle: {convertedImage: {$set: image}}
                        }
                      }
                    });
                  this.setState(updateAvatarVerification);
                })
                .catch(error => {
                  const updateAvatarVerification = update(this.state,
                    {
                      avatarList: {
                        [avatarToEdit]: {
                          verifyStatus: {$set: false},
                          isVerifying: {$set: false},
                          errorMessage: {$set: error.response.data.message.replace('Error: ', '').replace('Http400: ', '')}
                        }
                      }
                    });
                  this.setState(updateAvatarVerification);
                });
            });
          } else if (member && !verifyStatus) {
            // Photo was edited but restored back to original state, skip verification and reset error message
            const updateAvatarVerification = update(this.state,
              {
                avatarList: {
                  [avatarToEdit]: {
                    verifyStatus: {$set: true},
                    errorMessage: {$set: null}
                  }
                }
              });
            this.setState(updateAvatarVerification);
          }

          this.updatePictureCount();
        });
    });
  }

  onSubmitForm = ({errors, values}) => {
    const {avatarList} = this.state;
    const avatarListArray = Object.entries(avatarList);

    // Output error message if primary photo is missing
    if (!avatarList.Primary.avatarPreviewStyle.croppedImage) {
      const updateErrorMessage = update(this.state,
        {avatarList: {Primary: {errorMessage: {$set: `${_('Photo is required')}`}}}});
      this.setState(updateErrorMessage);
      return;
    }

    // Fallback check if photos have failed verification, is still verifying, not yet verified, or there are Formik validation errors
    if (
      avatarListArray.filter(avatar => Boolean(avatar[1].isVerifying)).length ||
      avatarListArray.some(avatar => avatar[1].verifyStatus === false) ||
      avatarListArray.some(avatar => (avatar[1].verifyStatus === null && avatar[1].avatarFile)) ||
      !utils.isObjectEmpty(errors)
    ) {
      return;
    }

    const data = {...values};
    const {member, onSubmitted} = this.props;
    const tasks = [];
    avatarListArray.forEach((item, index) => {
      const {avatarPreviewStyle: {originalImage, croppedImage, convertedImage}} = item[1];
      if (member && croppedImage && croppedImage === originalImage) {
        // The user didn't modify the picture.
        tasks.push(member.pictures[index]);
      } else if (convertedImage) {
        tasks.push(convertedImage);
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
  };

  formRender = ({errors, touched, values, validateForm}) => {
    const {isApiProcessing, onHide} = this.props;
    const {
      isShowEditModal,
      isShowConfirmModal,
      isFormTouched,
      avatarList,
      avatarToEdit,
      avatarList: {[avatarToEdit]: {avatarPreviewStyle}},
      preEditState,
      remainingPictureQuota
    } = this.state;
    const {croppedImage: primaryBackground} = this.state.avatarList.Primary.avatarPreviewStyle;
    const errorMessages = Object.entries(avatarList).filter(item => Boolean(item[1].errorMessage));
    const isOverPhotoLimit = remainingPictureQuota <= 0 && remainingPictureQuota !== null;
    return (
      <Form>
        <FormikEffect onChange={this.onChangeFormValues}/>
        <div className="modal-body">
          <div className="multi-photo-uploader">
            <div className="container d-flex flex-row justify-content-between">
              {Object.entries(avatarList).map(avatar => {
                const {
                  verifyStatus,
                  isVerifying,
                  avatarPreviewStyle: {croppedImage}
                } = avatar[1];
                return (
                  <div key={avatar[0]} className={classNames('individual-item d-flex flex-column')}>
                    <div
                      id="photo-wrapper"
                      className={classNames(
                        'photo-wrapper',
                        {'has-background': croppedImage},
                        {
                          // Allow upload if it is Primary or Primary photo exists
                          available: ((avatar[0] === 'Primary') || primaryBackground) &&
                          // Allow upload if remaining picture quota is not at limit based on FR license type
                                     (croppedImage || remainingPictureQuota > 0 || remainingPictureQuota === null)
                        },
                        {'failed-check': verifyStatus === false}
                      )}
                      style={{
                        width: this.listWrapperSize,
                        height: this.listWrapperSize
                      }}
                    >
                      <i className={classNames('fas fa-pen fa-lg fa-fw', {'d-none': !croppedImage})}/>
                      { croppedImage ?
                        (
                          // Display photo preview and edit button for existing photo
                          <>
                            <div
                              className={classNames('avatar-img', {'is-verifying': isVerifying})}
                              style={{
                                backgroundImage: `url("${croppedImage}")`,
                                width: this.listWrapperSize,
                                height: this.listWrapperSize
                              }}
                              onClick={() => {
                                this.onShowEditModal(avatar[0]);
                              }}
                            />
                            <div
                              className={classNames('loading-dots', {'d-none': !isVerifying})}
                              style={{
                                width: this.listWrapperSize,
                                height: this.listWrapperSize
                              }}
                            >
                              <div className="spinner">
                                <div className="double-bounce1"/>
                                <div className="double-bounce2"/>
                              </div>
                            </div>
                          </>
                        ) : (
                          // Display upload area for new photo
                          <CustomTooltip
                            show={((avatar[0] !== 'Primary') && !primaryBackground) || isOverPhotoLimit}
                            title={isOverPhotoLimit ? _('Photo Limit Reached') : _('Upload Primary First')}
                          >
                            <label className="btn">
                              <i className="fas fa-plus"/>
                              <input
                                disabled={((avatar[0] !== 'Primary') && !primaryBackground) || isOverPhotoLimit}
                                className="d-none"
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={this.onChangeAvatar(avatar[0], this.onShowEditModal)}
                              />
                            </label>
                          </CustomTooltip>

                        )}
                    </div>
                    <span>{avatar[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Error message from photo validation */}
          {errorMessages.length !== 0 && errorMessages.map(item => {
            return (
              <p key={item[0]} className={classNames('text-size-14 mb-1', 'text-danger')}>
                <i className="fas fa-exclamation-triangle mr-1"/>
                {`${_(item[0])}: ${_(item[1].errorMessage)}`}
              </p>
            );
          })}

          <hr/>
          <div className="form-group">
            <label>{_('Name')}</label>
            <Field
              name="name"
              type="text"
              placeholder={_('Enter Your Name')}
              maxLength={MemberSchema.name.max}
              className={classNames('form-control', {'is-invalid': errors.name && touched.name})}
            />
            <ErrorMessage component="div" name="name" className="invalid-feedback"/>
          </div>
          <div className="form-group">
            <label>{_('Organization')}</label>
            <Field
              name="organization"
              type="text"
              placeholder={_('Enter Your Organization')}
              maxLength={MemberSchema.organization.max}
              className={classNames('form-control', {'is-invalid': errors.organization && touched.organization})}
            />
            <ErrorMessage component="div" name="organization" className="invalid-feedback"/>
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
            <ErrorMessage component="div" name="note" className="invalid-feedback"/>
          </div>
        </div>
        <div className="modal-footer flex-column">
          <div className="form-group w-100 mx-0">
            <button
            // disable if api is processing, photo verification errors or photos are verifying
              disabled={
                isApiProcessing ||
                !(errorMessages.length === 0) ||
                Object.entries(avatarList).filter(item => Boolean(item[1].isVerifying)).length
              }
              type="button"
              className="btn btn-primary btn-block rounded-pill"
              onClick={() => {
                // Manually trigger validate form for synchronous error messages
                touched.name = true;
                validateForm().then(errors => {
                  this.onSubmitForm({
                    errors,
                    values
                  });
                });
              }}
            >
              {this.props.member ? _('Confirm') : _('New')}
            </button>
          </div>
          <button
            className="btn btn-info btn-block m-0 rounded-pill"
            type="button"
            onClick={isFormTouched || preEditState || isApiProcessing ? this.onShowConfirmModal : onHide}
          >
            {_('Close')}
          </button>
        </div>
        {/* Close modal confirmation */}
        <CustomNotifyModal
          backdrop="static"
          isShowModal={isShowConfirmModal}
          modalTitle={_('Member')}
          modalBody={_('Are you sure you want to close this window? Any changes you have made will be lost.')}
          onHide={this.onHideConfirmModal}
          onConfirm={() => {
            this.onHideConfirmModal();
            onHide();
          }}
        />
        {/* Edit photo modal */}
        <Modal
          autoFocus={false}
          show={isShowEditModal}
          className="edit-modal"
          backdrop="static"
          onHide={this.onHideEditModalAndRevertChanges}
        >
          <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
            <Modal.Title as="h5">{_('Photo Editor')}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="avatar-uploader d-flex flex-column align-items-center">
              <label ref={this.avatarWrapperRef} className="avatar-wrapper" id="avatar-wrapper">
                <Cropper
                  src={avatarPreviewStyle.originalImage}
                  // Depends on modal width and style container to 16:9 ratio
                  style={{height: 300}}
                  // Cropper.js options
                  initialAspectRatio={1}
                  aspectRatio={1}
                  viewMode={2}
                  dragMode="move"
                  toggleDragModeOnDblclick={false}
                  zoomOnTouch={false}
                  minCropBoxWidth={120}
                  autoCropArea={1}
                  cropend={this.generateOnCropEndHandler(avatarToEdit)}
                  zoom={event => event.preventDefault()}
                  ready={this.onCropperReady}
                  onInitialized={this.onCropperInit}
                />
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
                      step={MEMBER_PHOTO_SCALE_STEP}
                      min={MEMBER_PHOTO_SCALE_MIN}
                      max={MEMBER_PHOTO_SCALE_MAX}
                      onChangeInput={() => this.zoomCropper(values)}
                    />
                  </div>
                </div>
                <i className="far fa-image fa-fw fa-lg ml-2"/>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {/* Hide delete button if it is Primary photo */}
            { avatarToEdit !== 'Primary' && (
              <button className="btn btn-danger btn-block rounded-pill my-0" type="button" onClick={this.onDeleteAvatar}>
                {_('Delete')}
              </button>
            )}
            <div>
              <label className="btn btn-outline-primary btn-block rounded-pill my-0 mr-2">
                <input className="d-none" type="file" accept="image/png,image/jpeg" onChange={this.onChangeAvatar(avatarToEdit)}/>
                {_('Change Photo')}
              </label>
              <button className="btn btn-primary btn-block rounded-pill my-0" type="button" onClick={this.verifyPhoto}>
                {_('Save')}
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </Form>
    );
  };

  render() {
    const {isApiProcessing, isShowModal, member, onHide} = this.props;
    const {isFormTouched, preEditState} = this.state;

    return (
      <Modal
        keyboard={false}
        autoFocus={false}
        show={isShowModal}
        className="member-modal"
        onHide={isApiProcessing || isFormTouched || preEditState ? this.onShowConfirmModal : onHide}
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
