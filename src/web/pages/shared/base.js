const React = require('react');
const store = require('../../../core/store');

module.exports = class Base extends React.Component {
  state = {
    $isApiProcessing: store.get('$isApiProcessing'),
    $user: store.get('$user'),
    $expires: store.get('$expires')
  };

  constructor(props) {
    super(props);
    this.$isMounted = false;
    this.$listens = [
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
      }),
      store.subscribe('$expires', (msg, data) => {
        if (this.$isMounted) {
          this.setState({$expires: data});
        } else {
          this.state.$expires = data;
        }
      })
    ];
  }

  componentDidMount() {
    this.$isMounted = true;
  }

  componentWillUnmount() {
    this.$listens.forEach(x => x());
  }
};
