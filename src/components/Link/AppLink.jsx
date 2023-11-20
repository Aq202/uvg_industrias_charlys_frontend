import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './Link.module.css';

function AppLink({ to, children }) {
  return (
    <Link to={to} className={styles.link}>{children}</Link>
  );
}

export default AppLink;

AppLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
};

AppLink.defaultProps = {
  to: '',
  children: null,
};
