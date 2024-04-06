import { getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {

    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const emailRef = useRef(null)

    const auth = getAuth();


    const handleLogin = (e) => {
        e.preventDefault();
        // console.log(e);
        const email = e.target.email.value;
        const password = e.target.password.value;
        const accepted = e.target.terms.checked;
        console.log("email :", email, "password:", password, accepted);

        setErrorMessage('')
        setSuccess('')


        if (password.length < 6) {
            setErrorMessage('password should be at least 6 character or larger')
            return;
        }
        else if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/.test(password)) {
            setErrorMessage("Give strong password! Password should contains at least one number and includes both lower and uppercase letters and special characters.")
            return;
        }
        else if (!accepted) {
            setErrorMessage("please accept our terms and condition.")
        }
   
        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                const user = result.user;
                console.log(user);
                

                if (user.emailVerified) {
                    setSuccess('User Logged In Successfully')
                }
                else{
                    sendEmailVerification(user)
                    .then(() =>{
                        setErrorMessage('Please check your email to verify')
                    })
                }

                const pass = document.getElementById('password')
                pass.value = ''
                
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("error code:", errorCode, "error message :", errorMessage);
                setErrorMessage(errorMessage)
            })
    }
    const handleForgotPassword = () => {
        const email = emailRef.current.value
        console.log("forgot password",email);

        setErrorMessage('')
        setErrorMessage('')
        setSuccess('')

        if (!email) {
            setErrorMessage('Please enter your email')    
            return;        
        }
        else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setErrorMessage('Enter a valid email')
            return;
        }

        sendPasswordResetEmail(auth, email)
        .then(() => {
            setSuccess('Check your email..')
        })
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("error code:", errorCode, "error message :", errorMessage);
            setErrorMessage(errorMessage)
        })
    }
    return (
        <div className="border flex items-center justify-center p-10">
            <div className="w-2/5">
                <p className="text-3xl">Please Login</p>
                <form onSubmit={handleLogin}>
                    <input 
                    className="w-full p-3 bg-red-50 mt-4" 
                    type="email" 
                    name="email" 
                    ref={emailRef}
                    placeholder="Email Address" 
                    required />
                    <br />
                    <div className="relative">
                        <input 
                        className="w-full p-3 bg-red-50 mt-3" 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        placeholder="Password"
                        id="password" 
                        required />
                        <span className="text-2xl absolute top-6 right-3"
                            onClick={() => setShowPassword(!showPassword)}>
                            {
                                showPassword ? <FaEyeSlash /> : <FaEye />
                            }
                        </span>
                    </div>
                    <br />
                    <div className="flex flex-col xl:flex-row-reverse justify-between mr-5">
                        {/* Reset Email */}
                        {/* <Link to="/forgetPassword" className="text-blue-600">Forgot password?</Link> */}
                        <p
                            onClick={handleForgotPassword}
                            className="text-blue-600">Forgot Password</p>

                        <div className="flex items-center">
                            <input type="checkbox" name="terms" id="terms" />
                            <label className="ml-2" htmlFor="terms">accept our <a href="">terms and condition</a></label>
                        </div>

                    </div>

                    <input className="w-full btn btn-info mt-3" type="submit" value="Login" />
                </form>
                {
                    success && <p className="text-green-600">{success}</p>
                }
                {
                    errorMessage && <p className="text-red-600">{errorMessage}</p>
                }
                <p className="mt-5">If you don't have an account, then go to <Link className="text-green-600" to="/register">register</Link></p>
            </div>
        </div>
    );
};

export default Login;