/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import hamburgerMenu from '../../assets/hamburger_menu.svg';
import userProfilePic from '../../assets/user_place_holder.svg';
import inProgress from '../../assets/in_progress.svg';
import finishedOrders from '../../assets/done.svg';
import newOrder from '../../assets/place_new_order.svg';
import myOrganization from '../../assets/building_icon.svg';
import styles from './NavBar.module.css';
import useToken from '../../hooks/useToken';
import getTokenPayload from '../../helpers/getTokenPayload';
import consts from '../../helpers/consts';

function NavBar({ loggedIn }) {
  const [displayMenu, setDisplayMenu] = useState(false);
  const showMenu = () => (displayMenu ? styles.menuDisplayed : styles.menuHidden);
  const token = useToken();
  const [userData, setUserData] = useState();

  useEffect(() => {
    if (!token) return setUserData(null);
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
    return null;
  }, [token]);

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
      <div className={`${showMenu()}`}>
        <p className={styles.menuTitle}>Menú</p>
        <div className={styles.optionsContainer}>
          <div className={styles.menuItem}>
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
