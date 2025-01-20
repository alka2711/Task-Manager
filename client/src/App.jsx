import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import MyTasks from './components/MyTasks';
import Analytics from './components/Analytics';
import Login from './components/Login';
import './App.css';
import LandingPage from './components/LandingPage';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<MyTasks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/login" element={<Login />} />
          <Route path="/LandingPage" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;