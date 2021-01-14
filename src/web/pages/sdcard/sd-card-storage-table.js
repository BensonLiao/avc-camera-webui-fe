import classNames from 'classnames';
import filesize from 'filesize';
import PropTypes from 'prop-types';
import React from 'react';
import CheckboxBody from '../../../core/components/fields/checkbox-body';
import CheckboxHeader from '../../../core/components/fields/checkbox-header';
import CustomTooltip from '../../../core/components/tooltip';
import i18n from '../../../i18n';
import noFile from '../../../resource/noFile.png';
import {SDCARD_STORAGE_DATE_FORMAT} from '../../../core/constants';
import TableWithCheckBox from '../../../core/components/checkbox-table';
import CheckboxTablePopoverAction from '../../../core/components/checkbox-table-popover-action';

const SDCardStorageTable = ({
  currentDate,
  form,
  formikRef,
  pageNumber,
  confirmDelete,
  downloadFiles
}) => {
  return (
    <TableWithCheckBox
      formikRef={formikRef}
      pageNumber={pageNumber}
      popoverAction={(
        <CheckboxTablePopoverAction
          items={form.values.flat().filter(value => value.isChecked).length}
          actions={[
            {
              id: 1,
              icon: <i className="fas fa-download"/>,
              text: i18n.t('common.tooltip.download'),
              func: () => downloadFiles(formikRef.current.values)
            },
            {
              id: 2,
              icon: <i className="far fa-trash-alt"/>,
              text: i18n.t('common.tooltip.delete'),
              func: confirmDelete()
            }
          ]}
        />
      )}
    >
      <thead>
        <tr className="shadow">
          <CheckboxHeader formikForm={form}/>
          <th style={{width: '15%'}}>{i18n.t('sdCard.storage.files.date')}</th>
          <th style={{width: '25%'}}>{i18n.t('sdCard.storage.files.name')}</th>
          <th style={{width: '25%'}}>{i18n.t('sdCard.storage.files.size')}</th>
          <th style={{width: '15%'}}>{i18n.t('sdCard.storage.files.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {
          form.values.length && form.values[pageNumber].length ? (
            form.values[pageNumber] && form.values[pageNumber].map((pageData, index) => {
              return (
                <tr
                  key={pageData.path}
                  className={classNames(
                    {
                      checked: form.values[pageNumber] &&
                          form.values[pageNumber][index] &&
                          form.values[pageNumber][index].isChecked
                    }
                  )}
                >
                  <CheckboxBody id={pageData.path} pageNumber={pageNumber} index={index}/>
                  <td>
                    {currentDate.format(SDCARD_STORAGE_DATE_FORMAT.DISPLAY)}
                  </td>
                  <td>
                    <CustomTooltip placement="top-start" title={pageData.name}>
                      <div>
                        {pageData.name}
                      </div>
                    </CustomTooltip>
                  </td>
                  <td>
                    {filesize(pageData.bytes)}
                  </td>
                  <td className="text-left group-btn">
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={() => downloadFiles(pageData.path)}
                    >
                      <i className="fas fa-lg fa-fw fa-download"/>
                    </button>
                    <button
                      className="btn btn-link"
                      type="button"
                      onClick={confirmDelete(pageData.path)}
                    >
                      <i className="far fa-lg fa-fw fa-trash-alt"/>
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            /* No File */
            <tr className="disable-highlight">
              <td className="text-size-20 text-center" colSpan="10">
                <div className="d-flex flex-column align-items-center mt-5">
                  <img src={noFile}/>
                  <div className="mt-5 text-center text-wrap" style={{width: '300px'}}>
                    {i18n.t('sdCard.storage.noFile')}
                  </div>
                </div>
              </td>
            </tr>
          )
        }
      </tbody>
    </TableWithCheckBox>
  );
};

SDCardStorageTable.propTypes = {
  currentDate: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  formikRef: PropTypes.object.isRequired,
  pageNumber: PropTypes.number.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  downloadFiles: PropTypes.func.isRequired
};

export default SDCardStorageTable;
