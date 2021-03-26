const React = require('react');
const {RouterView} = require('@benson.liao/capybara-router');
const Loading = require('../../core/components/loading');

module.exports = class IsolatedLayout extends React.Component {
  render() {
    return (
      <>
        <RouterView>
          <Loading/>
        </RouterView>
      </>
    );
  }
};
