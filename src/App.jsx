import React from 'react';
import NavBar from './components/customer_view/NavBar';
import NewOrderRequest from './pages/customer_view/NewOrderRequest/NewOrderRequest';
import './App.css';

function App() {
  return (
    <>
      <NavBar loggedIn />
      <NewOrderRequest />
    </>
  )
}

export default App;
