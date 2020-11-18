import React, {Component} from 'react';
import store from '../core/store';
import {StateProvider} from './stateProvider';

const withGlobalStatus = WrappedComponent => {
  class WithGlobalStatusHOC extends Component {
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

    storeValues = {
      $isApiProcessing: store.get('$isApiProcessing'),
      $user: store.get('$user'),
      $expires: store.get('$expires'),
      $updateFocalLengthField: store.get('$updateFocalLengthField') || false,
      $isNotCallUnloadAlert: store.get('$isNotCallUnloadAlert') || false
    }

    unloadAlert = e => {
      // const {$isApiProcessing, $updateFocalLengthField, $isNotCallUnloadAlert} = this.state;
      const $isApiProcessing = store.get('$isApiProcessing');
      const $updateFocalLengthField = store.get('$updateFocalLengthField');
      const $isNotCallUnloadAlert = store.get('$isNotCallUnloadAlert');
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

    render() {
      const isApiProcessing = store.get('$isApiProcessing');
      const user = store.get('$user');

      return (
        <StateProvider initialState={{
          isApiProcessing,
          user
        }}
        >
          <WrappedComponent
            {...{
              $listens: this.$listens,
              ...this.props,
              ...this.storeValues
            }}
          />
        </StateProvider>
      );
    }
  }

  return WithGlobalStatusHOC;
};

export default withGlobalStatus;
