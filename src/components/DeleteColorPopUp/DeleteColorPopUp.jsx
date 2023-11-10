import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../PopUp/PopUp';
import DeleteColor from '../DeleteColor/DeleteColor';
import SuccessNotificationPopUp from '../SuccessNotificationPopUp/SuccessNotificationPopUp';
import usePopUp from '../../hooks/usePopUp';
import ErrorNotificationPopUp from '../ErrorNotificationPopUp/ErrorNotificationPopUp';

function DeleteColorPopUp({
  id, close, isOpen, successCallback,
}) {
  const [message, setMessage] = useState('');

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  const handleSuccess = (val) => {
    close();
    openSuccess();
    setMessage(val);
  };

  const handleError = (val) => {
    close();
    openError();
    setMessage(val);
  };

  return (
    <>
      {isOpen && (
        <PopUp
          close={close}
          maxWidth={700}
          closeWithBackground
          closeButton={false}
        >
          <DeleteColor
            id={id}
            onCancel={close}
            onError={handleError}
            onSuccess={handleSuccess}
          />
        </PopUp>
      )}

      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        text={message}
        callback={successCallback}
      />

      <ErrorNotificationPopUp close={closeError} isOpen={isErrorOpen} text={message} />
    </>
  );
}

export default DeleteColorPopUp;

DeleteColorPopUp.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  id: PropTypes.string,
  successCallback: PropTypes.func,
};

DeleteColorPopUp.defaultProps = {
  id: null,
  successCallback: null,
};
