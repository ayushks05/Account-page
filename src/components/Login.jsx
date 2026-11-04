import { Link } from 'react-router';
import { useState } from 'react';
import { browserLocalPersistence, browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router';
import harry from '../assets/Image/Harry.jpeg';

function Login() {

    const [showpassword, setshowpassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setformData] = useState({
        identifier: "",
        password: "",
        rememberMe: false,
    });
    const [errors, seterrors] = useState({});
    const [message, setmessage] = useState("");
    const navigate = useNavigate();

    const handlechange = (e) => {
        const { name, value, type, checked } = e.target;

        setformData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        seterrors((prev) => ({
            ...prev,
            [name]: "",
            form: "",
        }));
        setmessage("");
    };

    const handlelogin = async (e) => {
        e.preventDefault();

        setmessage("");

        const newerrors = {};
        const identifier = formData.identifier.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!identifier) {
            newerrors.identifier = "Enter your email address.";
        } else if (!emailPattern.test(identifier)) {
            newerrors.identifier = "Enter a valid email address.";
        }

        if (!formData.password) {
            newerrors.password = "Please enter your password.";
        }

        seterrors(newerrors);

        if (Object.keys(newerrors).length > 0) {
            return;
        }

        setIsSubmitting(true);
        try {
            await setPersistence(
                auth,
                formData.rememberMe ? browserLocalPersistence : browserSessionPersistence
            );
            await signInWithEmailAndPassword(
                auth,
                identifier,
                formData.password
            );
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Login error:", error.code);

            let errorMessage = "Unable to log in. Please try again.";
            switch (error.code) {
                case "auth/invalid-credential":
                    errorMessage = "Incorrect email or password.";
                    break;
                case "auth/user-disabled":
                    errorMessage = "This account has been disabled.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Please enter a valid email address.";
                    break;
                case "auth/too-many-requests":
                    errorMessage = "Too many attempts. Please try again later.";
                    break;
                case "auth/network-request-failed":
                    errorMessage = "Network error. Check your internet connection.";
                    break;
                case "auth/operation-not-allowed":
                    errorMessage = "Email/Password login is not enabled in Firebase.";
                    break;
                default:
                    break;
            }
            seterrors((prev) => ({
                ...prev,
                form: errorMessage,
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <aside className="auth-panel">
                    <img
                        className="auth-panel-image"
                        src="https://images.unsplash.com/photo-1793559258886-a51a62122535?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                        alt=""
                        aria-hidden="true"
                    />
                    <div className="brand-row">
                        <img className="brand-mark" src={harry} alt="" aria-hidden="true" />
                        <span>Firebase Auth</span>
                    </div>

                    <div className="auth-panel-copy">
                        <p className="eyebrow">Authentication flow / 02</p>
                        <h2>Sign in with email and password.</h2>
                        <p>A hands-on project for learning Firebase Authentication.</p>
                    </div>
                </aside>

                <main className="auth-form-shell">
                    <div className="auth-header">
                        <span className="top-pill">Firebase Authentication</span>
                        <h1>Log in</h1>
                        <p>
                            Don’t have an account? <Link to="/signup">Sign up</Link>
                        </p>
                    </div>

                    <form noValidate onSubmit={handlelogin} className="auth-form">
                        <div className="auth-divider">Sign in to your account</div>

                        <div className="field-wrapper">
                            <label htmlFor="login-identifier" className="field-label">Email address</label>
                            <input
                                id="login-identifier"
                                type="email"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handlechange}
                                className="input-shell"
                                autoComplete="username"
                                aria-invalid={Boolean(errors.identifier)}
                                aria-describedby={errors.identifier ? "login-identifier-error" : undefined}
                            />
                            {errors.identifier && (
                                <p id="login-identifier-error" role="alert" className="field-error">{errors.identifier}</p>
                            )}
                        </div>

                        <div className="field-wrapper">
                            <div className="field-label-row">
                                <label htmlFor="login-password" className="field-label">Password</label>
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setshowpassword(!showpassword)}
                                >
                                    {showpassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <input
                                id="login-password"
                                type={showpassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handlechange}
                                className="input-shell"
                                autoComplete="current-password"
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={errors.password ? "login-password-error" : undefined}
                            />
                            {errors.password && (
                                <p id="login-password-error" role="alert" className="field-error">{errors.password}</p>
                            )}
                            <Link to="/forgot-password" className="small-muted">Forgot password?</Link>
                        </div>

                        <label className="checkbox-row">
                            <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handlechange} />
                            <span>Remember me</span>
                        </label>

                        {errors.form && (
                            <p role="alert" className="form-error">{errors.form}</p>
                        )}

                        <button type="submit" disabled={isSubmitting} className="primary-button">
                            {isSubmitting ? "Logging in..." : "Log in"}
                        </button>

                        {message && (
                            <p role="status" className="form-success">{message}</p>
                        )}
                    </form>
                </main>
            </div>
        </div>
    );
}

export default Login;
