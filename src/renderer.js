import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './styles/_base.scss';
import App from './containers/app';
import configureStore from './redux/configureStore';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

// if (module.hot) {
//   module.hot.accept('./containers/App', () => {
//     ReactDOM.render(<App />, document.getElementById('app'));
//   });
// }
