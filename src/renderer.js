import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import './styles/_base.scss';

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    ReactDOM.render(<App />, document.getElementById('app'));
  });
}
