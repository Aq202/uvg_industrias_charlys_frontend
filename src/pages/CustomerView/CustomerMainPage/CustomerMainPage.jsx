import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UnderConstruccionPage from '../../UnderConstruccionPage/UnderConstruccionPage';
import PageContainer from '../../PageContainer/PageContainer';
import NewCustomerOrderRequest from '../../NewCustomerOrderRequest/NewCustomerOrderRequest';
import ConfirmedOrdersPage from '../../ConfirmedOrders/ConfirmedOrdersPage';

function CustomerMainPage() {
  return (
    <PageContainer>
      <Routes>
        <Route path="*" element={<UnderConstruccionPage />} />
        <Route path="/newOrderRequest" element={<NewCustomerOrderRequest />} />
        <Route path="/confirmedOrders" element={<ConfirmedOrdersPage />} />
      </Routes>
    </PageContainer>
  );
}

export default CustomerMainPage;
