/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import styles from './OrganizationsPage.module.css';
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
import NewOrganizationFormPopUp from '../../../components/NewOrganizationFormPopUp/NewOrganizationFormPopUp';
import garbage from '../../../assets/garbage.svg';
import AppLink from '../../../components/Link/AppLink';
import SearchInput from '../../../components/SearchInput/SearchInput';
import useCount from '../../../hooks/useCount';

function OrganizationsPage() {
  const {
    callFetch, result: resultOrg, error: errorOrg, loading: loadingOrg,
  } = useFetch();
  const {
    callFetch: deleteOrg,
    result: resultDel,
    error: errorDel,
    loading: loadingDel,
  } = useFetch();
  const token = useToken();
  const [popUpDisable, setPopUpDisable] = useState(null);
  const [popUpDelete, setPopUpDelete] = useState(null);
  const [isSuccessOpen, openSuccess, closeSuccess] = usePopUp();
  const [isErrorOpen, openError, closeError] = usePopUp();
  const [isNewOrgOpen, openNewOrg, closeNewOrg] = usePopUp();
  const [currPage, setCurrPage] = useState(0);
  const [query, setQuery] = useState(null);

  const { count: trigger, next: fireTrigger } = useCount();

  const getOrganizations = (page, searchQuery = null) => {
    const params = new URLSearchParams({ page });

    if (searchQuery) {
      params.set('search', searchQuery);
    }

    const uri = `${serverHost}/organization/?${params.toString()}`;

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
    fireTrigger();
  };

  const deleteOrganization = () => {
    const uri = `${serverHost}/organization/${popUpDelete.id}`;
    deleteOrg({
      uri,
      method: 'DELETE',
      headers: { Authorization: token },
    });

    setPopUpDelete(() => null);
    fireTrigger();
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    setCurrPage(page - 1);
  };

  useEffect(() => {
    getOrganizations(currPage, query);
  }, [currPage, query, trigger]);

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
      <div className={styles.tableBanner}>
        <h1 className={styles.mainTitle}>Lista de organizaciones</h1>
        <Button
          type="submit"
          green
          onClick={openNewOrg}
          text="Nueva"
          name="new-organization-button"
        />
      </div>
      <div className={styles.tableContainer}>
        <SearchInput className={styles.searchInput} handleSearch={setQuery} />
        <Table
          loading={loadingOrg}
          header={['Nombre', 'Correo electrónico', 'Teléfono', '']}
          showCheckbox={false}
          breakPoint="930px"
        >
          {resultOrg && resultOrg.result.map((org) => (
            <TableRow>
              <td className={styles.organizationName}>
                <AppLink to={`/organizacion/${org.id}`}>{org.name}</AppLink>
              </td>
              <td>{org.email}</td>
              <td>{org.phone}</td>
              <td>
                {org.enabled && (
                <img
                  src={garbage}
                  alt="Deshabilitar"
                  onClick={() => setPopUpDisable({ id: org.id, name: org.name })}
                  name="disable-org-button"
                  className={styles.garbageIcon}
                />
                )}
                {!org.enabled && (
                <Button
                  red
                  text="Eliminar"
                  onClick={() => setPopUpDelete({ id: org.id, name: org.name })}
                  name="delete-org-button"
                />
                )}
              </td>
            </TableRow>
          ))}
        </Table>
        {!loadingOrg && !errorOrg && resultOrg && (
          <Pagination
            count={resultOrg.count}
            className={styles.pagination}
            onChange={handlePageChange}
            page={currPage + 1}
          />
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
      <ErrorNotificationPopUp close={closeError} isOpen={isErrorOpen} text={errorDel?.message} />
      <NewOrganizationFormPopUp
        close={closeNewOrg}
        isOpen={isNewOrgOpen}
        successCallback={fireTrigger}
      />
    </div>
  );
}

export default OrganizationsPage;
