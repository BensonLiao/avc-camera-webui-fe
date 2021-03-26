import filesize from 'filesize';
import {getRouter} from '@benson.liao/capybara-router';
import PropTypes from 'prop-types';
import React from 'react';
import CheckboxBody from '../../../core/components/fields/checkbox-body';
import CheckboxBodyRow from '../../../core/components/fields/checkbox-body-row';
import CheckboxHeader from '../../../core/components/fields/checkbox-header';
import CheckboxTablePopoverAction from '../../../core/components/checkbox-table-popover-action';
import {connectForm} from '../../../core/components/form-connect';
import CustomTooltip from '../../../core/components/tooltip';
import api from '../../../core/apis/web-api';
import i18n from '../../../i18n';
import noFile from '../../../resource/noFile.png';
import TableActionButton from '../../../core/components/table-action-button';
import TableWithCheckBox from '../../../core/components/checkbox-table';

const SDCardStorageTable = connectForm(({
  formik,
  pageNumber,
  handleDelete,
  downloadFiles,
  generatePaginatedCheckList,
  storageFileType,
  pageType,
  isRootDirectory,
  setFolderName
}) => {
  const goDownFolder = fileName => {
    api.system.getSDCardStorageFiles(storageFileType, fileName)
      .then(response => {
        formik.setValues(generatePaginatedCheckList(response.data));
        setFolderName(fileName);
      });
  };

  const doubleClickHandler = pageData => {
    if (pageType === 'root') {
      if (pageData.id.indexOf('snapshot') >= 0) {
        return getRouter().go({name: 'web.sd-card.image'});
      }

      return getRouter().go({name: 'web.sd-card.video'});
    }

    if (pageData.type === 'directory') {
      return goDownFolder(pageData.name);
    }
  };

  return (
    <div className="sdcard-storage-table">
      <TableWithCheckBox
        pageNumber={pageNumber}
        popoverAction={(
          <CheckboxTablePopoverAction
            actions={[
              {
                icon: <i className="fas fa-download"/>,
                text: i18n.t('common.tooltip.download'),
                func: () => downloadFiles(formik.values)
              },
              {
                icon: <i className="far fa-trash-alt"/>,
                text: i18n.t('common.tooltip.delete'),
                func: handleDelete()
              }
            ]}
          />
        )}
      >
        <thead>
          <tr>
            <CheckboxHeader width="7%" disabled={isRootDirectory}/>
            <th style={{width: '53%'}}>{i18n.t('sdCard.storage.files.name')}</th>
            <th style={{width: '20%'}}>{i18n.t('sdCard.storage.files.size')}</th>
            <th style={{width: '20%'}}>{i18n.t('sdCard.storage.files.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {
            formik.values?.[pageNumber]?.map((pageData, index) => {
              pageData.id = pageData.path;
              return (
                <CheckboxBodyRow
                  key={pageData.id}
                  disabled={isRootDirectory}
                  rowId={pageData.id}
                  onDoubleClick={() => doubleClickHandler(pageData)}
                >
                  <CheckboxBody
                    id={pageData.id}
                    disabled={isRootDirectory}
                    pageNumber={pageNumber}
                    index={index}
                  />
                  <td>
                    <CustomTooltip placement="top-start" title={pageData.name}>
                      <div>
                        {
                          pageData.type === 'directory' ?
                            <i className="fas fa-lg fa-folder text-primary mr-3"/> :
                            pageType === 'image' ?
                              <i className="fas fa-lg fa-file-image mr-3"/> :
                              <i className="far fa-lg fa-file-video mr-3"/>
                        }
                        {pageData.name}
                      </div>
                    </CustomTooltip>
                  </td>
                  <td>
                    {isRootDirectory ? '-' : filesize(pageData.bytes)}
                  </td>
                  <td className="text-left group-btn" style={{minWidth: '145px'}}>
                    <TableActionButton
                      isStopPropagation
                      disabled={isRootDirectory}
                      onClick={() => downloadFiles(pageData.path)}
                    >
                      <i className="fas fa-lg fa-fw fa-download"/>
                    </TableActionButton>
                    <TableActionButton
                      isStopPropagation
                      disabled={isRootDirectory}
                      onClick={handleDelete(pageData.path)}
                    >
                      <i className="far fa-lg fa-fw fa-trash-alt"/>
                    </TableActionButton>
                  </td>
                </CheckboxBodyRow>
              );
            }) ??
            (
            /* No File */
              <tr className="disable-highlight">
                <td className="text-size-20 text-center border-0" colSpan="10">
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
    </div>
  );
});

SDCardStorageTable.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  downloadFiles: PropTypes.func.isRequired,
  generatePaginatedCheckList: PropTypes.func.isRequired,
  storageFileType: PropTypes.string.isRequired,
  pageType: PropTypes.string.isRequired,
  isRootDirectory: PropTypes.bool.isRequired,
  setFolderName: PropTypes.func.isRequired
};

export default SDCardStorageTable;
