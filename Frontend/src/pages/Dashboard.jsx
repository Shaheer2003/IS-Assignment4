import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  UserPlus, 
  FileText, 
  LogOut, 
  Activity,
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  const isAdmin = user?.groups?.some(g => g.name === 'Admin');
  const isDoctor = user?.groups?.some(g => g.name === 'Doctor');
  const isReceptionist = user?.groups?.some(g => g.name === 'Receptionist');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleBadge = () => {
    if (isAdmin) return <span className="badge badge-primary">Admin</span>;
    if (isDoctor) return <span className="badge badge-secondary">Doctor</span>;
    if (isReceptionist) return <span className="badge badge-success">Receptionist</span>;
    return null;
  };

  const quickActions = [
    {
      title: 'Patients',
      description: isDoctor ? 'View assigned patients' : 'Manage patient records',
      icon: Users,
      link: '/patients',
      color: 'from-primary-500 to-primary-600',
      show: true
    },
    {
      title: 'Add Staff',
      description: 'Register new doctors and receptionists',
      icon: UserPlus,
      link: '/staff/new',
      color: 'from-secondary-500 to-secondary-600',
      show: isAdmin
    },
    {
      title: 'Audit Logs',
      description: 'View system activity and access logs',
      icon: FileText,
      link: '/logs',
      color: 'from-amber-500 to-amber-600',
      show: isAdmin
    }
  ].filter(action => action.show);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Hospital Management System</h1>
                <p className="text-sm text-slate-500">Secure & Compliant</p>
              </div>
            </div>
            <button onClick={logout} className="btn btn-ghost">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {getGreeting()}, {user?.username}!
          </h2>
          <div className="flex items-center gap-3">
            {getRoleBadge()}
            <span className="text-slate-600">Welcome to your dashboard</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">System Status</p>
                <p className="text-2xl font-bold text-slate-900">Active</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Uptime</p>
                <p className="text-2xl font-bold text-slate-900">99.9%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Last Sync</p>
                <p className="text-2xl font-bold text-slate-900">{new Date().toLocaleTimeString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              // Determine icon background color
              let iconBgClass = 'bg-primary-600';
              if (action.color.includes('secondary')) iconBgClass = 'bg-secondary-600';
              if (action.color.includes('amber')) iconBgClass = 'bg-amber-600';
              
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="group card hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className={`w-14 h-14 ${iconBgClass} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">{action.title}</h4>
                  <p className="text-sm text-slate-600">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Role-specific Information */}
        <div className="mt-8 card bg-primary-50 border-primary-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Your Access Level</h4>
              <p className="text-sm text-slate-700">
                {isAdmin && "You have full administrative access to all system features including user management, patient records, and audit logs."}
                {isDoctor && "You can view and manage your assigned patients with access to medical diagnoses and treatment information."}
                {isReceptionist && "You can manage patient records and assign doctors. Medical information is restricted for privacy."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
