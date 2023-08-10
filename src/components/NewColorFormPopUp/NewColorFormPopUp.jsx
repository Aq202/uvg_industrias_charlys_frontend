import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../PopUp/PopUp';
import NewColorForm from '../NewColorForm/NewColorForm';
import SuccessNotificationPopUp from '../SuccessNotificationPopUp/SuccessNotificationPopUp';
import usePopUp from '../../hooks/usePopUp';
import ErrorNotificationPopUp from '../ErrorNotificationPopUp/ErrorNotificationPopUp';

function NewColorFormPopUp({
  close, isOpen, closeCallback, successCallback,
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
          closeButton
          callback={closeCallback}
        >
          <NewColorForm
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

export default NewColorFormPopUp;

NewColorFormPopUp.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeCallback: PropTypes.func,
  successCallback: PropTypes.func,
};

NewColorFormPopUp.defaultProps = {
  closeCallback: null,
  successCallback: null,
};
