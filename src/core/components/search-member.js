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
    isFetching: false
  }

  constructor() {
    super();
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
    this.containerRef.addEventListener('scroll', () => {
      this.handleScroll();
    });
    this.containerRef.scrollTo(0, 0);
    this.getMembers(values.keyword)
      .then(response => this.setState({
        members: response.data,
        maxIndex: Math.ceil(response.data.total / response.data.size)
      }));
  };

  getMembers = (keyword = null, index = 0) => new Promise((resolve, _) => resolve(
    api.member.getMembers({
      group: null,
      keyword: keyword,
      index: index,
      sort: null
    })
  ))

  handleScroll = () => {
    if (Math.ceil(this.containerRef.offsetHeight + this.containerRef.scrollTop) !== this.containerRef.scrollHeight || this.state.isFetching) {
      return;
    }

    const {members, maxIndex} = this.state;
    if (members && (members.index) < maxIndex) {
      this.setState({isFetching: true}, () => {
        this.appendMemberList(members.index + 1);
      });
    }
  };

  appendMemberList = index => {
    this.getMembers(this.state.keyword, index)
      .then(response => {
        const {members} = this.state;
        const updateState = update(this.state, {
          members: {
            index: {$set: members.index + 1},
            items: {$set: members ? [...members.items, ...response.data.items] : response.data.items}
          },
          isFetching: {$set: false}
        });

        this.setState(updateState);
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
    const {members, maxIndex, isFetching} = this.state;
    return (
      <>
        <Modal
          keyboard={false}
          autoFocus={false}
          show={isShowModal}
          className="events-search-member-modal"
          onHide={onHide}
        >
          <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
            <Modal.Title as="h5">{_('Add Photo To Member')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-12 mb-3">
              <Formik
                initialValues={this.generateInitialValues(memberName)}
                onSubmit={this.onSearch}
              >
                <Form>
                  <div className="form-row">
                    <div className="col-auto px-0">
                      <Field name="keyword" className="form-control" type="search" placeholder={_('Enter keywords')}/>
                    </div>
                    <div className="col-auto px-0 ml-3">
                      <button className="btn btn-outline-primary rounded-pill px-3" type="submit" disabled={isApiProcessing}>
                        <i className="fas fa-search fa-fw"/> {_('Search')}
                      </button>
                    </div>
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
                    <th className="text-center" style={{width: '30%'}}>{_('User Picture')}</th>
                    <th style={{width: '50%'}}>{_('Name')}</th>
                    <th style={{width: '20%'}}>{_('Add')}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                  /* Inital message */
                    !members && (
                      <tr>
                        <td className="text-size-20 text-center" colSpan="10">
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
                          <td className={classNames('text-center', tdClass)}>
                            <img
                              className="rounded-circle"
                              style={{height: '56px'}}
                              src={`data:image/jpeg;base64,${member.pictures[0]}`}
                            />
                          </td>
                          <td className={tdClass}>
                            <CustomTooltip placement="top-start" title={member.name}>
                              <div>
                                {member.name}
                              </div>
                            </CustomTooltip>
                          </td>
                          <td className={classNames('text-left group-btn', tdClass)}>
                            <CustomTooltip title={member.pictures.length >= 5 ? _('Photo Limit Reached') : _('Add to {0}', [member.name])}>
                              <div>
                                <button
                                  disabled={member.pictures.length >= 5}
                                  className="btn btn-link"
                                  type="button"
                                  onClick={() => {
                                    this.addToMember({
                                      id: member.id,
                                      eventPictureUrl
                                    });
                                  }}
                                >
                                  <i className="fas fa-plus fa-lg fa-fw"/>
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
                    members && isFetching && (
                      <tr>
                        <td colSpan="10">
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
                    members && members.index === maxIndex && (
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
