import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  UserPlus, 
  Edit, 
  User, 
  Phone, 
  Calendar,
  Stethoscope,
  Shield
} from 'lucide-react';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const isAdmin = user?.groups?.some(g => g.name === 'Admin');
  const isReceptionist = user?.groups?.some(g => g.name === 'Receptionist');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients/');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading patients...</p>
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
              <h1 className="page-title">Patient Records</h1>
              <p className="text-slate-600 mt-1">Manage and view patient information</p>
            </div>
            <div className="flex gap-3">
              <Link to="/dashboard" className="btn btn-ghost">
                <ArrowLeft className="w-5 h-5" />
                Back
              </Link>
              {isAdmin && (
                <Link to="/patients/new" className="btn btn-primary">
                  <UserPlus className="w-5 h-5" />
                  Register Patient
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {patients.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No patients found</h3>
            <p className="text-slate-600 mb-6">Get started by registering your first patient</p>
            {isAdmin && (
              <Link to="/patients/new" className="btn btn-primary inline-flex">
                <UserPlus className="w-5 h-5" />
                Register Patient
              </Link>
            )}
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Name
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Age
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Diagnosis
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Assigned Doctor
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="table-row">
                      <td className="px-6 py-4">
                        <div>
                          {patient.name ? (
                            <div>
                              <p className="font-medium text-slate-900">{patient.name}</p>
                              {isAdmin && patient.anonymized_name && (
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                  <Shield className="w-3 h-3" />
                                  {patient.anonymized_name.substring(0, 12)}...
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="italic text-slate-500 flex items-center gap-1">
                              <Shield className="w-4 h-4" />
                              {patient.anonymized_name?.substring(0, 12)}...
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{patient.age}</td>
                      <td className="px-6 py-4">
                        {patient.contact ? (
                          <span className="text-slate-700">{patient.contact}</span>
                        ) : (
                          <span className="italic text-slate-500">{patient.anonymized_contact}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {patient.diagnosis === 'RESTRICTED' ? (
                          <span className="badge badge-warning">RESTRICTED</span>
                        ) : (
                          <span className="text-slate-700">{patient.diagnosis}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {patient.assigned_doctor_name || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(isReceptionist || isAdmin) && (
                          <Link
                            to={`/patients/${patient.id}/edit`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
