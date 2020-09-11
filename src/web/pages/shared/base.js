const React = require('react');
const store = require('../../../core/store');

module.exports = class Base extends React.Component {
  state = {
    $isApiProcessing: store.get('$isApiProcessing'),
    $user: store.get('$user'),
    $expires: store.get('$expires'),
    $updateFocalLengthField: store.get('$updateFocalLengthField'),
    $isNotCallUnloadAlert: store.get('$isNotCallUnloadAlert')
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
      store.subscribe('$isNotCallUnloadAlert', (msg, data) => {
        if (this.$isMounted) {
          this.setState({$isNotCallUnloadAlert: data});
        } else {
          this.state.$isNotCallUnloadAlert = data;
        }
      }),
      store.subscribe('$updateFocalLengthField', (msg, data) => {
        if (this.$isMounted) {
          this.setState({$updateFocalLengthField: data});
        } else {
          this.state.$updateFocalLengthField = data;
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

  unloadAlert = e => {
    const {$isApiProcessing, $updateFocalLengthField, $isNotCallUnloadAlert} = this.state;
    if (($isApiProcessing || $updateFocalLengthField) && !$isNotCallUnloadAlert) {
      // Cancel the event
      // If you prevent default behavior in Mozilla Firefox prompt will always be shown
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = '';
    }
  };

  componentDidMount() {
    this.$isMounted = true;
    window.addEventListener('beforeunload', this.unloadAlert);
  }

  componentWillUnmount() {
    this.$listens.forEach(x => x());
    window.removeEventListener('beforeunload', this.unloadAlert);
  }
};
