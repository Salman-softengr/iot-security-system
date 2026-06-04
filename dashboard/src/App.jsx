import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DeviceRegistry from './pages/DeviceRegistry';
import DeviceDetail from './pages/DeviceDetail';
import ThreatCenter from './pages/ThreatCenter';
import Analytics from './pages/Analytics';
import Activity from './pages/Activity';
import Settings from './pages/Settings';
import Login from './pages/Login'; // Keep login for auth flow

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/devices" element={<PrivateRoute><DeviceRegistry /></PrivateRoute>} />
        <Route path="/devices/:id" element={<PrivateRoute><DeviceDetail /></PrivateRoute>} />
        <Route path="/threats" element={<PrivateRoute><ThreatCenter /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/activity" element={<PrivateRoute><Activity /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
