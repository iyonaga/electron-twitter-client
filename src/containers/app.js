import React from 'react';
import Sidebar from './sidebar';
import Contents from './contents';
import styles from './app.scss';

const App = () => (
  <div className={styles.container}>
    <Sidebar />
    <Contents />
  </div>
);

export default App;
