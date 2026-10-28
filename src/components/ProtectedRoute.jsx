import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet, useLocation } from 'react-router';

export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <p className='p-6 flex justify-center items-center'>Checking authentication...</p>
    }
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}
