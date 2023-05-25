import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrdersList from '../OrdersList/OrdersList';
import NewArticle from '../NewArticle/NewArticle';
import Inventory from '../Inventory/Inventory';

function AdminMainPage() {
  return (
    <Routes>
      <Route path="*" element={<OrdersList />} />
      <Route path="/inventario" element={<Inventory />} />
      <Route path="/inventario/nuevo" element={<NewArticle />} />
    </Routes>
  );
}

export default AdminMainPage;
