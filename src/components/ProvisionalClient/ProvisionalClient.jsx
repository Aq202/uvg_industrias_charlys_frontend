import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks//useToken';
import usePopUp from '@hooks/usePopUp';
import InputSelect from '@components/InputSelect';
import Button from '@components/Button/Button';
import Spinner from '@components/Spinner/Spinner';
import ConfirmationPopUp from '@components/ConfirmationPopUp';
import NewOrganizationFormPopUp from '@components/NewOrganizationFormPopUp/NewOrganizationFormPopUp';
import SuccessNotificationPopUp from '@components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '@components/ErrorNotificationPopUp/ErrorNotificationPopUp';

import alertDialog from '../../assets/alert_dialog.svg';
import styles from './ProvisionalClient.module.css';

function ProvisionalClient({ orderId, clientInfo }) {
  const {
    callFetch: callFetchOrgs, result: resultOrgs, error: errorOrgs,
  } = useFetch();

  const {
    callFetch: patchOrg,
    result: patchResultSetOrg,
    error: patchErrorSetOrg,
    loading: patchLoadingSetOrg,
  } = useFetch();

  const token = useToken();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [doAssign, setDoAssing] = useState();
  const [orgName, setOrgName] = useState();

  const [newOrg, setNewOrg] = useState(false);
  const [isNewOrgOpen, openNewOrg, closeNewOrg] = usePopUp();
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();
  const [isConfirmationOpen, openConfirmation, closeConfirmation] = usePopUp();

  useEffect(() => {
    if (!token) return;
    callFetchOrgs({
      uri: `${serverHost}/organization/`,
      headers: {
        authorization: token,
      },
    });
  }, [token, newOrg]);

  const handleSelectChange = (e) => {
    const { value, name } = e.target;
    setForm((lastValue) => ({ ...lastValue, [name]: value }));
    setOrgName(resultOrgs.result.filter((org) => org.id === value)[0].name);
  };

  const handleNewOrg = (newId) => {
    setNewOrg(true);
    setForm((lastValue) => ({ ...lastValue, orgMenu: newId }));
  };

  const clearError = (e) => {
    setErrors((lastVal) => ({ ...lastVal, [e.target.name]: null }));
  };

  const validateSelectedOrg = () => {
    const value = form.orgMenu;

    if (!(value?.includes('ORG'))) {
      setErrors((lastVal) => ({
        ...lastVal,
        description: 'Se requiere una organización',
      }));
      return false;
    }

    return true;
  };

  const successCallback = () => navigate(0);

  const handlePatchOrg = () => {
    if (!validateSelectedOrg()) return;

    const uri = `${serverHost}/orderRequest/${orderId}/temporaryClient/confirm`;

    const body = {};
    const selectedOrg = form.orgMenu;

    body.organizationId = selectedOrg;

    patchOrg({
      uri,
      method: 'PATCH',
      headers: { authorization: token },
      body: JSON.stringify(body),
      parse: false,
    });
  };

  useEffect(() => {
    if (!patchErrorSetOrg) return;
    openError();
  }, [patchErrorSetOrg]);

  useEffect(() => {
    if (!patchResultSetOrg) return;
    openSuccess();
  }, [patchResultSetOrg]);

  useEffect(() => {
    if (!doAssign) return;
    handlePatchOrg();
  }, [doAssign]);

  return (
    <div className={`${styles.mainContainer}`}>
      <div className={styles.createOrganitationBannerContainer}>
        <div className={styles.createOrganitationBanner}>
          <img className={styles.alertDialog} src={alertDialog} alt="alert_dialog" />
          Este pedido fue realizado por un cliente provisional.
        </div>
      </div>
      <div className={styles.clientInfoContainer}>
        <p>
          <strong>Nombre: </strong>
          {clientInfo.name}
        </p>
        <p>
          <strong>Email: </strong>
          {clientInfo.email}
        </p>
        <p>
          <strong>Teléfono: </strong>
          {clientInfo.phone}
        </p>
        <p>
          <strong>Dirección: </strong>
          {clientInfo.address}
        </p>
      </div>
      <div className={styles.message}>
        <p>
          Para completar el pedido, es necesario que selecciones una organización ya existente.
          También puedes crear una nueva con los datos del cliente provisional.
          <br />
          <br />
          Cuando termines, presiona el botón de asignar organización.
        </p>
      </div>
      {errorOrgs && 'Ocurrió un error al cargar las organizaciones registradas'}
      {resultOrgs && (
        <div className={styles.selectOrgContainer}>
          <InputSelect
            title="Organización"
            options={resultOrgs.result.map((org) => ({ value: org.id, title: org.name }))}
            className={`${styles.menu}`}
            onChange={handleSelectChange}
            name="orgMenu"
            placeholder="Selecciona una organización"
            value={form.orgMenu}
            error={errors.description}
            onFocus={clearError}
          />
          <Button
            className={styles.createOrgButton}
            type="submit"
            text="Crear organización"
            name="createOrg"
            secondary
            onClick={openNewOrg}
          />
        </div>
      )}
      <div className={styles.assignOrgContainer}>
        {!patchLoadingSetOrg
        && (
          <Button
            className={styles.assignOrgButton}
            type="submit"
            text="Asignar organización"
            name="assignOrg"
            onClick={openConfirmation}
            disabled={!form.orgMenu}
          />
        )}
        {patchLoadingSetOrg && <Spinner />}
      </div>
      <ConfirmationPopUp
        close={closeConfirmation}
        isOpen={isConfirmationOpen}
        body={`¿Está seguro de asignar la organización "${orgName}" solicitud de pedido?`}
        callback={setDoAssing}
      />
      <NewOrganizationFormPopUp
        close={closeNewOrg}
        isOpen={isNewOrgOpen}
        newOrgId={(newId) => handleNewOrg(newId)}
        clientInfo={clientInfo}
      />
      <SuccessNotificationPopUp
        title="Listo"
        text="La organización se ha asignado correctamente"
        close={closeSuccess}
        isOpen={isSuccessOpen}
        callback={successCallback}
      />
      <ErrorNotificationPopUp
        title="Error"
        text={patchErrorSetOrg}
        close={closeError}
        isOpen={isErrorOpen}
      />
    </div>
  );
}

export default ProvisionalClient;

ProvisionalClient.propTypes = {
  orderId: PropTypes.string.isRequired,
  clientInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};
