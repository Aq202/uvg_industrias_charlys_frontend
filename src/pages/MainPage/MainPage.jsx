import React, { useContext } from 'react';
// import PropTypes from 'prop-types';
import SessionContext from '@context/SessionContext';
import UnloggedMainPage from '@pages/UnloggedView/UnloggedMainPage';
import LoadingView from '@components/LoadingView';
import consts from '@helpers/consts';
import CustomerMainPage from '../CustomerView/CustomerMainPage/CustomerMainPage';
import AdminMainPage from '../AdminView/AdminMainPage';
import getTokenPayload from '../../helpers/getTokenPayload';

function MainPage() {
  const { accessToken } = useContext(SessionContext);
  let page = null;
  if (accessToken === null) page = <UnloggedMainPage />;
  else if (accessToken !== undefined) {
    const { role } = getTokenPayload(accessToken);
    switch (role) {
      case consts.role.admin:
        page = <AdminMainPage />;
        break;
      case consts.role.client:
        page = <CustomerMainPage />;
        break;
      default:
        break;
    }
  } else page = <LoadingView />;

  return (
    page
  );
}

export default MainPage;

MainPage.propTypes = {

};

MainPage.defaultProps = {

};
