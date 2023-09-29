import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../PopUp/PopUp';
import NewOrganizationForm from '../NewOrganizationForm/NewOrganizationForm';
import SuccessNotificationPopUp from '../SuccessNotificationPopUp/SuccessNotificationPopUp';
import usePopUp from '../../hooks/usePopUp';
import ErrorNotificationPopUp from '../ErrorNotificationPopUp/ErrorNotificationPopUp';

function NewOrganizationFormPopUp({
  close, isOpen, closeCallback, successCallback, newOrgId,
}) {
  const [message, setMessage] = useState('');

  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  const handleSuccess = (val) => {
    close();
    openSuccess();
    setMessage(val);
  };

  const handleNewOrgId = (id) => {
    newOrgId(id);
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
          <NewOrganizationForm
            onError={handleError}
            onSuccess={handleSuccess}
            newOrgId={handleNewOrgId}
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

export default NewOrganizationFormPopUp;

NewOrganizationFormPopUp.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeCallback: PropTypes.func,
  successCallback: PropTypes.func,
  newOrgId: PropTypes.func,
};

NewOrganizationFormPopUp.defaultProps = {
  closeCallback: null,
  successCallback: null,
  newOrgId: null,
};
