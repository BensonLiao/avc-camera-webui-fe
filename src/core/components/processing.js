import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import CustomNotifyModal from './custom-notify-modal';

const ProcessingContext = React.createContext({});

/**
 * API processing modal dialog
 *
 * @prop {{children: JSX.Element}} children - Pass through children node
 * @returns {Component}
 *
 * @example
 *    import {useProcessing} from 'processing'
 *    const processing = useProcessing()
 *
 *    const handleDelete = async () => {
 *      processing.start({title: 'Deleting user'});
 *      await api().delete; // call delete api
 *      processing.done();
 *    }
 */
const ProcessingContextProvider = ({children}) => {
  const [isShow, setIsShow] = useState(false);
  const [processingTitle, setProcessingTitle] = useState('');

  /**
   * Show APi processing modal with custom title
   * @param {String} title - Modal title
   * @returns {void}
   */
  const openApiProcessingModal = ({title}) => {
    setProcessingTitle(title);
    setIsShow(true);
  };

  /**
   * Hide APi processing modal with custom title
   * @returns {void}
   */
  const closeApiProcessingModal = () => setIsShow(false);

  return (
    <ProcessingContext.Provider
      value={{
        start: openApiProcessingModal,
        done: closeApiProcessingModal
      }}
    >
      {children}
      <CustomNotifyModal
        modalType="process"
        backdrop="static"
        isShowModal={isShow}
        modalTitle={processingTitle}
        onHide={closeApiProcessingModal}
      />
    </ProcessingContext.Provider>
  );
};

ProcessingContextProvider.propTypes = {children: PropTypes.node.isRequired};

export const useProcessing = () => useContext(ProcessingContext);
export default ProcessingContextProvider;
