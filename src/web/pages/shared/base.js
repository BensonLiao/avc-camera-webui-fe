const React = require('react');
const store = require('../../../core/store');

module.exports = class Base extends React.Component {
  constructor(props) {
    super(props);
    this.$isMounted = false;
    this.state = {
      $isApiProcessing: store.get('$isApiProcessing'),
      $user: store.get('$user')
    };
    this.$subscriptions = [
      store.subscribe('$isApiProcessing', (msg, data) => {
        if (this.$isMounted) {
          this.setState({$isApiProcessing: data});
        } else {
          this.state.$isApiProcessing = data;
        }
      }),
      store.subscribe('$user', (msg, data) => {
        if (this.$isMounted) {
          this.setState({$user: data});
        } else {
          this.state.$user = data;
        }
      })
    ];
  }

  componentDidMount() {
    this.$isMounted = true;
  }

  componentWillUnmount() {
    this.$subscriptions.forEach(x => x());
  }
};
