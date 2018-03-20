import React from 'react';
import ReactDOM from 'react-dom';
import './styles/_base.scss';
import App from './containers/app';

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    ReactDOM.render(<App />, document.getElementById('app'));
  });
}
