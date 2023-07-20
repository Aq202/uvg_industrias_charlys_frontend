import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './OrganizationsPage.module.css';
import NavBar from '../../../components/NavBar/NavBar';
import Button from '../../../components/Button/Button';
import useFetch from '../../../hooks/useFetch';
import useToken from '../../../hooks/useToken';
import { serverHost } from '../../../config';
import Spinner from '../../../components/Spinner/Spinner';
import Table from '../../../components/Table/Table';
import TableRow from '../../../components/TableRow/TableRow';

function OrganizationsPage() {
  const {
    callFetch, result: resultOrg, error: errorOrg, loading: loadingOrg,
  } = useFetch();
  const token = useToken();
  const navigate = useNavigate();
  // const [selectedRows, setSelectedRows] = useState([]);

  const getOrganizations = (page) => {
    const uri = `${serverHost}/organization/?page=${page}`;

    callFetch({
      uri,
      method: 'GET',
      headers: { Authorization: token },
    });
  };

  const disableWarning = () => {
    console.log('Confirmar disable');
  };

  const deleteWarning = () => {
    console.log('Confirmar eliminar');
  };

  useEffect(() => {
    getOrganizations(0);
  }, []);

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
        >
          {resultOrg.result.map((org) => (
            <TableRow>
              <td>{org.name}</td>
              <td>{org.email}</td>
              <td>{org.phone}</td>
              <td>{org.address}</td>
              <td>
                {org.enabled && <Button text="Deshabilitar" onClick={disableWarning} />}
                {!org.enabled && <Button red text="Eliminar" onClick={deleteWarning} />}
              </td>
            </TableRow>
          ))}
        </Table>
        )}
      </div>
    </div>
  );
}

export default OrganizationsPage;
