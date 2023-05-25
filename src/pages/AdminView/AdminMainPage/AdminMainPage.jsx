import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrdersList from '../OrdersList/OrdersList';
import NewArticle from '../NewArticle/NewArticle';
import Inventory from '../Inventory/Inventory';
import ImagePickerPage from '../ImagePickerPage/ImagePickerPage';
import OrderRequest from '../OrderRequest/OrderRequest';

function AdminMainPage() {
  return (
    <Routes>
      <Route path="*" element={<OrdersList />} />
      <Route path="/inventario" element={<Inventory />} />
      <Route path="/inventario/nuevo" element={<NewArticle />} />
      <Route path="/image" element={<ImagePickerPage />} />
      <Route path="/orden/:orderId" element={<OrderRequest />} />
    </Routes>
  );
}

export default AdminMainPage;
