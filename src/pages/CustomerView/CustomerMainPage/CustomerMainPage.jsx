import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UnderConstruccionPage from '../../UnderConstruccionPage/UnderConstruccionPage';
import PageContainer from '../../PageContainer/PageContainer';
import NewCustomerOrderRequest from '../../NewCustomerOrderRequest/NewCustomerOrderRequest';
import CustomerProductsPage from '../CustomerProductsPage';
import NewProductModelPage from '../../NewProductModelPage/NewProductModelPage';

function CustomerMainPage() {
  return (
    <PageContainer>
      <Routes>
        <Route path="*" element={<UnderConstruccionPage />} />
        <Route path="/orden/nuevo" element={<NewCustomerOrderRequest />} />
        <Route path="/productos" element={<CustomerProductsPage />} />
        <Route path="/producto/nuevo" element={<NewProductModelPage clientView />} />
      </Routes>
    </PageContainer>
  );
}

export default CustomerMainPage;
