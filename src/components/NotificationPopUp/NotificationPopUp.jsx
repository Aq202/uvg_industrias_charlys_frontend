import React from 'react';
import PropTypes from 'prop-types';
import PopUp from '@components/PopUp';
import styles from './NotificationPopUp.module.css';

function NotificationPopUp({
  close, image, alt, title, text, callback,
}) {
  return (
    <PopUp close={close} maxWidth={370} callback={callback}>
      <div className={styles.notification}>
        <img src={image} alt={alt} />
        {title ? <h2>{title}</h2> : null}
        {text ? <p>{text}</p> : null}
      </div>
    </PopUp>
  );
}

export default NotificationPopUp;

NotificationPopUp.propTypes = {
  close: PropTypes.func.isRequired,
  callback: PropTypes.func,
  image: PropTypes.string.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
};

NotificationPopUp.defaultProps = {
  callback: null,
  alt: 'notif. image',
  text: null,
  title: null,
};
