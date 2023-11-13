import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PageContainer from '@pages/PageContainer';
import OrdersList from '../OrdersList/OrdersList';
import NewArticle from '../NewArticle/NewArticle';
import ImagePickerPage from '../ImagePickerPage/ImagePickerPage';
import OrderRequest from '../OrderRequest/OrderRequest';
import OrganizationsPage from '../Organizations/OrganizationsPage';
import OrganizationView from '../OrganizationView/OrganizationView';
import NewProductModelPage from '../../NewProductModelPage/NewProductModelPage';
import OrganizationProductsPage from '../../OrganizationProductsPage/OrganizationProductsPage';
import UpdateProductModelPage from '../../UpdateProductModelPage';
import ProductDetailsPage from '../../ProductDetailsPage/ProductDetailsPage';
import NotFoundPage from '../../NotFoundPage/NotFoundPage';
import ConfirmedOrderAdminPage from '../OrdersList/ConfirmedOrderAdminPage';
import ProductionControlPage from '../../ProductionControlPage/ProductionControlPage';
import EditOrderPage from '../EditOrderPage/EditOrderPage';
import NewAdminOrderRequestPage from '../NewAdminOrderRequestPage/NewAdminOrderRequestPage';
import FinishedOrdersPage from '../../FinishedOrdersPage/FinishedOrdersPage';
import Config from '../Config/Config';
import InventoryIndex from '../Inventory/InventoryIndex';
import Home from '../../Home/Home';

function AdminMainPage() {
  return (
    <PageContainer>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orderList" element={<OrdersList />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/inventario/nuevo" element={<NewArticle />} />
        <Route path="/inventario/*" element={<InventoryIndex />} />
        <Route path="/image" element={<ImagePickerPage />} />
        <Route path="/orden/:orderId" element={<OrderRequest />} />
        <Route path="/orden/:orderId/editar" element={<EditOrderPage />} />
        <Route path="/orden" element={<OrdersList />} />
        <Route path="/orden/finalizadas" element={<FinishedOrdersPage />} />
        <Route path="/orden/nuevo" element={<NewAdminOrderRequestPage />} />
        <Route path="organizacion/:orgId" element={<OrganizationView />} />
        <Route path="/organizaciones" element={<OrganizationsPage />} />
        <Route path="/producto/nuevo" element={<NewProductModelPage />} />
        <Route path="/producto/:productId/editar" element={<UpdateProductModelPage />} />
        <Route path="/organizacion/:orgId/productos" element={<OrganizationProductsPage />} />
        <Route path="/producto/:id" element={<ProductDetailsPage />} />
        <Route path="/producto/modelo/:id" element={<ProductDetailsPage model />} />
        <Route path="/ordenConfirmada/:idOrder" element={<ConfirmedOrderAdminPage />} />
        <Route path="/produccion" element={<ProductionControlPage />} />
        <Route path="/produccion/:orderId/*" element={<ProductionControlPage />} />
        <Route path="/config/*" element={<Config />} />
      </Routes>
    </PageContainer>
  );
}

export default AdminMainPage;
