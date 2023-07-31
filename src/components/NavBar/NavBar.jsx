import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import hamburgerMenu from '../../assets/hamburger_menu.svg';
import userProfilePic from '../../assets/user_place_holder.svg';
import styles from './NavBar.module.css';
import useToken from '../../hooks/useToken';
import getTokenPayload from '../../helpers/getTokenPayload';
import consts from '../../helpers/consts';

function NavBar({ onMenuChange }) {
  const [displayMenu, setDisplayMenu] = useState(false);
  const token = useToken();
  const [userData, setUserData] = useState();

  useEffect(() => {
    if (!token) return;
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

  useEffect(() => {
    if (onMenuChange) onMenuChange(displayMenu);
  }, [displayMenu]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        {token && (
          <div className={styles.loggedUserContainer}>
            <button
              className={styles.hamburgerButton}
              type="button"
              onClick={() => setDisplayMenu(!displayMenu)}
            >
              <img className={styles.hamburgerMenu} src={hamburgerMenu} alt="menu" />
            </button>
            <div className={styles.userInfoContainer}>
              <div className={styles.profilePicContainer}>
                <img className={styles.profilePic} src={userProfilePic} alt="PFP" />
              </div>
              <div className={styles.userCredentialsContainer}>
                <div className={styles.userName} title={`${userData?.name} ${userData?.lastName}`}>
                  {`${userData?.name} ${userData?.lastName}`}
                </div>
                <div className={styles.userOrganization} title={userData?.role}>
                  {userData?.role}
                </div>
              </div>
            </div>
          </div>
        )}
        {token === null && (
          <div className={styles.unLoggedUserContainer}>
            <div className={styles.buttonsContainer}>
              <Link to="/newOrder">
                <button className={styles.signUpButton} type="submit">
                  Nueva compra
                </button>
              </Link>
              <Link to="/login">
                <button className={styles.loginButton} type="submit">
                  Iniciar sesión
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

NavBar.propTypes = {
  onMenuChange: PropTypes.func,
};

NavBar.defaultProps = {
  onMenuChange: null,
};
export default NavBar;
