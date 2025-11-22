import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientForm from './pages/PatientForm';
import AuditLogs from './pages/AuditLogs';

import AddStaff from './pages/AddStaff';
import Loader from './components/Loader';

const PrivateRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0) {
    const hasRole = user.groups.some(g => roles.includes(g.name));
    if (!hasRole) {
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Loader />
      <Router>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/patients" element={
                <PrivateRoute>
                  <PatientList />
                </PrivateRoute>
              } />
              <Route path="/patients/new" element={
                <PrivateRoute roles={['Admin']}>
                  <PatientForm />
                </PrivateRoute>
              } />
              <Route path="/patients/:id/edit" element={
                <PrivateRoute roles={['Receptionist', 'Admin']}>
                  <PatientForm />
                </PrivateRoute>
              } />
              <Route path="/staff/new" element={
                <PrivateRoute roles={['Admin']}>
                  <AddStaff />
                </PrivateRoute>
              } />
              
              <Route path="/logs" element={
                <PrivateRoute roles={['Admin']}>
                  <AuditLogs />
                </PrivateRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
          <footer className="bg-slate-100 py-4 text-center text-slate-500 text-sm border-t border-slate-200">
            <p>System Uptime: 99.9% | Last Sync: {new Date().toLocaleTimeString()}</p>
            <p>&copy; 2024 Hospital Management System. Secure & Compliant.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
