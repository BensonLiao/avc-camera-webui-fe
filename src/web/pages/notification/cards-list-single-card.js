const classNames = require('classnames');
const PropTypes = require('prop-types');
const React = require('react');
const _ = require('../../../languages');
const CustomTooltip = require('../../../core/components/tooltip');
const outputIcon = require('../../../resource/icon-output-40px.svg');
const vmsIcon = require('../../../resource/icon-server-40px.svg');
const utils = require('../../../core/utils');

module.exports = class CardsListSingleCard extends React.PureComponent {
  static get propTypes() {
    return {
      card: PropTypes.shape({
        emailAttachmentType: PropTypes.string.isRequired,
        emails: PropTypes.array.isRequired,
        faceRecognitionCondition: PropTypes.string.isRequired,
        faceRecognitionVMSEvent: PropTypes.string.isRequired,
        groups: PropTypes.array.isRequired,
        id: PropTypes.number.isRequired,
        isEnableApp: PropTypes.bool.isRequired,
        isEnableEmail: PropTypes.bool.isRequired,
        isEnableFaceRecognition: PropTypes.bool.isRequired,
        isEnableGPIO: PropTypes.bool.isRequired,
        isEnableGPIO1: PropTypes.bool.isRequired,
        isEnableGPIO2: PropTypes.bool.isRequired,
        isEnableTime: PropTypes.bool.isRequired,
        isEnableVMS: PropTypes.bool.isRequired,
        isTop: PropTypes.bool.isRequired,
        timePeriods: PropTypes.array.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
      }).isRequired,
      groups: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          note: PropTypes.string.isRequired
        }).isRequired)
      }).isRequired,
      isApiProcessing: PropTypes.bool.isRequired,
      clickCardHandler: PropTypes.func.isRequired,
      deleteCardHandler: PropTypes.func.isRequired,
      toggleIsTopHandler: PropTypes.func.isRequired
    };
  }

  render() {
    const {card, groups, isApiProcessing, clickCardHandler, deleteCardHandler, toggleIsTopHandler} = this.props;
    return (
      <>
        <div key={card.id} className="card shadow overflow-hidden" onClick={clickCardHandler(card.id)}>
          <div className="card-title d-flex justify-content-between align-items-center">
            <div className="title text-truncate">
              <CustomTooltip title={card.isTop ? _('Unpin Card') : _('Pin Card')}>
                <button
                  disabled={isApiProcessing} type="button"
                  className={classNames('btn btn-star rounded-pill', {'btn-secondary': !card.isTop})}
                  onClick={toggleIsTopHandler(card.id)}
                >
                  <i className="fas fa-bell fa-fw fa-lg"/>
                </button>
              </CustomTooltip>

              <a className="ml-3" href="#">{card.title}</a>
            </div>
            <div className="icons d-flex justify-content-end">
              {
                card.isEnableEmail && (
                  <CustomTooltip title={_('Email: On')}>
                    <div className="icon rounded-pill d-flex justify-content-center align-items-center">
                      <i className="fas fa-envelope fa-fw fa-lg"/>
                    </div>
                  </CustomTooltip>
                )
              }
              {
                card.isEnableGPIO && (
                  <CustomTooltip title={_('Output: On')}>
                    <div className="icon rounded-pill d-flex justify-content-center align-items-center ml-2">
                      <img src={outputIcon}/>
                    </div>
                  </CustomTooltip>
                )
              }
              {
                card.isEnableVMS && (
                  <CustomTooltip title={_('VMS: On')}>
                    <div className="icon rounded-pill d-flex justify-content-center align-items-center ml-2">
                      <img src={vmsIcon}/>
                    </div>
                  </CustomTooltip>
                )
              }
            </div>
          </div>
          <div className="card-body">
            <table>
              <tbody>
                <tr>
                  <th>{_('Analytic')}</th>
                  <td>{_(`notification-card-${card.type}`)}</td>
                </tr>
                {
                  card.timePeriods.map((timePeriod, index) => {
                    const key = `${index}`;

                    return (
                      <tr key={key}>
                        <th>{index === 0 ? _('Schedule') : ''}</th>
                        <td>{`${utils.formatDate(timePeriod.start)} - ${utils.formatDate(timePeriod.end)}`}</td>
                      </tr>
                    );
                  })
                }
                <tr>
                  <th>{_('Rule')}</th>
                  <td>{_(`face-recognition-condition-${card.faceRecognitionCondition}`)}</td>
                </tr>
              </tbody>
            </table>
            <div className="chips-wrapper">
              <div className="chips">
                {
                  card.groups.slice(0, 2).map(groupId => {
                    const group = groups.items.find(x => x.id === groupId);
                    return (
                      <span key={groupId} className="border border-primary rounded-pill text-primary">
                        {group ? group.name : ''}
                      </span>
                    );
                  })
                }
              </div>
              {
                card.groups.length > 2 && (
                  <div className="chips-sum-extra">
                    <span className="border border-primary rounded-pill text-primary">+{card.groups.length - 2}</span>
                  </div>
                )
              }
            </div>
            <button
              disabled={isApiProcessing} type="button"
              className="btn btn-secondary rounded-circle btn-delete"
              onClick={deleteCardHandler(card.id)}
            >
              <i className="far fa-trash-alt fa-lg"/>
            </button>
          </div>
        </div>

      </>
    );
  }
};
