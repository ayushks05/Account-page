import googleLogo from '../assets/google.png';
import appleLogo from '../assets/apple.png';
import facebookLogo from '../assets/facebook.png';
import { Link } from 'react-router';
import { useState } from 'react';

function Login() {

    const [showpassword, setshowpassword] = useState(false);
    const [formData, setformData] = useState({
        name: "",
        password: "",
        rememberMe: false,
    });
    const [errors, seterrors] = useState({});
    const [message, setmessage] = useState("");

    const handlechange = (e) => {
        const {name, value, type, checked} = e.target;

        setformData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        seterrors((prev) => ({
            ...prev,
            [name]: "",
        }));
        setmessage("");
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const newerror = {};
        const name = formData.name.trim();

        if (!name) {
            newerror.name = "Enter your email address or username.";
        } else if (
            name.includes("@") &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(name)
        ) {
            newerror.name = "Enter a valid email address.";
        }

        if (!formData.password) {
            newerror.password = "Please enter your password.";
        }

        seterrors(newerror);

        if (Object.keys(newerror).length === 0) {
            setmessage(
            "Validation passed! Authentication is not connected yet."
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#e5e5e5] px-3 pt-4 sm:px-11 sm:pt-9">
                <header className="flex h-[50px] items-center justify-center border-b-1 border-gray-400]">
                    <div className="h-11 w-11 rounded-full bg-[#c6c6c6]" aria-hidden="true" />
                </header>

                <main className="mx-auto w-full max-w-[550px] px-5 pb-12 pt-14 text-[#333] sm:px-0 sm:pt-12">
                    <div className="mb-10 text-center">
                        <h1 className="text-[35px] font-medium leading-tight">Log in</h1>
                        <p className="mt-2 text-base">
                            Don’t have an account?{' '}
                            <Link to="/signup" className="text-blue-500 underline">Sign up</Link>
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            className="flex h-[60px] w-full items-center justify-center gap-5 rounded-full border border-[#333] bg-white text-base hover:bg-[#999] hover:text-white hover:cursor-pointer"
                        >
                            <img src={googleLogo} alt="" className="h-6 w-6 object-contain" />
                            Continue with Google
                        </button>
                        <button
                            type="button"
                            className="flex h-[60px] w-full items-center justify-center gap-5 rounded-full border border-[#333] bg-white text-base hover:bg-[#999] hover:text-white hover:cursor-pointer"
                        >
                            <img src={facebookLogo} alt="" className="h-7 w-7 object-contain" />
                            Continue with Facebook
                        </button>
                        <button
                            type="button"
                            className="flex h-[60px] w-full items-center justify-center gap-5 rounded-full border border-[#333] bg-white text-base hover:bg-[#999] hover:text-white hover:cursor-pointer"
                        >
                            <img src={appleLogo} alt="" className="h-7 w-7 object-contain" />
                            Continue with Apple
                        </button>
                    </div>

                    <form noValidate onSubmit={handleSubmit}>
                        <div className="mt-10 flex items-center gap-6 text-center text-xl">
                            <span className="h-[2px] flex-1 bg-gray-400" />
                            <span className="whitespace-nowrap">Or continue with email</span>
                            <span className="h-[2px] flex-1 bg-gray-400" />
                        </div>
                        <div className='mb-7 mt-4'>
                            <label htmlFor="login-identifier">Email address or user name</label>
                            <input id="login-identifier" type="text" name='name' value={formData.name} onChange={handlechange} className='w-full h-11 border-2 border-solid border-[#cfcfcf] rounded-lg px-4 text-[13px] outline-none' autoComplete='username'/>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>
                        <div className='mb-7'>
                            <div className='flex justify-between items-center'>
                                <label htmlFor="login-password">Password</label>
                                <button type='button' className='cursor-pointer' value={formData.password} onClick={() => setshowpassword(!showpassword)}>{showpassword ? "show" : "Hide"}</button>
                            </div>
                            <input id="login-password" type={showpassword ? "text" : "password"} name='password' value={formData.password} onChange={handlechange} className='w-full h-11 border-2 border-solid border-[#cfcfcf] rounded-lg px-4 text-[13px] outline-none' autoComplete='current-password'/>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                            <a href="#" className='underline text-blue-500 flex justify-end m-1.5'>Forget your password</a>
                        </div>
                        <p className='terms text-base text-[#555] mt-1.5 mb-4 font-normal flex gap-1'>
                            <input type="checkbox" name='rememberMe' checked={formData.rememberMe} onChange={handlechange}/>
                            Remember me
                        </p>
                        <button type='submit' className='w-full h-12 border-none rounded-3xl bg-[#c5c5c5] text-black text-base cursor-pointer hover:bg-[#999] hover:text-white'>Log in</button>
                        {message && (
                            <p className="mt-3 text-sm text-green-700">{message}</p>
                        )}
                    </form>
                </main>
        </div>
    );
}

export default Login;
