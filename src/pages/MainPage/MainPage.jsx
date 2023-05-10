import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
import SessionContext from '../../context/SessionContext';
import UnloggedMainPage from '../UnloggedView/UnloggedMainPage/UnloggedMainPage';
// import getTokenPayload from '../../helpers/getTokenPayload';

function MainPage() {
  const { accessToken } = useContext(SessionContext);
  let page = null;
  if (accessToken === null) page = <UnloggedMainPage />;
  else if (accessToken !== undefined) {
    // const { role } = getTokenPayload(accessToken);
    page = 'Loggeado';
  } else {
    page = 'Aun como undefined';
  }

  return (
    page
  );
}

export default MainPage;

MainPage.propTypes = {

};

MainPage.defaultProps = {

};
