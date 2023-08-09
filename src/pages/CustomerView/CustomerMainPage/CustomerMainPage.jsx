import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UnderConstruccionPage from '../../UnderConstruccionPage/UnderConstruccionPage';
import PageContainer from '../../PageContainer/PageContainer';

function CustomerMainPage() {
  return (
    <PageContainer>
      <Routes>
        <Route path="*" element={<UnderConstruccionPage />} />
      </Routes>
    </PageContainer>
  );
}

export default CustomerMainPage;
