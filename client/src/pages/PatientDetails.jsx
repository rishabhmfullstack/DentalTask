import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Send, User, Bot, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientDetails = () => {
    const { id } = useParams();
    const [message, setMessage] = useState('');
    const queryClient = useQueryClient();
    const bottomRef = useRef(null);

    const { data: patient, isLoading: patientLoading } = useQuery({
        queryKey: ['patient', id],
        queryFn: async () => (await api.get(`/patients/${id}`)).data,
    });

    const { data: history, isLoading: historyLoading } = useQuery({
        queryKey: ['chat', id],
        queryFn: async () => (await api.get(`/chat/${id}`)).data,
        refetchInterval: 5000,
    });

    const sendMessageMutation = useMutation({
        mutationFn: (msg) => api.post('/chat', { patientId: id, message: msg }),
        onSuccess: () => {
            queryClient.invalidateQueries(['chat', id]);
            setMessage('');
        },
    });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        sendMessageMutation.mutate(message);
    };

    if (patientLoading) return <div>Loading...</div>;

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">
            {/* Patient Info Sidebar */}
            <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow h-fit">
                <Link to="/" className="flex items-center text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Link>
                <h2 className="text-2xl font-bold mb-4">{patient.name}</h2>
                <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p><strong>Phone:</strong> {patient.phone}</p>
                    <p><strong>DOB:</strong> {new Date(patient.dob).toLocaleDateString()}</p>
                    <div className="mt-4">
                        <strong>Medical Notes:</strong>
                        <p className="bg-gray-50 p-3 rounded mt-1 text-sm">{patient.medicalNotes || 'No notes available.'}</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-lg shadow flex flex-col overflow-hidden">
                <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700">
                    Assistant Chat
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {historyLoading ? (
                        <div>Loading chat...</div>
                    ) : (
                        history?.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600 ml-2' : 'bg-gray-200 text-gray-600 mr-2'}`}>
                                        {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className={`p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {sendMessageMutation.isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-500">
                                Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
                    <input
                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={sendMessageMutation.isLoading}
                    />
                    <button
                        type="submit"
                        disabled={sendMessageMutation.isLoading}
                        className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientDetails;
