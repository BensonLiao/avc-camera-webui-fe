import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import React from 'react';
import _ from '../../languages';
import api from '../apis/web-api';
import CustomNotifyModal from './custom-notify-modal';
import CustomTooltip from './tooltip';
import notify from '../notify';
import utils from '../utils';

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
    keyword: null,
    // for lazy loading get member api
    isFetching: false,
    isVerifying: true,
    verifyStatus: false,
    errorMessage: null,
    // base64 of event photo
    convertedPicture: null
  }

  generateInitialValues = memberName => {
    return {keyword: memberName || ''};
  };

  hideApiProcessModal = () => {
    this.setState({isShowApiProcessModal: false});
  };

  onSearch = values => {
    const keyword = values.keyword || values.keyword === '' ? values.keyword : this.state.keyword;
    const index = values.keyword || values.keyword === '' ? null : values;
    this.setState(prevState => ({
      ...prevState,
      keyword: keyword,
      members: null
    }), () => {
      this.getMembers(keyword, index)
        .then(response => this.setState({
          isFetching: false,
          members: response.data
        }));
    });
  };

  getMembers = (keyword, index = null) => new Promise((resolve, _) => {
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

  verifyPhoto = photo => {
    this.setState({
      isVerifying: true,
      verifyStatus: false
    }, () => {
      utils.convertPicture(photo).then(data => {
        api.member.validatePicture(data)
          .then(() => {
            this.setState({
              verifyStatus: true,
              convertedPicture: data
            });
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
    });
  }

  addToMember = ({member, convertedPicture}) => {
    // hide search modal
    this.props.onHide();
    // show api processing modal and reset search results
    this.setState({
      isShowApiProcessModal: true,
      members: null
    }, () => {
      api.member.addPhoto({
        id: member.id,
        picture: convertedPicture
      }).then(() => {
        notify.showSuccessNotification({
          title: _('Setting Success'),
          message: _('Added Photo to {0} Successfully!', [member.name])
        });
      }).finally(() => {
        this.hideApiProcessModal();
      });
    });
  };

  render() {
    const {memberName, eventPictureUrl, isApiProcessing, isShowModal, onHide} = this.props;
    const {members, isFetching, isVerifying, verifyStatus, errorMessage, convertedPicture} = this.state;
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
            this.setState({
              members: null,
              isVerifying: false,
              errorMessage: null
            });
            onHide();
          }}
        >
          <Modal.Header closeButton={!(isApiProcessing || isFetching || isVerifying)} className="d-flex justify-content-between align-items-center">
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
                      {'failed-check': verifyStatus === false && !isVerifying && errorMessage}
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
                    <Field name="keyword" className="form-control" type="search" placeholder={_('Enter Keyword')}/>
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
              <table className="table custom-style mb-4" style={{tableLayout: 'fixed'}}>
                <thead>
                  <tr className="shadow">
                    <th style={{width: '40%'}}>{_('User Picture')}</th>
                    <th style={{width: '40%'}}>{_('Name')}</th>
                    <th style={{width: '20%'}}>{_('Actions')}</th>
                  </tr>
                </thead>
                <tbody>

                  {/* Inital message  */}
                  {!members && !isFetching && (
                    <tr>
                      <td className="text-size-16 text-center pt-3" colSpan="10">
                        <i className="fas fa-search fa-fw"/> {_('Enter Keyword For Search')}
                      </td>
                    </tr>
                  )}

                  {/* Empty search message */}
                  { members && !members.items.length && members.items.length === 0 && (
                    <tr>
                      <td className="text-size-16 text-center" colSpan="10">
                        <i className="fas fa-exclamation-triangle fa-fw text-dark"/> {_('Can\'t find any data.')}
                      </td>
                    </tr>
                  )}

                  {/* Search result list */}
                  {members && members.items.map((member, index) => {
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
                                    member: member,
                                    convertedPicture
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
                  })}

                  {/* Loading indicator */}
                  {((members && isFetching) || isFetching) && (
                    <tr>
                      <td className="loading" colSpan="10">
                        <div className="spinner">
                          <div className="bounce1"/>
                          <div className="bounce2"/>
                          <div className="bounce3"/>
                        </div>
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>

              {/* Custom pagination component */}
              { members && members.items.length !== 0 && (
                <Pagination
                  index={members.index}
                  size={members.size}
                  total={members.total}
                  itemQuantity={members.items.length}
                  onSearch={this.onSearch}
                />
              )}

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

class Pagination extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    itemQuantity: PropTypes.number.isRequired,
    onSearch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.maxGotoIndex = Math.ceil(this.props.total / this.props.size);
  }

  state = {gotoIndex: 0};

   onChangeGotoIndex = event => {
     let validateValue = event.currentTarget.value;
     if (Number(event.currentTarget.value)) {
       validateValue = event.currentTarget.value >= this.maxGotoIndex ?
         this.maxGotoIndex :
         event.currentTarget.value;
       validateValue = validateValue < 1 ? 1 : validateValue;
       this.setState({gotoIndex: validateValue - 1});
     }
   }

   onKeyPress = event => {
     if (event.charCode === 13) {
       this.props.onSearch(this.state.gotoIndex);
     }
   }

   render() {
     const {index, size, total, itemQuantity, onSearch} = this.props;

     const numbers = [];
     const hasPrevious = index > 0;
     const hasNext = total > (index + 1) * size;
     const startItem = (index * size) + 1;
     const endItem = startItem + itemQuantity - 1;
     const {gotoIndex} = this.state;
     for (let idx = index - 3; idx < index + 3; idx += 1) {
       if (idx < 0 || idx >= this.maxGotoIndex) {
         continue;
       }

       numbers.push({
         key: `pagination-${idx}`,
         pageNumber: idx + 1,
         onClick: () => {
           onSearch(idx);
         },
         className: classNames('page-item', {disabled: idx === index})
       });
     }

     return (
       <div className="col-12">
         <nav
           className="d-flex justify-content-center align-items-center"
           style={{
             padding: '0px 2px',
             height: '36px'
           }}
         >
           <p className="text-size-14 text-muted mb-0 mr-auto invisible">
             {_('{0}-{1} items. Total: {2}', [startItem, endItem, total])}
           </p>
           <ul className="pagination my-auto">
             <li className={classNames('page-item', {disabled: !hasPrevious})}>
               <a
                 className="page-link prev"
                 tabIndex={0}
                 onClick={() => {
                   onSearch(index - 1);
                 }}
               >
                &laquo;
               </a>
             </li>
             {
               numbers.map(number => (
                 <li key={number.key} className={number.className}>
                   <a
                     className="page-link"
                     tabIndex={0}
                     onClick={number.onClick}
                   >
                     {number.pageNumber}
                   </a>
                 </li>
               ))
             }
             <li className={classNames('page-item', {disabled: !hasNext})}>
               <a
                 className="page-link next"
                 tabIndex={0}
                 onClick={hasNext ? () => {
                   onSearch(index + 1);
                 } : null}
               >
                &raquo;
               </a>
             </li>
             <li className="page-item">
               <input
                 type="number"
                 className="page-input"
                 min={1}
                 max={this.maxGotoIndex}
                 onChange={this.onChangeGotoIndex}
                 onKeyPress={this.onKeyPress}
               />
             </li>
             <li className="page-item">
               <a
                 className="page-link go"
                 tabIndex={0}
                 onClick={() => {
                   onSearch(gotoIndex);
                 }}
               >
                Go
               </a>
             </li>
           </ul>
           <p className="text-size-14 text-muted mb-0 ml-auto">
             {_('{0}-{1} items. Total: {2}', [startItem, endItem, total])}
           </p>
         </nav>
       </div>
     );
   }
}

export default SearchMember;
