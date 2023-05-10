import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '@pages/UnloggedView/LoginPage';
import NewOrderRequest from '@pages/UnloggedView/NewOrderRequest';

function UnloggedMainPage() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/newOrder" element={<NewOrderRequest />} />
    </Routes>
  );
}

export default UnloggedMainPage;
