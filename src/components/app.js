import React from 'react';
import Sidebar from '../containers/sidebar';
import Contents from '../containers/contents';
import styles from './app.module.scss';

export default function App() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <Contents />
    </div>
  );
}
