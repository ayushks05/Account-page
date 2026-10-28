import React, { useState } from 'react'
import { Link } from 'react-router'
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

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
                seterror("Too many attempts. Please try again later.");
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
        <main className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
            <section className='w-full max-w-md rounded-2xl bg-white p-8 shadow-sm'>
                <h1 className='text-2xl font-bold'>Forgot your Password?</h1>
                <p className='mt-2 text-sm text-gray-600'>Enter your email address to request a password reset.</p>
                <form onSubmit={handleSumbit} noValidate className='mt-6'>
                    <label htmlFor="email" className='mb-2 block text-sm font-medium text-gray-700'>Email address</label>
                    <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete='email'
                    placeholder='Enter your email address.'
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    value={email}
                    onChange={(e) => {
                        setemail(e.target.value);
                        seterror("");
                        setmessage("");
                    }}
                    />
                    {error && (
                        <p role='alert' className='mt-2 text-sm text-red-600'>{error}</p>
                    )}
                    {message && (
                        <p role='status' className='mt-2 text-sm text-green-700'>{message}</p>
                    )}
                    <button
                        type='submit'
                        disabled={loading}
                        className="mt-5 w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 hover:cursor-pointer"
                        >
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Remember your password?{"  "}
                    <Link to="/login" className="font-medium text-black underline">
                        Back to login
                    </Link>
                </p>
            </section>
        </main>
    )
}
