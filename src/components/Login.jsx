import googleLogo from '../assets/google.png';
import appleLogo from '../assets/apple.png';
import facebookLogo from '../assets/facebook.png';

function Login() {
    return (
        <div className="min-h-screen bg-[#e5e5e5] px-3 pt-4 sm:px-11 sm:pt-9">
                <header className="flex h-[50px] items-center justify-center border-b-1 border-gray-400]">
                    <div className="h-11 w-11 rounded-full bg-[#c6c6c6]" aria-hidden="true" />
                </header>

                <main className="mx-auto w-full max-w-[676px] px-5 pb-12 pt-14 text-[#333] sm:px-0 sm:pt-16">
                    <div className="mb-10 text-center">
                        <h1 className="text-[35px] font-semibold leading-tight">Log in</h1>
                        <p className="mt-2 text-lg">
                            Don’t have an account?{' '}
                            <a href="/signup" className="text-blue-500 underline">Sign up</a>
                        </p>
                    </div>

                    <div className="flex flex-col gap-5">
                        <button
                            type="button"
                            className="flex h-[74px] w-full items-center justify-center gap-5 rounded-full border border-[#333] bg-white text-xl hover:bg-[#999] hover:text-white hover:cursor-pointer"
                        >
                            <img src={googleLogo} alt="" className="h-8 w-8 object-contain" />
                            Continue with Google
                        </button>
                        <button
                            type="button"
                            className="flex h-[74px] w-full items-center justify-center gap-5 rounded-full border border-[#333] bg-white text-xl hover:bg-[#999] hover:text-white hover:cursor-pointer"
                        >
                            <img src={facebookLogo} alt="" className="h-8 w-8 object-contain" />
                            Continue with Facebook
                        </button>
                        <button
                            type="button"
                            className="flex h-[74px] w-full items-center justify-center gap-5 rounded-full border border-[#333] bg-white text-xl hover:bg-[#999] hover:text-white hover:cursor-pointer"
                        >
                            <img src={appleLogo} alt="" className="h-8 w-8 object-contain" />
                            Continue with Apple
                        </button>
                    </div>

                    <div className="mt-10 flex items-center gap-6 text-center text-xl">
                        <span className="h-[2px] flex-1 bg-gray-400" />
                        <span className="whitespace-nowrap">Or continue with email</span>
                        <span className="h-[2px] flex-1 bg-gray-400" />
                    </div>
                    <div className='mb-7'>
                        <label>Email address or user name</label>
                        <input type="text" className='w-full h-11 border-2 border-solid border-[#cfcfcf] rounded-lg px-4 text-[13px] outline-none'/>
                    </div>
                    <div className='mb-7'>
                        <label>Password</label>
                        <input type="password" className='w-full h-11 border-2 border-solid border-[#cfcfcf] rounded-lg px-4 text-[13px] outline-none'/>
                        <a href="#" className='underline text-blue-500 flex justify-end m-1.5'>Forget your password</a>
                    </div>
                    <p className='terms text-sm text-[#555] mt-8 mb-4 font-semibold flex gap-1'>
                        <input type="checkbox" />
                        Remember me
                    </p>
                    <button className='w-full h-12 border-none rounded-3xl bg-[#c5c5c5] text-black text-xl cursor-pointer hover:bg-[#999] hover:text-white'>Log in</button>
                </main>
        </div>
    );
}

export default Login;
