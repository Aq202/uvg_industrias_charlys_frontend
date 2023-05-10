import React, { useState } from 'react'
import hamburgerMenu from '../../assets/hamburger_menu.svg'
import userProfilePic from '../../assets/user_place_holder.svg'
import inProgress from '../../assets/in_progress.svg'
import finishedOrders from '../../assets/done.svg'
import newOrder from '../../assets/place_new_order.svg'
import myOrganization from '../../assets/building_icon.svg'
import styles from './NavBar.module.css'

const NavBar = (loggedIn) => {
  const [displayMenu, setDisplayMenu] = useState(false)
  const showMenu = () => (displayMenu ? styles.menuDisplayed : styles.menuHidden)

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        {loggedIn && (
        <div className={styles.loggedUserContainer}>
          <div className={styles.hamburgerMenuContainer}>
            <img className={styles.hamburgerMenu} src={hamburgerMenu} alt="menu" onClick={() => setDisplayMenu(!displayMenu)} />
          </div>
          <div className={styles.userInfoContainer}>
            <div className={styles.profilePicContainer}>
              <img className={styles.profilePic} src={userProfilePic} alt="PFP" />
            </div>
            <div className={styles.userCredentialsContainer}>
              <p className={styles.userName}>Pablo Zamora</p>
              <p className={styles.userOrganization}>Universidad del Valle</p>
            </div>
          </div>
        </div>
        )}
      </div>
      <div className={`${showMenu()}`}>
        <p className={styles.menuTitle}>Menú</p>
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
  )
}

export default NavBar
