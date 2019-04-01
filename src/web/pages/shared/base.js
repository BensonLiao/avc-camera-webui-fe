const React = require('react');
const store = require('../../../core/store');

module.exports = class Base extends React.Component {
  constructor(props) {
    super(props);
    this.$subscriptions = [];
    this.state = {
      $isApiProcessing: store.get('$isApiProcessing'),
      $user: store.get('$user'),
      $config: store.get('$config')
    };
  }

  componentWillMount() {
    this.$subscriptions.push(store.subscribe('$isApiProcessing', (msg, data) => {
      this.setState({
        $isApiProcessing: data
      });
    }));
    this.$subscriptions.push(store.subscribe('$user', (msg, data) => {
      this.setState({
        $user: data
      });
    }));
  }

  componentWillUnmount() {
    this.$subscriptions.forEach(subscription => {
      store.unsubscribe(subscription);
    });
  }
};
