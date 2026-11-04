import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import harry from '../assets/Image/Harry.jpeg';

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
        <main className='dashboard-shell'>
            <div className='dashboard-card'>
                <div className='dashboard-brand'>
                    <img className='brand-mark' src={harry} alt='' aria-hidden='true' />
                    <span>Firebase Auth</span>
                    <span className='dashboard-divider' aria-hidden='true'>/</span>
                    <span className='dashboard-section'>Account</span>
                </div>
                <div className='dashboard-header'>
                    <div>
                        <p className='eyebrow'>Authentication status</p>
                        <h1>Welcome, {user?.displayName || "User"}.</h1>
                    </div>
                    <span className='dashboard-badge'>Signed in</span>
                </div>

                <p className='dashboard-meta'>This protected page is available to your signed-in Firebase user.</p>

                <div className='dashboard-grid'>
                    <div className='dashboard-stat'>
                        <span className='label'>Email</span>
                        <span className='value'>{user?.email}</span>
                    </div>
                    <div className='dashboard-stat'>
                        <span className='label'>Email status</span>
                        <span className='value'>{user?.emailVerified ? "Verified" : "Unverified"}</span>
                    </div>
                </div>

                {error && (
                    <p role='alert' className='form-error'>{error}</p>
                )}

                <div className='dashboard-actions'>
                    <button
                        type='button'
                        className='dashboard-button'
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? "Logging out..." : "Log out"}
                    </button>
                </div>
            </div>
        </main>
    )
}
