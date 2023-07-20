import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '@pages/UnloggedView/LoginPage';
import NewOrderRequest from '@pages/UnloggedView/NewOrderRequest';
import Portfolio from '@pages/Portfolio';
import FinishRegistrationPage from '../FinishRegistrationPage/FinishRegistrationPage';

function UnloggedMainPage() {
  return (
    <Routes>

      <Route path="/*" element={<Portfolio />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/newOrder" element={<NewOrderRequest />} />
      <Route path="/registro" element={<FinishRegistrationPage />} />
    </Routes>
  );
}

export default UnloggedMainPage;
