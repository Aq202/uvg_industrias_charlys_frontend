import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrdersList from '../OrdersList/OrdersList';
import ImagePickerPage from '../ImagePickerPage/ImagePickerPage';
import OrderRequest from '../OrderRequest/OrderRequest';

function AdminMainPage() {
  return (
    <Routes>
      <Route path="*" element={<OrdersList />} />
      <Route path="/image" element={<ImagePickerPage />} />
      <Route path="/orderRequest/:orderId" element={<OrderRequest />} />
    </Routes>
  );
}

export default AdminMainPage;
