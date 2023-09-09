import React, { useState, useEffect } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/LocalPhone';
import AddressIcon from '@mui/icons-material/LocationOn';
import { useParams } from 'react-router';
import { serverHost } from '@/config';
import useFetch from '@hooks/useFetch';
import Button from '../../../components/Button/Button';
import Members from './Members';
import InputSelect from '../../../components/InputSelect/InputSelect';
import styles from './OrganizationView.module.css';
import useToken from '../../../hooks/useToken';
import Requests from './Requests';
import ConfirmedOrders from './ConfirmedOrders';
import SubLoadingView from '../../../components/SubLoadingView/SubLoadingView';
import OrganizationProductsPage from '../../OrganizationProductsPage/OrganizationProductsPage';

function OrganizationView() {
  const {
    callFetch, result, error, loading,
  } = useFetch();

  const { orgId } = useParams();
  const [sections, setSections] = useState('Miembros');
  const token = useToken();

  useEffect(() => {
    if (!orgId) return;
    callFetch({
      uri: `${serverHost}/organization/${orgId}`,
      headers: {
        authorization: token,
      },
    });
  }, []);

  return (
    <div>

      {error && <span>Ocurrió un error.</span>}
      {loading && <SubLoadingView />}
      {!loading && !error && !result && <span>No se encontró la organización.</span>}
      {result && (
      <div className={styles.organizationView}>
        <div className={styles.orgName}>
          <h1>
            {result.name}
          </h1>
          <Button text="Administrar" type="secondary" />
        </div>
        <div className={styles.orgInfo}>
          <div className={styles.infoElement}>
            <EmailIcon />
            <span>
              {result.email}
            </span>
          </div>
          <div className={styles.infoElement}>
            <PhoneIcon />
            <span>
              {result.phone}
            </span>
          </div>
          <div className={styles.infoElement}>
            <AddressIcon />
            <span>
              {result.address}
            </span>
          </div>
        </div>
        <div className={styles.sections}>
          <div className={styles.buttons}>
            <div>
              <Button text="Miembros" onClick={() => setSections('Miembros')} />
              {sections === 'Miembros' && (<hr className={styles.sectionSelect} />)}
            </div>
            <div>
              <Button text="Solicitudes" onClick={() => setSections('Solicitudes')} />
              {sections === 'Solicitudes' && (<hr className={styles.sectionSelect} />)}
            </div>
            <div>
              <Button text="Productos" onClick={() => setSections('Productos')} />
              {sections === 'Productos' && (<hr className={styles.sectionSelect} />)}
            </div>
            <div>
              <Button text="Ordenes Confirmadas" onClick={() => setSections('Ordenes Confirmadas')} />
              {sections === 'Ordenes Confirmadas' && (<hr className={styles.sectionSelect} />)}
            </div>
          </div>

          <hr />
          <InputSelect
            options={[
              { value: 'Miembros', title: 'Miembros' },
              { value: 'Solicitudes', title: 'Solicitudes' },
              { value: 'Productos', title: 'Productos' },
              { value: 'Ordenes Confirmadas', title: 'Ordenes Confirmadas' },
            ]}
            placeholder="Seleccionar sección"
            value={sections}
            onChange={(e) => setSections(e.target.value)}
            className={styles.selectSection}
          />
          <div className={styles.section}>
            {sections === 'Miembros' && <Members orgId={orgId} orgName={result.name} />}
            {sections === 'Solicitudes' && <Requests orgId={orgId} orgName={result.name} />}
            {sections === 'Productos' && <OrganizationProductsPage />}
            {sections === 'Ordenes Confirmadas' && <ConfirmedOrders orgId={orgId} />}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default OrganizationView;
