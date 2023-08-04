import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PageContainer from '@pages/PageContainer';
import OrdersList from '../OrdersList/OrdersList';
import NewArticle from '../NewArticle/NewArticle';
import Inventory from '../Inventory/Inventory';
import ImagePickerPage from '../ImagePickerPage/ImagePickerPage';
import OrderRequest from '../OrderRequest/OrderRequest';
import OrganizationsPage from '../Organizations/OrganizationsPage';
import NewOrganizationPage from '../NewOrganization/NewOrganizationPage';
import OrganizationView from '../OrganizationView/OrganizationView';
import NewProductModelPage from '../../NewProductModelPage/NewProductModelPage';

function AdminMainPage() {
  return (
    <PageContainer>
      <Routes>
        <Route path="*" element={<OrdersList />} />
        <Route path="/inventario" element={<Inventory />} />
        <Route path="/inventario/nuevo" element={<NewArticle />} />
        <Route path="/image" element={<ImagePickerPage />} />
        <Route path="/orden/:orderId" element={<OrderRequest />} />
        <Route path="/orden" element={<OrdersList />} />
        <Route path="organizacion/:orgId" element={<OrganizationView />} />
        <Route path="/organizaciones" element={<OrganizationsPage />} />
        <Route path="/nuevaOrganizacion" element={<NewOrganizationPage />} />
        <Route path="/producto/nuevo" element={<NewProductModelPage />} />
      </Routes>
    </PageContainer>
  );
}

export default AdminMainPage;
