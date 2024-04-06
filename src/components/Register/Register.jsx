import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from "../../firebase/firebase.init";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Register = () => {

    const [errorMessage, setErrorMessage] = useState("")
    const [success, setSuccess] = useState("")
    const [registerPasswordError, setRegisterPasswordError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const auth = getAuth(app)
    
    const handleRegister = (e) => {
        e.preventDefault();

        setRegisterPasswordError("")
        setErrorMessage("")
        setSuccess("")

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const terms = e.target.terms.checked
        console.log(name, "email :", email, "password:", password, terms);

        if (password.length < 6) {
            setRegisterPasswordError("Password should be at least 6 characters or longer")
            toast.error("invalid password")
            return;
        }
        else if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/.test(password)) {
            setRegisterPasswordError("Give strong password! Password should contains at least one number and includes both lower and uppercase letters and special characters.")
            toast.error("invalid password")
            return;
        }
        else if (!terms) {
            setRegisterPasswordError("please accept our terms and condition")
            return;
        }


        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                const user = result.user
                setSuccess("user created successfully")
                toast.success("user created successfully")
                console.log(user);

                // Update profile
                updateProfile(user, {
                    displayName: name,
                    photoURL: "https://example.com/jane-q-user/profile.jpg"
                })
                .then(() => {
                    console.log('update profile');
                    toast('Profile Updated')
                })
                .catch(error =>{
                    console.log(error);
                    setErrorMessage(error.message)
                })

                // Verify User
                sendEmailVerification(user)
                .then(() =>{
                    toast('Please check your email to verify')
                })

            })
            .catch(error => {
                console.log(error);
                const errorMessage = error.message;
                setErrorMessage(errorMessage)
                toast.error("invalid information")
            })

    }



    return (
        <div className="border flex items-center justify-center p-10">
            <div className="md:w-2/5">
                <p className="text-3xl">Please Register</p>
                <form onSubmit={handleRegister}>

                    <input className="w-full p-3 bg-red-50 mt-4" type="name" name="name" placeholder="Your Name" required />
                    <br />
                    <input className="w-full p-3 bg-red-50 mt-4" type="email" name="email" placeholder="Email Address" required />
                    <br />

                    <div className="relative">
                        <input
                            className="w-full p-3 bg-red-50 mt-3"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            required />

                        <span className="text-2xl absolute top-6 right-3" onClick={() => setShowPassword(!showPassword)}>
                            {
                                showPassword ? <FaEyeSlash /> : <FaEye />
                            }
                        </span>
                    </div>
                    <br />
                    <div>
                        <input className='mr-2' type="checkbox" name="terms" id="terms" />
                        <label htmlFor="terms">Accept our <a href="">Terms and Condition</a></label>
                    </div>

                    <br />
                    <input className="w-full btn btn-secondary " type="submit" value="Register" />
                </form>
                {
                    errorMessage && <p className="text-red-600">{errorMessage}</p>
                }
                {
                    success && <p className="text-green-600">{success}</p>
                }
                {
                    registerPasswordError && <p className="text-red-700">{registerPasswordError}</p>
                }

                <p className="mt-5">If you have already an account, then go to <Link className="text-green-600" to="/login">Login</Link></p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;