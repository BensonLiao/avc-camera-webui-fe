import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import React from 'react';
import _ from '../../languages';
import CustomTooltip from './tooltip';
import api from '../apis/web-api';
import CustomNotifyModal from './custom-notify-modal';
import update from 'immutability-helper';

class SearchMember extends React.PureComponent {
  static propTypes = {
    memberName: PropTypes.string,
    eventPictureUrl: PropTypes.string,
    isShowModal: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    isApiProcessing: PropTypes.bool.isRequired
  };

  static defaultProps = {
    memberName: null,
    eventPictureUrl: null
  };

  state={
    members: null,
    isShowApiProcessModal: false,
    maxIndex: 0,
    keyword: null,
    // for lazy loading get member api
    isFetching: false,
    isVerifying: true,
    verifyStatus: false,
    errorMessage: 'Test Error Message Here...'
  }

  constructor() {
    super();
    // used to calculate list window height for scroll listener
    this.containerRef = React.createRef();
  }

  generateInitialValues = memberName => {
    return {keyword: memberName || ''};
  };

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  onSearch = values => {
    this.setState({
      keyword: values.keyword,
      members: null
    });

    // bind scroll event listner
    this.containerRef.addEventListener('scroll', () => {
      this.handleScroll();
    });

    this.getMembers(values.keyword)
      .then(response => this.setState({
        isFetching: false,
        members: response.data,
        maxIndex: Math.ceil(response.data.total / response.data.size)
      }));
  };

  getMembers = (keyword = null, index = 0) => new Promise((resolve, _) => {
    resolve(
      this.setState({isFetching: true}));
  })
    .then(() => (
      api.member.getMembers({
        group: null,
        keyword: keyword,
        index: index,
        sort: null
      })
    ))

  handleScroll = () => {
    // skip if user hasn't scrolled to the bottom of list or api is still fetching
    if (Math.ceil(this.containerRef.offsetHeight + this.containerRef.scrollTop) !== this.containerRef.scrollHeight || this.state.isFetching) {
      return;
    }

    const {members, maxIndex} = this.state;
    // check if there are more pages to laod
    if (members && (members.index) < maxIndex) {
      this.appendMemberList(members.index + 1);
    }
  };

  appendMemberList = index => {
    this.getMembers(this.state.keyword, index)
      .then(response => {
        const {members} = this.state;
        const updateState = update(this.state, {
          members: {
            // increase current page by 1
            index: {$set: members.index + 1},
            // join previous member list with new list
            items: {$set: members ? [...members.items, ...response.data.items] : response.data.items}
          },
          isFetching: {$set: false}
        });

        this.setState(updateState);
      });
  }

  verifyPhoto = photo => {
    this.setState({
      isVerifying: true,
      verifyStatus: false
    }, () => {
      api.member.validatePicture(photo)
        .then(() => {
          this.setState({verifyStatus: true});
        })
        .catch(error => {
          this.setState({
            verifyStatus: false,
            errorMessage: error.response.data.message.replace('Error: ', '').replace('Http400: ', '')
          });
        })
        .finally(() => {
          // hide verifying spinners regardless of success or error
          this.setState({isVerifying: false});
        });
    });
  }

  addToMember = ({id, eventPictureUrl}) => {
    // hide search modal
    this.props.onHide();
    // show api processing modal and reset search results
    this.setState({
      isShowApiProcessModal: true,
      members: null
    }, () => {
      api.member.addPhoto({
        id,
        picture: eventPictureUrl
      }).finally(() => {
        this.hideApiProcessModal();
      });
    });
  };

