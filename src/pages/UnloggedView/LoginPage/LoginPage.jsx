import React from 'react';
import LoginForm from '@components/LoginForm';
import styles from './LoginPage.module.css';

function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <LoginForm />

      <div className={styles.slider}>
        <ul>
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
      </div>
    </div>
  );
}

export default LoginPage;
