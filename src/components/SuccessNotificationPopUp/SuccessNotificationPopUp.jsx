import React from 'react';
import successImage from '@assets/success.svg';
import PropTypes from 'prop-types';
import NotificationPopUp from '@components/NotificationPopUp';

function SuccessNotificationPopUp({
  close, title, text, isOpen, callback,
}) {
  return (

    isOpen && (
      <NotificationPopUp
        image={successImage}
        title={title}
        text={text}
        close={close}
        callback={callback}
      />
    )

  );
}

export default SuccessNotificationPopUp;

SuccessNotificationPopUp.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  callback: PropTypes.func,
  title: PropTypes.string,
  text: PropTypes.string,
};

SuccessNotificationPopUp.defaultProps = {
  callback: null,
  title: 'Operación realizada correctamente',
  text: 'La operación se ha llevado a cabo de manera exitosa.',
};
