import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Calendar, 
  Phone, 
  FileText,
  UserCheck,
  AlertCircle,
  Lock
} from 'lucide-react';

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = !!id;
  const { user } = useAuth();
  const isReceptionist = user?.groups?.some(g => g.name === 'Receptionist');

  const [formData, setFormData] = useState({
    name: '',
    diagnosis: '',
    age: '',
    contact: '',
    assigned_doctor: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
    if (isEditMode) {
      fetchPatient();
    }
  }, [id]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/users/doctors/');
      setDoctors(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    }
  };

  const fetchPatient = async () => {
    try {
      const response = await api.get(`/patients/${id}/`);
      const data = response.data;
      setFormData({
        name: data.name,
        diagnosis: data.diagnosis === 'RESTRICTED' ? '' : data.diagnosis, 
        age: data.age,
        contact: data.contact,
        assigned_doctor: data.assigned_doctor || ''
      });
    } catch (error) {
      setError('Failed to fetch patient details.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isEditMode) {
        await api.put(`/patients/${id}/`, formData);
      } else {
        await api.post('/patients/', formData);
      }
      navigate('/patients');
    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = 'Failed to save patient.';
      
      if (errorData) {
        if (typeof errorData === 'object') {
           errorMessage = Object.entries(errorData)
             .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
             .join('\n');
        } else {
           errorMessage = errorData.detail || JSON.stringify(errorData);
        }
      }
      setError(errorMessage);
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
              <h1 className="page-title">
                {isEditMode ? 'Edit Patient' : 'Register New Patient'}
              </h1>
              <p className="text-slate-600 mt-1">
                {isEditMode ? 'Update patient information' : 'Add a new patient to the system'}
              </p>
            </div>
            <Link to="/patients" className="btn btn-ghost">
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
                <p className="text-sm text-red-700 whitespace-pre-wrap">{error}</p>
              </div>
            </div>
          )}

          {isReceptionist && isEditMode && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800 mb-1">Limited Access</p>
                <p className="text-sm text-amber-700">
                  You can only modify the assigned doctor. Other fields are read-only for privacy.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Patient Name
                  </div>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  disabled={isReceptionist}
                  placeholder="Enter patient's full name"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Age
                  </div>
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required
                  disabled={isReceptionist}
                  placeholder="Enter age"
                  min="0"
                  max="150"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Information
                </div>
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                required
                disabled={isReceptionist}
                placeholder="Enter phone number or email"
              />
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Diagnosis (Encrypted)
                </div>
              </label>
              <textarea
                className="input-field min-h-[120px]"
                value={formData.diagnosis}
                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                required={!isEditMode && !isReceptionist} 
                disabled={isReceptionist}
                placeholder={isEditMode && formData.diagnosis === '' ? "Diagnosis is hidden/restricted." : "Enter medical diagnosis and notes"}
              />
              <p className="text-xs text-slate-500 mt-2">
                This information will be encrypted and only visible to authorized medical staff
              </p>
            </div>

            {/* Assigned Doctor */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Assigned Doctor
                </div>
              </label>
              <select
                className="input-field"
                value={formData.assigned_doctor}
                onChange={(e) => setFormData({...formData, assigned_doctor: e.target.value})}
              >
                <option value="">Select a Doctor</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.first_name && doc.last_name ? `Dr. ${doc.first_name} ${doc.last_name}` : doc.username}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-2">
                Assign a doctor to this patient for medical care
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <button 
                type="button" 
                onClick={() => navigate('/patients')} 
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditMode ? 'Update Patient' : 'Register Patient'}
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

export default PatientForm;
