import {useState} from 'react';
import googleLogo from '../assets/google.png';
import appleLogo from '../assets/apple.png';
import facebookLogo from '../assets/facebook.png';
import { Link } from 'react-router';
import { updateProfile, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../lib/firebase';

function Signup() {
    const [showpassword, setshowpassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setformData] = useState({
        name: "",
        email: "",
        password: "",
        acceptedTerms: false,
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

        if (!formData.acceptedTerms) {
            newerrors.acceptedTerms = "Please accept the terms.";
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
        <div className='min-h-screen bg-[#e5e5e5] relative p-8'>
            <div className='left-8 w-8 h-8 bg-[#c6c6c6] rounded-full absolute top-8 sm:top-[24] sm:left-[24]'></div>
            <div className="w-full max-w-183 m-auto pt-15">
                <div className="text-center mb-13">
                    <h1 className='text-5xl'>Create a account</h1>

                    <p className='text-base text-[#666]'>
                        Already have an account?
                        <Link to="/login" className='text-blue-600 underline'>Log in</Link>
                    </p>
                </div>
                <form noValidate onSubmit={handleSignup}>
                    <div className="mb-7">
                        <label htmlFor="signup-name" className='block text-sx text-[#555] mb-2'>What should we call you?</label>

                        <input id="signup-name" type="text" name='name' value={formData.name} onChange={handlechange} placeholder='Enter your profile name' aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "signup-name-error" : undefined} className='w-full h-11 border-2 border-solid border-[#cfcfcf] rounded-lg px-4 text-[13px] outline-none'/>
                        {errors.name && (
                            <p id="signup-name-error" className='mt-1 text-sm text-red-600' role="alert">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="mb-7">
                        <label htmlFor="signup-email">What's your email?</label>

                        <input id="signup-email" type="email" name='email' value={formData.email} onChange={handlechange} placeholder='Enter your email address' aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "signup-email-error" : undefined} className='w-full h-11 border-2 border-solid border-[#cfcfcf] rounded-lg px-4 text-[13px] outline-none'/>
                        {errors.email && (
                            <p id="signup-email-error" className='mt-1 text-sm text-red-600' role="alert">{errors.email}</p>
                        )}
                    </div>
                    <div className="mb-7">
                        <div className="flex justify-between items-center">
                            <label htmlFor="signup-password" className='flex justify-between items-center'>Create a password</label>

                            <button className='border-none bg-transparent text-[#777] cursor-pointer' type='button' onClick={() => setshowpassword(!showpassword)}>{showpassword ? "Hide" : "Show"}</button>
                        </div>
                        <input id="signup-password" type={showpassword ? "text" : "password"} name='password' value={formData.password} onChange={handlechange} placeholder='Enter your password' aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "signup-password-error" : undefined} className='w-full h-11 border-2 border-solid border-[#cfcfcf] rounded-lg px-4 text-[13px] outline-none'/>
                        {errors.password && (
                            <p id="signup-password-error" className='mt-1 text-sm text-red-600' role="alert">
                                {errors.password}
                            </p>
                        )}
                        <small className='block mt-2 text-xs text-[#777]'>Note: Use 8 or more characters with a mix of letters, numbers & symbols</small>
                    </div>
                    
                    <div className='terms text-xs text-[#555] mt-8 mb-4 font-semibold'>
                        <label className="flex gap-1">
                            <input type="checkbox" name='acceptedTerms' checked={formData.acceptedTerms} onChange={handlechange} aria-invalid={Boolean(errors.acceptedTerms)} aria-describedby={errors.acceptedTerms ? "signup-terms-error" : undefined} className='mr-1'/>
                            <span>
                                By creating an account, you agree to the{" "}
                                <a href="#" className='underline text-blue-600'>Terms of use</a> and{" "}
                                <a href="#" className='text-blue-600 underline'>Privacy policy</a>.
                            </span>
                        </label>
                        {errors.acceptedTerms && (
                            <p id="signup-terms-error" className='mt-1 text-sm text-red-600' role="alert">
                                {errors.acceptedTerms}
                            </p>
                        )}
                    </div>
                    <button className='w-full h-12 border-none rounded-3xl bg-[#c5c5c5] text-black text-xl cursor-pointer hover:bg-[#999] hover:text-white' type='submit' disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create an account"}</button>
                    {success && (
                        <p className='mt-1 text-sm text-green-700' role="status">{success}</p>
                    )}
                    {errors.form && (
                        <p className='mt-1 text-sm text-red-600' role="alert">{errors.form}</p>
                    )}
                </form>
                <div className="social-section mt-12">
                    <p className='text-xl text-[#666] mb-4'>OR Continue with</p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button className='flex-1 h-10 bg-white border-2 border-solid rounded-3xl text-base flex items-center justify-center gap-3 cursor-pointer hover:bg-[#999] hover:text-white'>
                            <img src={facebookLogo} alt="Facebook" className='w-6'/>
                            Facebook
                        </button>
                        <button className='flex-1 h-10 bg-white border-2 border-solid rounded-3xl text-base flex items-center justify-center gap-3 cursor-pointer hover:bg-[#999] hover:text-white'>
                            <img src={googleLogo} alt="Google" />
                            Google
                        </button>
                        <button className='flex-1 h-10 bg-white border-2 border-solid rounded-3xl text-base flex items-center justify-center gap-3 cursor-pointer hover:bg-[#999] hover:text-white'>
                            <img src={appleLogo} alt="Apple" />
                            Apple
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup