import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Shop from './pages/Shop';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <CustomNavbar />
          <main>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
