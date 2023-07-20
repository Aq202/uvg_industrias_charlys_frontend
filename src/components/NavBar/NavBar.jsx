/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import logoutIcon from '@assets/logoutIcon.svg';
import hamburgerMenu from '../../assets/hamburger_menu.svg';
import userProfilePic from '../../assets/user_place_holder.svg';
// import inProgress from '../../assets/in_progress.svg';
// import finishedOrders from '../../assets/done.svg';
// import newOrder from '../../assets/place_new_order.svg';
// import myOrganization from '../../assets/building_icon.svg';
import styles from './NavBar.module.css';
import useToken from '../../hooks/useToken';
import getTokenPayload from '../../helpers/getTokenPayload';
import consts from '../../helpers/consts';
import useLogout from '../../hooks/useLogout';

function NavBar({ loggedIn }) {
  const [displayMenu, setDisplayMenu] = useState(false);
  const token = useToken();
  const [userData, setUserData] = useState();
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setUserData(null);
      return;
    }
    // Obtener datos del token
    const tokenUserData = getTokenPayload(token);
    let role;

    switch (tokenUserData?.role) {
      case consts.role.admin:
        role = 'Administrador';
        break;
      default:
        role = 'Usuario';
    }

    tokenUserData.role = role;
    setUserData(tokenUserData);
  }, [token]);

  const logoutHandler = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        {loggedIn && (
          <div className={styles.loggedUserContainer}>
            <div className={styles.hamburgerMenuContainer}>
              <img
                className={styles.hamburgerMenu}
                src={hamburgerMenu}
                alt="menu"
                onClick={() => setDisplayMenu(!displayMenu)}
              />
            </div>
            <div className={styles.userInfoContainer}>
              <div className={styles.profilePicContainer}>
                <img className={styles.profilePic} src={userProfilePic} alt="PFP" />
              </div>
              <div className={styles.userCredentialsContainer}>
                <p className={styles.userName}>{`${userData?.name} ${userData?.lastName}`}</p>
                <p className={styles.userOrganization}>{userData?.role}</p>
              </div>
            </div>
          </div>
        )}
        {!loggedIn && (
          <div className={styles.unLoggedUserContainer}>
            <div className={styles.buttonsContainer}>
              <Link to="/newOrder">
                <button className={styles.signUpButton} type="submit">Nueva compra</button>
              </Link>
              <Link to="/login">
                <button className={styles.loginButton} type="submit">Iniciar sesión</button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className={`${styles.sideMenu} ${!displayMenu ? styles.hideMenu : ''}`}>
        <p className={styles.menuTitle}>Menú</p>
        <div className={styles.optionsContainer}>
          {/* <div className={styles.menuItem}>
            <img className={styles.menuIcon} src={inProgress} alt="Icon" />
            <p>Pedidos en progreso</p>
          </div>
          <div className={styles.menuItem}>
            <img className={styles.menuIcon} src={finishedOrders} alt="Icon" />
            <p>Pedidos completados</p>
          </div>
          <div className={styles.menuItem}>
            <img className={styles.menuIcon} src={newOrder} alt="Icon" />
            <p>Realizar nuevo pedido</p>
          </div>
          <div className={styles.menuItem}>
            <img className={styles.menuIcon} src={myOrganization} alt="Icon" />
            <p>Mi organización</p>
          </div> */}
          <div className={styles.menuItem} onClick={() => navigate('/orden')}>
            <img className={styles.menuIcon} src={logoutIcon} alt="Icon" />
            <p>Pedidos recibidos</p>
          </div>
          <div className={styles.menuItem} onClick={() => navigate('/inventario')}>
            <img className={styles.menuIcon} src={logoutIcon} alt="Icon" />
            <p>Inventario</p>
          </div>
          <div className={styles.menuItem} onClick={() => navigate('/organizaciones')}>
            <img className={styles.menuIcon} src={logoutIcon} alt="Icon" />
            <p>Organizaciones</p>
          </div>
          <div className={styles.menuItem} onClick={logoutHandler}>
            <img className={styles.menuIcon} src={logoutIcon} alt="Icon" />
            <p>Salir</p>
          </div>
        </div>
      </div>
    </div>
  );
}

NavBar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

export default NavBar;
