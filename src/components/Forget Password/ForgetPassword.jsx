import { getAuth, sendPasswordResetEmail, } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState('')


    const handleReseatPassword = (e) => {
        e.preventDefault();
        // console.log(e);
        const email = e.target.email.value;
        console.log("email :", email);

        if (!email) {
            setErrorMessage('Please enter your email')    
            return;        
        }
        else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setErrorMessage('Enter a validated email')
            return;
        }


        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setSuccess('Successfully send')
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
                <p className="text-3xl">Reset Password</p>
                <form onSubmit={handleReseatPassword}>
                    <input className="w-full p-3 bg-red-50 mt-4" type="email" name="email" placeholder="Email Address" />
                    <br />
    
                    <br />
                    <div className="flex justify-between mx-5">
                        <p>Check your Email</p>
                        <p>Go to <Link to="/login" className="text-blue-600">Login</Link></p>
                    </div>
                    <input className="w-full btn btn-primary mt-3" type="submit" value="Send Code" />
                </form>
                {
                    success && <p className="text-green-600">{success}</p>
                }
                {
                    errorMessage && <p className="text-red-600">{errorMessage}</p>
                }
            </div>
        </div>
    );
};

export default ForgetPassword;