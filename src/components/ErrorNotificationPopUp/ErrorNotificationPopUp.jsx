import React from 'react';
import failureImage from '@assets/failure.svg';
import PropTypes from 'prop-types';
import NotificationPopUp from '@components/NotificationPopUp';

function ErrorNotificationPopUp({
  close, title, text, isOpen, callback,
}) {
  return (

    isOpen && (
      <NotificationPopUp
        image={failureImage}
        title={title}
        text={text}
        close={close}
        callback={callback}
      />
    )

  );
}

export default ErrorNotificationPopUp;

ErrorNotificationPopUp.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.func.isRequired,
  callback: PropTypes.func,
  title: PropTypes.string,
  text: PropTypes.string,
};

ErrorNotificationPopUp.defaultProps = {
  callback: null,
  title: 'Ocurrió un error',
  text: 'Ocurrió un error.',
};
