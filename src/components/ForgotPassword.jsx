import { useState } from 'react'
import { Link } from 'react-router'
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import harry from '../assets/Image/Harry.jpeg';

export default function ForgotPassword() {

    const [email, setemail] = useState("");
    const [error, seterror] = useState("");
    const [message, setmessage] = useState("");
    const [loading, setloading] = useState(false);

    const handleSumbit = async (e) => {
        e.preventDefault();

        setmessage("");
        seterror("")

        const trimmedemail = email.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedemail)) {
            seterror("Please enter a valid email address.");
            return;
        }
        setloading(true);

        try {
            await sendPasswordResetEmail(auth, trimmedemail);

            setmessage("If an account exists for this email, a password reset email will be sent. Check your inbox.");
        } catch (error) {
            console.error("Password reset error:", error.code);

            if (error.code === "auth/invalid-email") {
                seterror("Please enter a valid email address.");
            } else if (error.code === "auth/too-many-requests") {
                seterror("Too many requests. Please try again later.");
            } else if (error.code === "auth/network-request-failed") {
                seterror("Network error. Check your internet connection.")
            } else {
                seterror("Unable to process your request. Please try again.");
            }
        } finally {
            setloading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-form-shell auth-utility-card">
                <div className="dashboard-brand">
                    <img className="brand-mark" src={harry} alt="" aria-hidden="true" />
                    <span>Firebase Auth <span className="brand-suffix">Practice</span></span>
                </div>
                <div className="auth-header">
                    <span className="top-pill">Password reset</span>
                    <h1>Forgot your password?</h1>
                    <p>Enter the email address on your account. Firebase will send a reset link if it’s registered.</p>
                </div>
                <form onSubmit={handleSumbit} noValidate className="auth-form">
                    <div className="field-wrapper">
                    <label htmlFor="email" className="field-label">Email address</label>
                    <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete='email'
                    placeholder='you@example.com'
                    className="input-shell"
                    value={email}
                    onChange={(e) => {
                        setemail(e.target.value);
                        seterror("");
                        setmessage("");
                    }}
                    />
                    </div>
                    {error && (
                        <p role='alert' className='form-error'>{error}</p>
                    )}
                    {message && (
                        <p role='status' className='form-success'>{message}</p>
                    )}
                    <button
                        type='submit'
                        disabled={loading}
                        className="primary-button"
                        >
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                </form>
                <p className="auth-utility-footer">
                    Remember your password?{" "}
                    <Link to="/login">
                        Back to login
                    </Link>
                </p>
            </section>
        </main>
    )
}
