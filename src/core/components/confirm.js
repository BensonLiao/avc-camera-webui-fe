import React, {useState, useContext, useRef} from 'react';
import PropTypes from 'prop-types';
import CustomNotifyModal from './custom-notify-modal';

const ConfirmContext = React.createContext({});

/**
 * Confirmation modal dialog with promise resolve
 *
 * @prop {{children: JSX.Element}} children - Pass through children node
 * @returns {Component}
 *
 * @example
 *    import {useConfirm} from 'confirm'
 *    const confirm = useConfirm()
 *
 *    const handleDelete = () => {
 *      confirm.open({title: 'Delete Member', body: 'Are you sure?'})
 *      .then(response => {
 *        if (response) {
 *          // ...confirm action
 *        }
 *      })
 *    }
 *
 *    // -- or use async await --
 *
 *    const handleDelete = async () => {
 *      const result = await confirm.open({title: 'Delete Member', body: 'Are you sure?'})
 *      result && // ...confirm action
 *    }
 */
const ConfirmContextProvider = ({children}) => {
  const [isShow, setIsShow] = useState(false);
  const [confirmProps, setConfirmProps] = useState({
    title: '',
    body: ''
  });
  const resolve = useRef();

  /**
   * Cancel: Returns `false` on resolve
   * @returns {void}
   */
  const handleCancel = () => {
    setIsShow(false);
    resolve?.current(false);
  };

  /**
   * Confirm: Returns `true` on resolve
   * @returns {void}
   */
  const handleConfirm = () => {
    setIsShow(false);
    resolve?.current(true);
  };

  /**
   * Show confirm modal with custom title and body
   * @param {String} title - Modal title
   * @param {String | Array} body - Modal body, every array item will be its own line
   * @returns {Promise} - Returns `true` or `false` depending on user action
   */
  const openConfirmationModal = ({title, body}) => {
    setConfirmProps({
      title,
      body
    });
    setIsShow(true);
    return new Promise(res => {
      resolve.current = res;
    });
  };

  return (
    <ConfirmContext.Provider
      value={{open: openConfirmationModal}}
    >
      {children}
      <CustomNotifyModal
        backdrop="static"
        isShowModal={isShow}
        modalTitle={confirmProps.title}
        modalBody={confirmProps.body}
        onHide={handleCancel}
        onConfirm={handleConfirm}
      />
    </ConfirmContext.Provider>
  );
};

ConfirmContextProvider.propTypes = {children: PropTypes.node.isRequired};

export const useConfirm = () => useContext(ConfirmContext);
export default ConfirmContextProvider;
