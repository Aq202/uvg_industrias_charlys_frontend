import React from 'react';
import UnloggedMainPage from '@pages/UnloggedView/UnloggedMainPage';
import LoadingView from '@components/LoadingView';
import consts from '@helpers/consts';
import CustomerMainPage from '../CustomerView/CustomerMainPage/CustomerMainPage';
import AdminMainPage from '../AdminView/AdminMainPage';
import getTokenPayload from '../../helpers/getTokenPayload';
import useToken from '../../hooks/useToken';

function MainPage() {
  const token = useToken();
  let page = null;
  if (token === null) page = <UnloggedMainPage />;
  else if (token !== undefined) {
    const { role } = getTokenPayload(token);
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
