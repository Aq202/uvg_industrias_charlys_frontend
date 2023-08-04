import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '@pages/UnloggedView/LoginPage';
import NewOrderRequest from '@pages/UnloggedView/NewOrderRequest';
import Portfolio from '@pages/Portfolio';
import FinishRegistrationPage from '../FinishRegistrationPage/FinishRegistrationPage';
import PageContainer from '../../PageContainer/PageContainer';

function UnloggedMainPage() {
  return (
    <Routes>

      <Route path="/*" element={<PageContainer><Portfolio /></PageContainer>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/newOrder" element={<PageContainer><NewOrderRequest /></PageContainer>} />
      <Route path="/registro" element={<PageContainer><FinishRegistrationPage /></PageContainer>} />
    </Routes>
  );
}

export default UnloggedMainPage;
