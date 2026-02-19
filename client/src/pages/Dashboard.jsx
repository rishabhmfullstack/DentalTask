import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Plus, Search, MessageSquare, Trash2 } from 'lucide-react';

const Dashboard = () => {
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', email: '', phone: '', dob: '', medicalNotes: '' });

    const { data, isLoading } = useQuery({
        queryKey: ['patients', page],
        queryFn: async () => {
            const res = await api.get(`/patients?page=${page}&limit=10`);
            return res.data;
        },
        keepPreviousData: true,
    });

    const createMutation = useMutation({
        mutationFn: (newPatient) => api.post('/patients', newPatient),
        onSuccess: () => {
            queryClient.invalidateQueries(['patients']);
            setIsModalOpen(false);
            setNewPatient({ name: '', email: '', phone: '', dob: '', medicalNotes: '' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/patients/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['patients']),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(newPatient);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {data?.patients.map((patient) => (
                        <li key={patient.id} className="p-4 hover:bg-gray-50 flex justify-between items-center leading-auto">
                            <div>
                                <Link to={`/patients/${patient.id}`} className="block text-indigo-600 font-semibold hover:underline">
                                    {patient.name}
                                </Link>
                                <div className="text-sm text-gray-500">
                                    {patient.email} • {patient.phone}
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link to={`/patients/${patient.id}`} className="text-gray-400 hover:text-indigo-600">
                                    <MessageSquare className="h-5 w-5" />
                                </Link>
                                <button
                                    onClick={() => { if (window.confirm('Delete patient?')) deleteMutation.mutate(patient.id); }}
                                    className="text-gray-400 hover:text-red-600"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>Page {page} of {data?.totalPages || 1}</span>
                    <button
                        disabled={page === (data?.totalPages || 1)}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Name"
                                required
                                className="w-full border p-2 rounded"
                                value={newPatient.name}
                                onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                            />
                            <input
                                placeholder="Email"
                                type="email"
                                required
                                className="w-full border p-2 rounded"
                                value={newPatient.email}
                                onChange={e => setNewPatient({ ...newPatient, email: e.target.value })}
                            />
                            <input
                                placeholder="Phone"
                                required
                                className="w-full border p-2 rounded"
                                value={newPatient.phone}
                                onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                            />
                            <input
                                placeholder="Date of Birth"
                                type="date"
                                required
                                className="w-full border p-2 rounded"
                                value={newPatient.dob}
                                onChange={e => setNewPatient({ ...newPatient, dob: e.target.value })}
                            />
                            <textarea
                                placeholder="Medical Notes"
                                className="w-full border p-2 rounded"
                                value={newPatient.medicalNotes}
                                onChange={e => setNewPatient({ ...newPatient, medicalNotes: e.target.value })}
                            />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
