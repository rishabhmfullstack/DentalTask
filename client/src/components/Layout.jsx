import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex-shrink-0 flex items-center text-xl font-bold text-indigo-600">
                                Teraleads Dental
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4 flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                {user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
