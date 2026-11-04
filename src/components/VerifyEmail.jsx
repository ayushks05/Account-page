import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, useNavigate, Link } from 'react-router';
import { reload, sendEmailVerification } from 'firebase/auth';
import harry from '../assets/Image/Harry.jpeg';

export default function VerifyEmail() {

    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [sending, setsending] = useState();
    const [checking, setchecking] = useState();
    const [message, setmessage] = useState();
    const [error, seterror] = useState();

    if (loading) {
        return <main className="auth-page"><p className="auth-loading">Checking Firebase authentication...</p></main>
    }
    if (!user) {
        return <Navigate to="/login" replace/>
    }
    const isEmailPasswordUser = user.providerData.some(
        (provider) => provider.providerId === "password"
    );
    if (!isEmailPasswordUser || user.emailVerified) {
        return <Navigate to="/dashboard" replace/>
    }

    const handleResendEmail = async () => {
        setsending(true);
        setmessage("");
        seterror("");

        try {
            await sendEmailVerification(user);
            setmessage("Verification email sent. Check your inbox and spam folder.");
        } catch (error) {
            console.error("Resend verification error:", error.code);

            seterror(
                error.code === "auth/too-many-requests"
                ? "Too many requests. Please try again later."
                : "Unable to send the email. Please try again."
            )
        } finally {
            setsending(false);
        }
    }
    const handleCheckVerification = async () => {
        setchecking(true);
        setmessage("");
        seterror("");

        try {
            await reload(user);

            if (user.emailVerified) {
                navigate("/dashboard", { replace: true });
            } else {
                setmessage("Your email is not verified yet. Open the verification link and try again.");
            }
        } catch (error) {
            console.error("Verification check failed:", error.code);
            seterror("Unable to refresh your status. Please try again.");
        } finally {
            setchecking(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-form-shell auth-utility-card">
                <div className="dashboard-brand">
                    <img className="brand-mark" src={harry} alt="" aria-hidden="true" />
                    <span>Firebase Auth <span className="brand-suffix">Practice</span></span>
                </div>
                <div className="auth-header">
                    <span className="top-pill">Email verification</span>
                    <h1>Check your inbox</h1>
                    <p>Firebase sent a verification link to <strong className="verified-email">{user.email}</strong></p>
                </div>
                <button
                    type='button'
                    onClick={handleCheckVerification}
                    disabled={checking}
                    className="primary-button"
                >
                    {checking ? "Checking..." : "I've verified my email"}
                </button>
                <button
                    type='button'
                    disabled={sending}
                    onClick={handleResendEmail}
                    className="secondary-button"
                >
                    {sending ? "Sending..." : "Resend verification email"}
                </button>
                {message && (
                    <p role='status' className='form-success utility-message'>{message}</p>
                )}
                {error && (
                    <p role='alert' className='form-error utility-message'>{error}</p>
                )}
                <p className="auth-utility-footer">
                    <Link to="/login">
                        Back to login
                    </Link>
                </p>
            </section>
        </main>
    )
}
