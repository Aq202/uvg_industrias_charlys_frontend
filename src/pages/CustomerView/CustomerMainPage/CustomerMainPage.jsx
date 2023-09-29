import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UnderConstruccionPage from '../../UnderConstruccionPage/UnderConstruccionPage';
import PageContainer from '../../PageContainer/PageContainer';
import NewCustomerOrderRequest from '../../NewCustomerOrderRequest/NewCustomerOrderRequest';
import CustomerProductsPage from '../CustomerProductsPage';
import NewProductModelPage from '../../NewProductModelPage/NewProductModelPage';
import ProductDetailsPage from '../../ProductDetailsPage/ProductDetailsPage';
import ConfirmedOrdersPage from '../../ConfirmedOrdersPage/ConfirmedOrdersPage';
import RequestedOrdersPage from '../../RequestedOrdersPage/RequestedOrdersPage';
import ConfirmedOrderAdminPage from '../../AdminView/OrdersList/ConfirmedOrderAdminPage';
import OrderRequest from '../../AdminView/OrderRequest/OrderRequest';

function CustomerMainPage() {
  return (
    <PageContainer>
      <Routes>
        <Route path="*" element={<UnderConstruccionPage />} />
        <Route path="/orden/nuevo" element={<NewCustomerOrderRequest />} />
        <Route path="/productos" element={<CustomerProductsPage />} />
        <Route path="/producto/nuevo" element={<NewProductModelPage clientView />} />
        <Route path="/producto/:id" element={<ProductDetailsPage model />} />
        <Route path="/newOrderRequest" element={<NewCustomerOrderRequest />} />
        <Route path="/orden" element={<ConfirmedOrdersPage />} />
        <Route path="/orden/:idOrder" element={<ConfirmedOrderAdminPage />} />
        <Route path="/solicitudOrden" element={<RequestedOrdersPage />} />
        <Route path="/solicitudOrden/:orderId" element={<OrderRequest />} />

      </Routes>
    </PageContainer>
  );
}

export default CustomerMainPage;
