import React from 'react';
import { SessionProvider } from '@context/SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import MainPage from '@pages/MainPage';

function App() {
  return (
    <Router>
      <SessionProvider>
        <MainPage />
      </SessionProvider>
    </Router>
  );
}

export default App;
