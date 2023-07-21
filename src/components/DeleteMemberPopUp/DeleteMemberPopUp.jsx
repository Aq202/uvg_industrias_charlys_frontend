import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../PopUp/PopUp';
import DeleteMember from '../DeleteMember/DeleteMember';
import SuccessNotificationPopUp from '../SuccessNotificationPopUp/SuccessNotificationPopUp';
import usePopUp from '../../hooks/usePopUp';
import ErrorNotificationPopUp from '../ErrorNotificationPopUp/ErrorNotificationPopUp';

function DeleteMemberPopUp({
  id, orgName, close, isOpen, closeCallback, successCallback,
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
          callback={closeCallback}
        >
          <DeleteMember
            id={id}
            orgName={orgName}
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

export default DeleteMemberPopUp;

DeleteMemberPopUp.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  id: PropTypes.string,
  orgName: PropTypes.string.isRequired,
  closeCallback: PropTypes.func,
  successCallback: PropTypes.func,
};

DeleteMemberPopUp.defaultProps = {
  id: null,
  closeCallback: null,
  successCallback: null,
};
