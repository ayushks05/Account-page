import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, useNavigate, Link } from 'react-router';
import { reload, sendEmailVerification } from 'firebase/auth';

export default function VerifyEmail() {

    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [sending, setsending] = useState();
    const [checking, setchecking] = useState();
    const [message, setmessage] = useState();
    const [error, seterror] = useState();

    if (loading) {
        return <p className='p-6'>Checking authentication...</p>
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
        <main className='min-h-screen flex justify-center items-center bg-gray-400 px-4'>
            <section className='w-full max-w-md rounded-2xl bg-white p-8 shadow-sm'>
                <h1 className='text-2xl font-bold'>Verify your email</h1>
                <p className='mt-3 text-gray-600'>
                    We sent a verification link to{" "}
                    <strong>{user.email}</strong>
                </p>
                <button
                    type='button'
                    onClick={handleCheckVerification}
                    disabled={checking}
                    className="mt-6 w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-60 hover:bg-gray-500 hover:cursor-pointer"
                >
                    {checking ? "Checking..." : "I've verified my email"}
                </button>
                <button
                    type='button'
                    disabled={sending}
                    onClick={handleResendEmail}
                    className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 disabled:opacity-60 hover:cursor-pointer"
                >
                    {sending ? "Sending..." : "Resend verification email"}
                </button>
                {message && (
                    <p role='status' className='mt-4 text-sm text-green-700'>{message}</p>
                )}
                {error && (
                    <p role='alert' className='mt-4 text-sm text-red-700'>{error}</p>
                )}
                <p className="mt-6 text-center text-sm text-gray-600">
                    <Link to="/login" className='underline'>
                        Back to login
                    </Link>
                </p>
            </section>
        </main>
    )
}
