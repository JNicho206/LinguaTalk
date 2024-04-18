// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReviewPage from './pages/ReviewPage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/review" Component={ReviewPage} />
      </Routes>
    </Router>
  );
};

export default App;
