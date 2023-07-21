import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import UnderConstruccionPage from '../../UnderConstruccionPage/UnderConstruccionPage';

function CustomerMainPage() {
  return (
    <>
      <NavBar loggedIn />
      <Routes>
        <Route path="*" element={<UnderConstruccionPage />} />
      </Routes>
    </>
  );
}

export default CustomerMainPage;
