// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReviewPage from './pages/ReviewPage';
import ListenPage from './pages/ListenPage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/review" Component={ReviewPage} />
        <Route path="/listen" Component={ListenPage} />
      </Routes>
    </Router>
  );
};

export default App;
