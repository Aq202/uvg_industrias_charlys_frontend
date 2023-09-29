import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../PopUp/PopUp';
import NewMemberForm from '../NewMemberForm/NewMemberForm';
import SuccessNotificationPopUp from '../SuccessNotificationPopUp/SuccessNotificationPopUp';
import usePopUp from '../../hooks/usePopUp';
import ErrorNotificationPopUp from '../ErrorNotificationPopUp/ErrorNotificationPopUp';

function NewMemberFormPopUp({
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
          closeWithBackground={false}
          closeButton={false}
        >
          <NewMemberForm
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

export default NewMemberFormPopUp;

NewMemberFormPopUp.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  id: PropTypes.string,
  successCallback: PropTypes.func,
};

NewMemberFormPopUp.defaultProps = {
  id: null,
  successCallback: null,
};
