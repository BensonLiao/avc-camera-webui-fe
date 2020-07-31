const {Formik, Form, Field} = require('formik');
const {getRouter} = require('capybara-router');
const PropTypes = require('prop-types');
const React = require('react');
const _ = require('../../../languages');

module.exports = class MembersSearchForm extends React.PureComponent {
  static get propTypes() {
    return {
      isApiProcessing: PropTypes.bool.isRequired,
      currentRouteName: PropTypes.string.isRequired,
      params: PropTypes.shape({keyword: PropTypes.string}).isRequired
    };
  }

  onSubmitSearchForm = ({keyword}) => {
    getRouter().go({
      name: this.props.currentRouteName,
      params: {
        ...this.props.params,
        index: undefined,
        keyword
      }
    });
  };

  render() {
    const {isApiProcessing, params} = this.props;
    return (
      <Formik
        initialValues={{keyword: params.keyword || ''}}
        onSubmit={this.onSubmitSearchForm}
      >
        <Form className="form-row">
          <div className="col-auto">
            <Field name="keyword" className="form-control" type="search" placeholder={_('Enter keywords')}/>
          </div>
          <div className="col-auto">
            <button
              disabled={isApiProcessing}
              className="btn btn-outline-primary rounded-pill px-3"
              type="submit"
            >
              <i className="fas fa-search fa-fw"/> {_('Search')}
            </button>
          </div>
        </Form>
      </Formik>
    );
  }
};
