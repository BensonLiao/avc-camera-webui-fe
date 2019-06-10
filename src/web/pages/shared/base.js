const React = require('react');
const store = require('../../../core/store');

module.exports = class Base extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      $isApiProcessing: store.get('$isApiProcessing'),
      $user: store.get('$user')
    };
    this.$subscriptions = [
      store.subscribe('$isApiProcessing', (msg, data) => {
        this.setState({$isApiProcessing: data});
      }),
      store.subscribe('$user', (msg, data) => {
        this.setState({$user: data});
      })
    ];
  }

  componentWillUnmount() {
    this.$subscriptions.forEach(x => x());
  }
};
