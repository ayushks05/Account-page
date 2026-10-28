import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet, useLocation } from 'react-router';

export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <p className='p-6 min-h-screen flex justify-center items-center'>Checking authentication...</p>
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
    const needsEmailVerification = user.providerData.some(
        (provider) => provider.providerId === "password"
    ) && !user.emailVerified;

    if (needsEmailVerification && !user.emailVerified) {
        return <Navigate to="/verify-email" replace></Navigate>
    }

    return <Outlet />;
}
