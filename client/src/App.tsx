// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReviewPage from './pages/ReviewPage';
import ListenPage from './pages/ListenPage';
import HomePage from './pages/HomePage';


const App: React.FC = () => {
  return (
    <>
      {/* <Navbar bg="light" data-bs-theme="light">
          <Container>
            <Navbar.Brand href="#home">Home</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="#listen">Listen</Nav.Link>
              <Nav.Link href="#converse">Conversation</Nav.Link>
              <Nav.Link href="#review">Review</Nav.Link>
            </Nav>
          </Container>
      </Navbar> */}
      <Router>
        <Routes>
          <Route path="/" Component={HomePage}/>
          <Route path="/review" Component={ReviewPage} />
          <Route path="/listen" Component={ListenPage} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
