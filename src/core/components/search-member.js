import classNames from 'classnames';
import {Formik, Form, Field} from 'formik';
import {getRouter, Link} from 'capybara-router';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import React from 'react';
import _ from '../../languages';
import CustomTooltip from './tooltip';
// import api from '../../../core/apis/web-api';

const SearchMember = props => {
  const {name, members, isApiProcessing, isShowModal, onHide} = props;

  const searchMemberInitialValues = {keyword: name || ''};

  return (
    <Modal
      keyboard={false}
      autoFocus={false}
      show={isShowModal}
      className="member-modal"
      onHide={onHide}
    >
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <Modal.Title as="h5">{_('Add Photo')}</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={searchMemberInitialValues}
        onSubmit={onSubmit}
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
              !members.items.length && (
                <tr>
                  <td className="text-size-20 text-center" colSpan="10">
                    <i className="fas fa-frown-open fa-fw text-dark"/> {_('Can\'t find any member.')}
                  </td>
                </tr>
              )
            }
            {
              members.items.map((member, index) => {
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
                        <Link
                          className="btn btn-link"
                          // to={{
                          //   name: 'web.users.members.details',
                          //   params: {
                          //     ...params,
                          //     memberId: member.id
                          //   }
                          // }}
                        >
                          <i className="fas fa-pen fa-lg fa-fw"/>
                        </Link>
                      </CustomTooltip>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>

    </Modal>
  );
};

/**
   * Generate the handler to change filter.
   * @param {String} value The filter value. Pass null to remove the param.
   * @param {Number} index Page number
   * @returns {Function} The handler.
   */
const onSubmit = (value, index) => event => {
  event.preventDefault();
  getRouter().go({
    name: this.currentRoute.name,
    params: {
      index: index || undefined,
      keyword: value
    }
  });
};

SearchMember.propTypes = {
  name: PropTypes.string,
  members: PropTypes.shape({
    index: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      organization: PropTypes.string,
      groupId: PropTypes.string,
      note: PropTypes.string,
      pictures: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
    }).isRequired).isRequired
  }),
  isShowModal: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  isApiProcessing: PropTypes.bool.isRequired
};

SearchMember.defaultProps = {
  name: null,
  members: []
};

export default SearchMember;
