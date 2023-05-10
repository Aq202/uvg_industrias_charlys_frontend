import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrdersList from '../OrdersList/OrdersList';

function AdminMainPage() {
  return (
    <Routes>
      <Route path="*" element={<OrdersList />} />
    </Routes>
  );
}

export default AdminMainPage;