  render() {
    const {memberName, eventPictureUrl, isApiProcessing, isShowModal, onHide} = this.props;
    const {members, maxIndex, isFetching, isVerifying, verifyStatus, errorMessage} = this.state;
    console.log(this.state);
    return (
      <>
        <Modal
          keyboard={false}
          backdrop="static"
          autoFocus={false}
          show={isShowModal}
          className="events-search-member-modal"
          onEntered={() => {
            this.verifyPhoto(eventPictureUrl);
          }}
          onHide={() => {
            this.setState({members: null});
            onHide();
          }}
        >
          <Modal.Header closeButton={!isFetching} className="d-flex justify-content-between align-items-center">
            <Modal.Title as="h5">{_('Add Photo To Member')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-row justify-content-between align-items-end mb-4 pl-5 pr-3">
              <div className="d-flex flex-row align-items-end">
                <div className="event-photo">
                  <img
                    src={eventPictureUrl}
                    className={classNames(
                      'rounded-circle',
                      {'failed-check': verifyStatus === false && !isVerifying}
                    )}
                  />
                  <div className={classNames(
                    'loading-dots',
                    {'d-none': !isVerifying}
                  )}
                  >
                    <div className="spinner">
                      <div className="double-bounce1"/>
                      <div className="double-bounce2"/>
                    </div>
                  </div>
                </div>
                { errorMessage && (
                  <p className="text-size-14 mb-1 text-danger validate-error-message">
                    <i className="fas fa-exclamation-triangle mr-1"/>
                    {`${_(errorMessage)}`}
                  </p>
                )}
              </div>
              <Formik
                initialValues={this.generateInitialValues(memberName)}
                onSubmit={this.onSearch}
              >
                <Form className="d-flex flex-row">
                  <div className="px-0">
                    <Field name="keyword" className="form-control" type="search" placeholder={_('Enter keywords')}/>
                  </div>
                  <div className="px-0 ml-3">
                    <button
                      className="btn btn-outline-primary rounded-pill px-3"
                      type="submit"
                      // allow search during photo verification
                      disabled={isApiProcessing && !isVerifying}
                    >
                      <i className="fas fa-search fa-fw"/> {_('Search')}
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
            <div
              ref={element => {
                this.containerRef = element;
              }}
              className="col-12 mb-5"
              style={{
                maxHeight: '550px',
                overflowY: 'scroll'
              }}
            >
              <table className="table custom-style" style={{tableLayout: 'fixed'}}>
                <thead>
                  <tr className="shadow">
                    <th style={{width: '40%'}}>{_('User Picture')}</th>
                    <th style={{width: '40%'}}>{_('Name')}</th>
                    <th style={{width: '20%'}}>{_('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                  /* Inital message */
                    !members && !isFetching && (
                      <tr>
                        <td className="text-size-20 text-center pt-3" colSpan="10">
                          <i className="fas fa-search fa-fw"/> {_('Please Search Keyword')}
                        </td>
                      </tr>
                    )
                  }
                  {
                  /* Empty search message */
                    members && !members.items.length && members.items.length === 0 && (
                      <tr>
                        <td className="text-size-20 text-center" colSpan="10">
                          <i className="fas fa-frown-open fa-fw text-dark"/> {_('Can\'t find any member.')}
                        </td>
                      </tr>
                    )
                  }
                  {
                    members && members.items.map((member, index) => {
                      const tdClass = classNames({'border-bottom': index >= members.items.length - 1});

                      return (
                        <tr key={member.id}>
                          <td className={classNames(tdClass)}>
                            {member.pictures.map((picture, index) => {
                              // declaration to bypass eslint `no index in key`
                              const uniqueKey = member.id + index;
                              return (
                                <img
                                  key={uniqueKey}
                                  className="rounded-circle"
                                  src={`data:image/jpeg;base64,${picture}`}
                                />
                              );
                            })}
                          </td>
                          <td className={tdClass}>
                            <CustomTooltip placement="top-start" title={member.name}>
                              <div>
                                {member.name}
                              </div>
                            </CustomTooltip>
                          </td>
                          <td className={classNames('text-left group-btn', tdClass)}>
                            <CustomTooltip title={
                              isVerifying ?
                                _('Verifying Photo') :
                                verifyStatus ?
                                  (member.pictures.length >= 5 ?
                                    _('Photo Limit Reached') :
                                    _('Add to {0}', [member.name])) :
                                  _('Invalid Photo')
                            }
                            >
                              <div>
                                <button
                                  disabled={member.pictures.length >= 5 || verifyStatus === false}
                                  className="btn btn-link"
                                  type="button"
                                  onClick={() => {
                                    this.addToMember({
                                      id: member.id,
                                      eventPictureUrl
                                    });
                                  }}
                                >
                                  {_('Add')}
                                </button>
                              </div>
                            </CustomTooltip>
                          </td>
                        </tr>
                      );
                    })
                  }
                  {
                    // Loading
                    ((members && isFetching) || isFetching) && (
                      <tr>
                        <td className="loading" colSpan="10">
                          <div className="spinner">
                            <div className="bounce1"/>
                            <div className="bounce2"/>
                            <div className="bounce3"/>
                          </div>
                        </td>
                      </tr>
                    )
                  }
                  {
                  // End of search
                    members && members.index === maxIndex && members.items.length !== 0 && (
                      <tr>
                        <td className="text-size-20 text-center" colSpan="10">
                          {_('End of Result')}
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </div>
          </Modal.Body>
        </Modal>

        {/* add photo api processing modal */}
        <CustomNotifyModal
          modalType="process"
          backdrop="static"
          isShowModal={this.state.isShowApiProcessModal}
          modalTitle={_('Updating Member')}
          onHide={this.hideApiProcessModal}
        />
      </>
    );
  }
}

export default SearchMember;
