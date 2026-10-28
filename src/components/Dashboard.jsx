import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Dashboard() {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [error, seterror] = useState("");
    const [loggingOut, setloggingOut] = useState(false);

    const handleLogout = async () => {
        setloggingOut(true);
        seterror("");

        try {
            await signOut(auth);
            navigate("/login", { replace: true});
        } catch {
            seterror("Unable to log out. Please try again.");
            setloggingOut(false);
        }
    }

    return (
        <main className='min-h-screen bg-gray-400 p-8'>
            <div className='mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm'>
                <h1 className='text-3xl font-bold'>Welcome, {user?.displayName || "User"}!</h1>
                <p className='mt-3 text-green-900'>You are logged in successfully.</p>
                <p className='mt-2 text-gray-600'>Email: {user?.email}</p>
                {error && (
                    <p role='alert' className='mt-4 text-red-600'>{error}</p>
                )}
                <button
                    type='button'
                    className="mt-6 rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:opacity-60"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    >
                    {loggingOut ? "Logging out..." : "Log out"}
                </button>
            </div>
        </main>
    )
}
