import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SessionProvider } from '@context/SessionContext';
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
