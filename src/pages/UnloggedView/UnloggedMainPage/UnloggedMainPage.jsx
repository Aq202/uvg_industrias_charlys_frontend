import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '@pages/UnloggedView/LoginPage';
import NewOrderRequest from '@pages/UnloggedView/NewOrderRequest';
import Portfolio from '@pages/Portfolio';

function UnloggedMainPage() {
  return (
    <Routes>

      <Route path="/*" element={<Portfolio />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/newOrder" element={<NewOrderRequest />} />
    </Routes>
  );
}

export default UnloggedMainPage;
