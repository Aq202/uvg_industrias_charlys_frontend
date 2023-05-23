import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrdersList from '../OrdersList/OrdersList';
import ImagePickerPage from '../ImagePickerPage/ImagePickerPage';

function AdminMainPage() {
  return (
    <Routes>
      <Route path="*" element={<OrdersList />} />
      <Route path="/image" element={<ImagePickerPage />} />
    </Routes>
  );
}

export default AdminMainPage;
