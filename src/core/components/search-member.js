import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import React from 'react';
import _ from '../../languages';
import CustomTooltip from './tooltip';
import api from '../apis/web-api';

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

  state={members: null}

  generateInitialValues = memberName => {
    return {keyword: memberName || ''};
  };

  onSearch = values => {
    this.getMembers(values.keyword);
  };

  addToMember = eventPictureUrl => {
    console.log('added photo', eventPictureUrl);
  };

  getMembers = keyword => api.member.getMembers({
    group: null,
    keyword: keyword,
    index: null,
    sort: null
  }).then(response => this.setState({members: response.data}));

  render() {
    const {memberName, eventPictureUrl, isApiProcessing, isShowModal, onHide} = this.props;
    const {members} = this.state;
    return (
      <Modal
        keyboard={false}
        autoFocus={false}
        show={isShowModal}
        className="events-search-member-modal"
        onHide={onHide}
      >
        <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
          <Modal.Title as="h5">{_('Add Photo')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-12 mb-5">
            <Formik
              initialValues={this.generateInitialValues(memberName)}
              onSubmit={this.onSearch}
            >
              <Form>
                <div className="form-row mt-4">
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
          <div className="col-12 mb-5">
            <table className="table custom-style" style={{tableLayout: 'fixed'}}>
              <thead>
                <tr className="shadow">
                  <th className="text-center" style={{width: '30%'}}>{_('User Picture')}</th>
                  <th style={{width: '50%'}}>
                    <a href="#name">{_('Name')}</a>
                  </th>
                  <th style={{width: '20%'}}>{_('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {
                  /* Empty Search Message */
                  members && !members.items.length && (
                    <tr>
                      <td className="text-size-20 text-center" colSpan="10">
                        <i className="fas fa-frown-open fa-fw text-dark"/> {_('Can\'t find any member.')}
                      </td>
                    </tr>
                  )
                }
                {
                  members && members.items.map((member, index) => {
                    const tdClass = classNames({
                      'border-bottom':
                index >= members.items.length - 1
                    });

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
                          <CustomTooltip title={_('Edit Member: {0}', [member.name])}>
                            <button
                              className="btn btn-link"
                              type="button"
                              onClick={() => {
                                this.addToMember(eventPictureUrl);
                              }}
                            >
                              <i className="fas fa-plus fa-lg fa-fw"/>
                            </button>
                          </CustomTooltip>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default SearchMember;
