import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  UserPlus, 
  User, 
  Lock, 
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AddStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/users/', formData);
      setSuccess(`Successfully created ${formData.role} account for ${formData.username}`);
      setFormData({ username: '', password: '', role: '' });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="page-title">Add Staff Member</h1>
              <p className="text-slate-600 mt-1">Register a new doctor or receptionist</p>
            </div>
            <Link to="/dashboard" className="btn btn-ghost">
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 mb-1">Success</p>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </div>
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                disabled={loading}
                placeholder="Enter username"
              />
              <p className="text-xs text-slate-500 mt-2">
                This will be used for login authentication
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </div>
              </label>
              <input
                type="password"
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                disabled={loading}
                placeholder="Enter secure password"
                minLength="8"
              />
              <p className="text-xs text-slate-500 mt-2">
                Minimum 8 characters required
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </div>
              </label>
              <select
                className="input-field"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
                disabled={loading}
              >
                <option value="">Select a role</option>
                <option value="Doctor">Doctor</option>
                <option value="Receptionist">Receptionist</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">
                Determines access level and permissions
              </p>
            </div>

            {/* Role Information */}
            {formData.role && (
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg animate-fade-in">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-600" />
                  {formData.role} Permissions
                </h4>
                <p className="text-sm text-slate-700">
                  {formData.role === 'Doctor' && 
                    "Can view assigned patients with anonymized personal information and full medical diagnoses."
                  }
                  {formData.role === 'Receptionist' && 
                    "Can manage patient records and assign doctors. Medical information is restricted for privacy."
                  }
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')} 
                className="btn btn-ghost"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Staff Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
