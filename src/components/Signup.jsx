import {useState} from 'react';
import googleLogo from '../assets/google.png';
import appleLogo from '../assets/apple.png';
import facebookLogo from '../assets/facebook.png';
import { Link } from 'react-router';

function Signup() {
    const [showpassword, setshowpassword] = useState(false);

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
                <form action="account">
                    <div className="mb-7">
                        <label className='block text-sx text-[#555] mb-2'>What should we call you?</label>

                        <input type="text" placeholder='Enter your profile name' className='w-full h-11 border-2 border-solid border-[#cfcfcf] rounded-lg px-4 text-[13px] outline-none' required />
                    </div>
                    <div className="mb-7">
                        <label>What's your email?</label>

                        <input type="email" placeholder='Enter your email address' className='w-full h-11 border-2 border-solid border-[#cfcfcf] rounded-lg px-4 text-[13px] outline-none' required/>
                    </div>
                    <div className="mb-7">
                        <div className="flex justify-between items-center">
                            <label className='flex justify-between items-center'>Create a password</label>

                            <button className='border-none bg-transparent text-[#777] cursor-pointer' type='button' onClick={() => setshowpassword(!showpassword)}>{showpassword ? "Hide" : "Show"}</button>
                        </div>
                        <input type= {showpassword ? "text" : "password"} placeholder='Enter your password' className='w-full h-11 border-2 border-solid border-[#cfcfcf] rounded-lg px-4 text-[13px] outline-none' required/>
                        <small className='block mt-2 text-xs text-[#777]'>Note: Use 8 or more characters with a mix of letters, numbers & symbols</small>
                    </div>
                    
                    <p className='terms text-xs text-[#555] mt-8 mb-4 font-semibold flex gap-1'>
                        <input type="checkbox" className='mr-1' required/>
                        By creating an account, you agree to the{" "}
                        <a href="#" className='underline text-blue-600'>Terms of use</a> and{" "}
                        <a href="#" className='text-blue-600 underline'>Privacy policy</a>.
                    </p>
                    <button className='w-full h-12 border-none rounded-3xl bg-[#c5c5c5] text-black text-xl cursor-pointer hover:bg-[#999] hover:text-white' type='submit'>Create an account</button>
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