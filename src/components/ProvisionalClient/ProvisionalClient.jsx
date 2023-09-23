/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import useToken from '@hooks//useToken';
import usePopUp from '@hooks/usePopUp';
// import getTokenPayLoad from '@helpers/getTokenPayload';
import SubLoadingView from '@components/SubLoadingView/SubLoadingView';
import InputSelect from '@components/InputSelect';
import Button from '@components/Button/Button';
import NewOrganizationFormPopUp from '@components/NewOrganizationFormPopUp/NewOrganizationFormPopUp';
import SuccessNotificationPopUp from '@components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '@components/ErrorNotificationPopUp/ErrorNotificationPopUp';

import alertDialog from '../../assets/alert_dialog.svg';
import styles from './ProvisionalClient.module.css';

function ProvisionalClient({ onSelect }) {
  const {
    callFetch: callFetchOrgs, result: resultOrgs, error: errorOrgs,
  } = useFetch();

  const token = useToken();
  const [selectedValue, setSelectedValue] = useState('');
  const [newOrg, setNewOrg] = useState(false);
  const [isNewOrgOpen, openNewOrg, closeNewOrg] = usePopUp();
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  // const [form, setForm] = useState({});

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
    // setForm((prev) => ({ ...prev, [name]: value }));
    setSelectedValue(value);
    onSelect(value);
  };

  const handleNewOrg = (newId) => {
    setNewOrg(true);
    setSelectedValue(newId);
    onSelect(newId);
  };

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
          Liceo
        </p>
        <p>
          <strong>Email: </strong>
          liceo@gmail.com
        </p>
        <p>
          <strong>Teléfono: </strong>
          1234-5678
        </p>
        <p>
          <strong>Dirección: </strong>
          4.ta Calle, Guatemala
        </p>
      </div>
      <div className={styles.mesage}>
        <p>
          Para completar el pedido, es necesario que selecciones una organización ya existente.
          También puedes crear una nueva con los datos del cliente provisional.
          <br />
          <br />
          Cuando termines, presiona el botón de asignar organización.
        </p>
      </div>
      {resultOrgs && (
        <div className={styles.selectOrgContainer}>
          <InputSelect
            title="Organización"
            error={errorOrgs}
            options={resultOrgs.result.map((org) => ({ value: org.id, title: org.name }))}
            className={`${styles.menu}`}
            onChange={handleSelectChange}
            name="orgMenu"
            placeholder="Selecciona una organización"
            value={selectedValue}
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
        <Button
          className={styles.assignOrgButton}
          type="submit"
          text="Asignar organización"
          name="assignOrg"
        />
      </div>
      <NewOrganizationFormPopUp
        close={closeNewOrg}
        isOpen={isNewOrgOpen}
        newOrgId={(newId) => handleNewOrg(newId)}
      />
      <SuccessNotificationPopUp
        title="Listo"
        text="La organización se ha asignado correctamente"
        close={closeSuccess}
        isOpen={isSuccessOpen}
      />
      <ErrorNotificationPopUp
        title="Error"
        text="Ocurrió un error al asignar la organización a la solicitud de pedido"
        close={closeError}
        isOpen={isErrorOpen}
      />
    </div>
  );
}

export default ProvisionalClient;

ProvisionalClient.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
