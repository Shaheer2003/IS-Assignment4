import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Clock, 
  User, 
  Activity,
  Shield,
  Eye,
  Edit,
  UserPlus
} from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/logs/');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('VIEW')) return <Eye className="w-4 h-4" />;
    if (action.includes('CREATE')) return <UserPlus className="w-4 h-4" />;
    if (action.includes('UPDATE')) return <Edit className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getActionBadgeClass = (action) => {
    if (action.includes('VIEW')) return 'badge-secondary';
    if (action.includes('CREATE')) return 'badge-success';
    if (action.includes('UPDATE')) return 'badge-warning';
    return 'badge-primary';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="page-header">
            <div>
              <h1 className="page-title">Audit Logs</h1>
              <p className="text-slate-600 mt-1">System activity and security monitoring</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => window.location.href = 'http://127.0.0.1:8000/api/logs/export_csv/'} 
                className="btn btn-outline"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
              <Link to="/dashboard" className="btn btn-ghost">
                <ArrowLeft className="w-5 h-5" />
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Events</p>
                <p className="text-2xl font-bold text-slate-900">{logs.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Security Level</p>
                <p className="text-2xl font-bold text-slate-900">High</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Last Activity</p>
                <p className="text-2xl font-bold text-slate-900">
                  {logs.length > 0 ? new Date(logs[0].timestamp).toLocaleTimeString() : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Timestamp
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      User
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Action
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="table-row">
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-slate-900">{log.user_name || log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getActionBadgeClass(log.action)}`}>
                        {getActionIcon(log.action)}
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
