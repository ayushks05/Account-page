import {useState} from 'react';

function Signup() {
    const [showpassword, setshowpassword] = useState(false);

    return (
        <div className='signup-page'>
            <div className="logo"></div>
            <div className="signup-container">
                <div className="heading">
                    <h1>Create a account</h1>

                    <p>
                        Already have an account?
                        <a href="#">Log in</a>
                    </p>
                </div>
                <form action="account">
                    <div className="form-group">
                        <label>What should we call you?</label>

                        <input type="text" placeholder='Enter your profile name'/>
                    </div>
                    <div className="form-group">
                        <label>What's your email?</label>

                        <input type="email" placeholder='Enter your email address'/>
                    </div>
                    <div className="form-group">
                        <div className="password-label">
                            <label>Create a password</label>

                            <button type='button' onClick={() => setshowpassword(!showpassword)}>{showpassword ? "Hide" : "Show"}</button>
                        </div>
                        <input type= {showpassword ? "text" : "password"} placeholder='Enter your password'/>
                        <small>Use 8 or more characters with a mix of letters, numbers & symbols</small>
                    </div>
                    <p className='terms'>
                        By creating an account, you agree to the{" "}
                        <a href="#">Terms of use</a> and{" "}
                        <a href="#">Privacy policy</a>.
                    </p>
                    <button className='create-btn' type='submit'>Create an account</button>
                </form>
                <div className="social-section">
                    <p>OR Continue with</p>
                    <div className="social-btn">
                        <button>
                            <span className='facebook'>f</span>
                            Facebook
                        </button>
                        <button>
                            <span className='google'>G</span>
                            Google
                        </button>
                        <button>
                            <span className='apple'>.</span>
                            Apple
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup