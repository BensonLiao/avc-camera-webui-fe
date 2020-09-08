const {Field} = require('formik');
const PropTypes = require('prop-types');
const React = require('react');
const NotificationFaceRecognitionCondition = require('webserver-form-schema/constants/notification-face-recognition-condition');
const _ = require('../../../languages');

module.exports = class CardsFormRule extends React.PureComponent {
  static get propTypes() {
    return {
      faceRecognitionCondition: PropTypes.string.isRequired,
      isEnableFaceRecognition: PropTypes.bool.isRequired,
      groups: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          note: PropTypes.string.isRequired
        }).isRequired)
      }).isRequired
    };
  }

  render() {
    const {faceRecognitionCondition, isEnableFaceRecognition, groups} = this.props;
    return (
      <>
        <div className="form-group d-flex justify-content-between align-items-center">
          <label className="mb-0">{_('Recognition')}</label>
          <div className="custom-control custom-switch">
            <Field
              name="isEnableFaceRecognition"
              checked={isEnableFaceRecognition}
              type="checkbox"
              className="custom-control-input"
              id="switch-notification-face-recognition"
            />
            <label className="custom-control-label" htmlFor="switch-notification-face-recognition">
              <span>{_('ON')}</span>
              <span>{_('OFF')}</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          {
            NotificationFaceRecognitionCondition.all().map(condition => (
              <div key={condition} className="form-check mb-3">
                <Field
                  name="faceRecognitionCondition"
                  className="form-check-input"
                  type="radio"
                  id={`input-notification-face-recognition-${condition}`}
                  value={condition}
                />
                <label className="form-check-label" htmlFor={`input-notification-face-recognition-${condition}`}>
                  {_(`face-recognition-condition-${condition}`)}
                </label>
              </div>
            ))
          }
        </div>
        { faceRecognitionCondition === NotificationFaceRecognitionCondition.success && (
          <div className="form-group">
            <div className="card">
              <div className="card-body px-4 py-4">
                <div className="form-group">
                  <label className="text-size-16 mb-0">{_('Group Type')}</label>
                </div>
                <div className="col-auto px-0">
                  <div className="select-wrapper border rounded-pill overflow-hidden d-flex align-items-center">
                    <i className="far fa-folder fa-sm"/>
                    <Field name="$groups" component="select" className="form-control border-0">
                      <option value="">{_('Everyone')}</option>
                      {
                        groups.items.map(group => (
                          <option key={group.id} value={group.id}>{group.name}</option>
                        ))
                      }
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </>
    );
  }
};
