import {useState} from 'react';
import { Link } from 'react-router';
import { updateProfile, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../lib/firebase';
import harry from '../assets/Image/Harry.jpeg';

function Signup() {
    const [showpassword, setshowpassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setformData] = useState({
        name: "",
        email: "",
        password: "",
        acknowledgeVerification: false,
    })
    const [errors, seterror] = useState({});
    const [success, setsuccess] = useState("");

    const handlechange = (e) => {
        const {name, value, type, checked} = e.target;

        setformData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
        seterror((prev) => ({
            ...prev,
            [name]: "",
            form: "",
        }))
        setsuccess("");
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        setsuccess("");

        const newerrors = {};

        if (!formData.name.trim()) {
            newerrors.name = "Please enter your name.";
        }
        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            newerrors.email = "Please enter a valid email address.";
        }

        const password = formData.password;

        if (
            password.length < 8 ||
            !/[A-Za-z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[^A-Za-z0-9]/.test(password)
        ) {
            newerrors.password = "Use at least 8 characters with a letter, number, and symbol.";
        }

        if (!formData.acknowledgeVerification) {
            newerrors.acknowledgeVerification = "Please confirm you understand email verification is required.";
        }

        seterror(newerrors);

        if (Object.keys(newerrors).length > 0) {
            return;
        }

        setIsSubmitting(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email.trim(),
                formData.password
            );

            try {
                await updateProfile(userCredential.user, {
                    displayName: formData.name.trim(),
                });

                await sendEmailVerification(userCredential.user);
                setsuccess("Account created! Please check your email to verify your account.");

            } catch (profileError) {
                console.error("Profile update failed:", profileError.code);
                setsuccess(
                    "Account created, but the profile name could not be saved."
                );
            }
        } catch (error) {
            console.error("Signup error:", error.code);

            let errorMessage = "Unable to create your account. Please try again.";

            switch (error.code) {
                case "auth/email-already-in-use":
                    errorMessage = "This email is already registered.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Please enter a valid email address.";
                    break;
                case "auth/weak-password":
                    errorMessage = "Please choose a stronger password.";
                    break;
                case "auth/operation-not-allowed":
                    errorMessage = "Email/Password sign-up is not enabled in Firebase.";
                    break;
                case "auth/network-request-failed":
                    errorMessage = "Network error. Check your internet connection.";
                    break;
                default:
                    break;
            }

            seterror((prev) => ({
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
                        <p className="eyebrow">Authentication flow / 01</p>
                        <h2>Create an account with Firebase.</h2>
                        <p>Practice the full signup flow, including profile setup and email verification.</p>
                    </div>
                </aside>

                <main className="auth-form-shell">
                    <div className="auth-header">
                        <span className="top-pill">Firebase Authentication</span>
                        <h1>Create an account</h1>
                        <p>
                            Already have an account? <Link to="/login">Log in</Link>
                        </p>
                    </div>

                    <form noValidate onSubmit={handleSignup} className="auth-form">
                        <div className="auth-divider">Register with email and password</div>

                        <div className="field-wrapper">
                            <label htmlFor="signup-name" className="field-label">What should we call you?</label>
                            <input
                                id="signup-name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handlechange}
                                placeholder="Enter your profile name"
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={errors.name ? "signup-name-error" : undefined}
                                className="input-shell"
                            />
                            {errors.name && (
                                <p id="signup-name-error" className="field-error" role="alert">{errors.name}</p>
                            )}
                        </div>

                        <div className="field-wrapper">
                            <label htmlFor="signup-email" className="field-label">What’s your email?</label>
                            <input
                                id="signup-email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handlechange}
                                placeholder="Enter your email address"
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={errors.email ? "signup-email-error" : undefined}
                                className="input-shell"
                            />
                            {errors.email && (
                                <p id="signup-email-error" className="field-error" role="alert">{errors.email}</p>
                            )}
                        </div>

                        <div className="field-wrapper">
                            <div className="field-label-row">
                                <label htmlFor="signup-password" className="field-label">Create a password</label>
                                <button
                                    className="password-toggle"
                                    type="button"
                                    onClick={() => setshowpassword(!showpassword)}
                                >
                                    {showpassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <input
                                id="signup-password"
                                type={showpassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handlechange}
                                placeholder="Enter your password"
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={errors.password ? "signup-password-error" : undefined}
                                className="input-shell"
                            />
                            {errors.password && (
                                <p id="signup-password-error" className="field-error" role="alert">{errors.password}</p>
                            )}
                            <small className="small-muted">Use 8 or more characters with a mix of letters, numbers, and symbols.</small>
                        </div>

                        <label className="terms-row">
                            <input
                                type="checkbox"
                                name="acknowledgeVerification"
                                checked={formData.acknowledgeVerification}
                                onChange={handlechange}
                                aria-invalid={Boolean(errors.acknowledgeVerification)}
                                aria-describedby={errors.acknowledgeVerification ? "signup-verification-error" : undefined}
                            />
                            <span>
                                I understand that I’ll need to verify my email before accessing the account page.
                            </span>
                        </label>
                        {errors.acknowledgeVerification && (
                            <p id="signup-verification-error" className="field-error" role="alert">{errors.acknowledgeVerification}</p>
                        )}

                        {errors.form && (
                            <p className="form-error" role="alert">{errors.form}</p>
                        )}

                        <button className="primary-button" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating account..." : "Create an account"}
                        </button>

                        {success && (
                            <p className="form-success" role="status">{success}</p>
                        )}
                    </form>
                </main>
            </div>
        </div>
    );
}

export default Signup