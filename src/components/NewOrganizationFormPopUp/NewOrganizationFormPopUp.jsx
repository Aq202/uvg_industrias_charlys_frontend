import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PopUp from '../PopUp/PopUp';
import NewOrganizationForm from '../NewOrganizationForm/NewOrganizationForm';
import SuccessNotificationPopUp from '../SuccessNotificationPopUp/SuccessNotificationPopUp';
import usePopUp from '../../hooks/usePopUp';
import ErrorNotificationPopUp from '../ErrorNotificationPopUp/ErrorNotificationPopUp';

function NewOrganizationFormPopUp({
  close, isOpen, closeCallback, successCallback, newOrgId, clientInfo,
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
    if (newOrgId) newOrgId(id);
  };

  const handleError = (val) => {
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
            clientInfo={clientInfo}
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
  clientInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }),
};

NewOrganizationFormPopUp.defaultProps = {
  closeCallback: null,
  successCallback: null,
  newOrgId: null,
  clientInfo: null,
};
