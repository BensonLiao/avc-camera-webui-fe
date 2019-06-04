const React = require('react');
const {RouterView} = require('capybara-router');
const Base = require('./shared/base');

module.exports = class Layout extends Base {
  constructor(props) {
    super(props);
    const router = require('../router');

    this.state.currentRouteName = '';
    this.$subscriptions.push(
      router.listen('ChangeSuccess', (action, toState) => {
        this.setState({
          currentRouteName: toState.name
        });
      })
    );
  }

  render() {
    return (
      <RouterView>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <p className="text-center text-muted h3" style={{padding: '20px 0'}}>
                <i className="fas fa-spinner fa-pulse fa-fw"/> Loading...
              </p>
            </div>
          </div>
        </div>
      </RouterView>
    );
  }
};
