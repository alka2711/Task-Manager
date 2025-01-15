import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import MyTasks from './components/MyTasks';
import Analytics from './components/Analytics';
import Login from './components/Login';
import './App.css';

const App = () => {
  return (
    <Router>
<<<<<<< HEAD
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
=======
      <div>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<MyTasks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
>>>>>>> ffdb0044ec0c4d94d6b99c274fbba51c107114d9
    </Router>
  );
};

export default App;