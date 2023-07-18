import React, { useState } from 'react';
import NavBar from '@components/NavBar/NavBar';
import PropTypes from 'prop-types';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/LocalPhone';
import AddressIcon from '@mui/icons-material/LocationOn';
import Button from '../../../components/Button/Button';
import Members from './Members';
import InputSelect from '../../../components/InputSelect/InputSelect';
import styles from './OrganizationView.module.css';

function OrganizationView({
  orgName, orgAddress, orgPhone, orgEmail,
}) {
  const [sections, setSections] = useState('Miembros');
  return (
    <div className={styles.organizationView}>
      <NavBar loggedIn />
      <div className={styles.orgName}>
        <h1>
          Liceo Javier
          {orgName}
        </h1>
        <Button text="Administrar" type="secondary" />
      </div>
      <div className={styles.orgInfo}>
        <div className={styles.infoElement}>
          <EmailIcon />
          <span>
            liceojavier@gmai.edu.gt
            {orgEmail}
          </span>
        </div>
        <div className={styles.infoElement}>
          <PhoneIcon />
          <span>
            5256-25415
            {orgPhone}
          </span>
        </div>
        <div className={styles.infoElement}>
          <AddressIcon />
          <span>
            Villa Nueva
            {orgAddress}
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
            <Button text="Pedidos confirmados" onClick={() => setSections('Pedidos')} />
            {sections === 'Pedidos' && (<hr className={styles.sectionSelect} />)}
          </div>
        </div>

        <hr />
        <InputSelect
          options={[{ value: 'Miembros', title: 'Miembros' },
            { value: 'Solicitudes', title: 'Solicitudes' },
            { value: 'Pedidos', title: 'Pedidos confirmados ' }]}
          placeholder="Seleccionar sección"
          value={sections}
          onChange={(e) => setSections(e.target.value)}
          className={styles.selectSection}
        />
        <div className={styles.section}>
          {sections === 'Miembros' && <Members orgName={orgName} /> }
        </div>
      </div>
    </div>
  );
}

OrganizationView.propTypes = {
  orgName: PropTypes.string.isRequired,
  orgAddress: PropTypes.string.isRequired,
  orgPhone: PropTypes.string.isRequired,
  orgEmail: PropTypes.string.isRequired,
};

export default OrganizationView;
