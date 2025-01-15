import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
// import TaskDetails from './components/TaskDetails';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/task/:id" element={<TaskDetails />} /> */}
      </Routes>
    </Router>
  );
}

export default App;