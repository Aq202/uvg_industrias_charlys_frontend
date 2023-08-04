import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './SidebarItem.module.css';

function SidebarItem({
  text, path, iconUrl, iconAlt, iconItem, onClick,
}) {
  return (
    <Link className={styles.menuItem} to={path} onClick={onClick}>
      {iconUrl && <img className={styles.menuIcon} src={iconUrl} alt={iconAlt} />}
      {iconItem
        && React.cloneElement(iconItem, {
          className: `${iconItem.props.className ?? ''} ${styles.menuIcon}`,
        })}
      {text}
    </Link>
  );
}

export default SidebarItem;

SidebarItem.propTypes = {
  text: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  iconUrl: PropTypes.string,
  iconAlt: PropTypes.string,
  iconItem: PropTypes.node,
  onClick: PropTypes.func,
};

SidebarItem.defaultProps = {
  iconUrl: '',
  iconAlt: 'Opción',
  iconItem: null,
  onClick: null,
};
