
import React from 'react';
import PropTypes from 'prop-types';
import iconDescription from '../../../resource/description-20px.svg';
import i18n from '../../../i18n';
import CustomTooltip from '../../../core/components/tooltip';
import {Link} from '@benson.liao/capybara-router';

const MembersSelectedGroup = ({selectedGroup, params}) => {
  return (
    selectedGroup && (
      <div className="col-12 mb-4">
        <i className="far fa-folder fa-fw fa-lg text-primary"/>
        <span className="text-size-16 text-muted ml-3">
          {selectedGroup.name}
        </span>
        <img className="ml-32px" src={iconDescription}/>
        {
          selectedGroup.note && selectedGroup.note.length > 0 && (
            <CustomTooltip title={selectedGroup.note}>
              <div
                className="text-size-14 text-muted ml-2"
                style={{
                  display: 'inline-block',
                  lineHeight: 'initial',
                  wordWrap: 'break-word',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: '50%'
                }}
              >
                {selectedGroup.note}
              </div>
            </CustomTooltip>
          )
        }
        <CustomTooltip title={i18n.t('Edit Group: {{0}}', {0: selectedGroup.name})}>
          <Link
            className="ml-32px"
            to={{
              name: 'web.users.members.modify-group',
              params: params
            }}
          >
            <i className="fas fa-pen fa-fw"/>
          </Link>
        </CustomTooltip>
      </div>
    )
  );
};

MembersSelectedGroup.propTypes = {
  params: PropTypes.shape({group: PropTypes.string}).isRequired,
  selectedGroup: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    note: PropTypes.string
  })
};

MembersSelectedGroup.defaultProps = {selectedGroup: null};

export default MembersSelectedGroup;
