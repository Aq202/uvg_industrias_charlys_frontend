/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './OrganizationsPage.module.css';
import NavBar from '../../../components/NavBar/NavBar';
import Button from '../../../components/Button/Button';
import useFetch from '../../../hooks/useFetch';
import useToken from '../../../hooks/useToken';
import { serverHost } from '../../../config';
import usePopUp from '../../../hooks/usePopUp';
import Spinner from '../../../components/Spinner/Spinner';
import Table from '../../../components/Table/Table';
import TableRow from '../../../components/TableRow/TableRow';
import PopUp from '../../../components/PopUp/PopUp';
import SuccessNotificationPopUp from '../../../components/SuccessNotificationPopUp/SuccessNotificationPopUp';
import ErrorNotificationPopUp from '../../../components/ErrorNotificationPopUp/ErrorNotificationPopUp';

function OrganizationsPage() {
  const {
    callFetch, result: resultOrg, error: errorOrg, loading: loadingOrg,
  } = useFetch();
  const {
    callFetch: deleteOrg, result: resultDel, error: errorDel, loading: loadingDel,
  } = useFetch();
  const token = useToken();
  const navigate = useNavigate();
  const [popUpDisable, setPopUpDisable] = useState(null);
  const [popUpDelete, setPopUpDelete] = useState(null);
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();

  const getOrganizations = (page) => {
    const uri = `${serverHost}/organization/?page=${page}`;

    callFetch({
      uri,
      method: 'GET',
      headers: { Authorization: token },
    });
  };

  const disableOrganization = () => {
    const uri = `${serverHost}/organization/${popUpDisable.id}`;

    deleteOrg({
      uri,
      method: 'DELETE',
      headers: { Authorization: token },
    });

    setPopUpDisable(() => null);
    getOrganizations(0);
  };

  const deleteOrganization = () => {
    const uri = `${serverHost}/organization/${popUpDelete.id}`;
    deleteOrg({
      uri,
      method: 'DELETE',
      headers: { Authorization: token },
    });

    setPopUpDelete(() => null);
    getOrganizations(0);
  };

  const selectOrganization = (orgId) => {
    navigate(`/organizacion/${orgId}`);
  };

  useEffect(() => {
    getOrganizations(0);
  }, []);

  useEffect(() => {
    if (!resultDel) return;
    openSuccess();
  }, [resultDel]);

  useEffect(() => {
    if (!errorDel) return;
    openError();
  }, [errorDel]);

  return (
    <div className={styles.organizationsPageContainer}>
      <NavBar loggedIn />
      <h1 className={styles.mainTitle}>Lista de organizaciones</h1>
      <div className={styles.tableContainer}>
        <div className={styles.tableBanner}>
          <h2 className={styles.bannerTitle}>Organizaciones registradas</h2>
          <Button type="submit" green onClick={() => navigate('/nuevaOrganizacion')} text="Nueva" />
        </div>
        {loadingOrg && <Spinner />}
        {errorOrg && <p>Ocurrió un error al obtener las organizaciones registradas</p>}
        {resultOrg && (
        <Table
          header={['Nombre', 'Correo electrónico', 'Teléfono', 'Dirección', 'Acción']}
          showCheckbox={false}
          breakPoint="930px"
        >
          {resultOrg.result.map((org) => (
            <TableRow>
              <td
                className={styles.organizationName}
                onClick={() => selectOrganization(org.id)}
              >
                {org.name}
              </td>
              <td>{org.email}</td>
              <td>{org.phone}</td>
              <td>{org.address}</td>
              <td>
                {org.enabled && <Button text="Deshabilitar" onClick={() => setPopUpDisable({ id: org.id, name: org.name })} />}
                {!org.enabled && <Button red text="Eliminar" onClick={() => setPopUpDelete({ id: org.id, name: org.name })} />}
              </td>
            </TableRow>
          ))}
        </Table>
        )}
      </div>
      {popUpDisable !== null && (
        <PopUp close={() => setPopUpDisable(null)} closeWithBackground>
          <div className={styles.confirmation}>
            <p className={styles.confirmationText}>
              ¿Desea deshabilitar la empresa
              {' '}
              {popUpDisable.name}
              ?
            </p>
            {!loadingDel && <Button text="Deshabilitar" onClick={disableOrganization} />}
            {loadingDel && <Spinner />}
          </div>
        </PopUp>
      )}
      {popUpDelete !== null && (
        <PopUp close={() => setPopUpDelete(null)} closeWithBackground>
          <div className={styles.confirmation}>
            <p className={styles.confirmationText}>
              ¿Desea borrar la empresa
              {' '}
              {popUpDelete.name}
              ?
            </p>
            {!loadingDel && <Button red text="Eliminar" onClick={deleteOrganization} />}
            {loadingDel && <Spinner />}
          </div>
        </PopUp>
      )}

      <SuccessNotificationPopUp
        close={closeSuccess}
        isOpen={isSuccessOpen}
        text="La operación ha sido realizada correctamente."
      />
      <ErrorNotificationPopUp
        close={closeError}
        isOpen={isErrorOpen}
        text={errorDel?.message}
      />
    </div>
  );
}

export default OrganizationsPage;
