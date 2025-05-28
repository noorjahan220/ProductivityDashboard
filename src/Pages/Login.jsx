import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { AuthContext } from '../Provider/AuthProvider';

const Login = () => {
    const { signIn, signInWithGoogle, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    const axiosSecure = useAxiosSecure();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    const handleSignin = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        signIn(email, password)
            .then((result) => {
                toast.success('Successfully logged in!', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#f59e0b',
                        secondary: '#fff'
                    }
                });
                navigate(from, { replace: true });
            })
            .catch((error) => {
                console.error("Login error:", error.code, error.message); // 🔍 Log exact error
                toast.error(`Login failed: ${error.code}`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            });
    };

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then((result) => {
                const userInfo = { email: result.user.email };
                axiosSecure.post('/users', userInfo)
                    .then(() => {
                        toast.success('Logged in with Google!', {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                            iconTheme: {
                                primary: '#f59e0b',
                                secondary: '#fff'
                            }
                        });
                        navigate(from, { replace: true });
                    })
                    .catch((err) => {
                        console.error("Failed to save user info:", err.message);
                        toast.error('Failed to save user info.', {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            }
                        });
                    });
            })
            .catch((error) => {
                console.error("Google login error:", error.code, error.message);
                toast.error(`Google login failed: ${error.code}`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            });
    };

    return (
        <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-zinc-800">
            <title>Login - NewsSphere</title>

            <div className="w-full max-w-md bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 shadow-lg rounded-xl p-8 transition duration-300 hover:shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
                <h1 className="text-3xl font-bold text-center mb-6 text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                        Welcome Back
                    </span>
                </h1>

                <form onSubmit={handleSignin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-gray-200 focus:outline-none focus:border-amber-500 transition-colors"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-gray-200 focus:outline-none focus:border-amber-500 transition-colors"
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer text-sm hover:text-amber-500"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                        </div>
                        <div className="flex justify-end mt-1">
                            <a href="#" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Sign In
                    </button>
                </form>

                <div className="relative flex items-center justify-center mt-6 mb-6">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-700"></div>
                    <div className="relative bg-zinc-800 px-4 text-sm text-gray-400">
                        Or continue with
                    </div>
                </div>

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                        <path fill="#fbc02d" d="M43.6 20.5H42v-.1H24v7.1h11.2c-1.6 4.3-5.6 7.1-11.2 7.1-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 6 .9 8.3 2.6l5.6-5.6C34.5 4.4 29.5 2 24 2 12.9 2 4 10.9 4 22s8.9 20 20 20c11 0 20-9 20-20 0-1.2-.1-2.4-.4-3.5z"/>
                        <path fill="#e53935" d="M6.3 14.6l5.9 4.3C14.2 15 18.8 12 24 12c3.1 0 6 .9 8.3 2.6l5.6-5.6C34.5 4.4 29.5 2 24 2 15.3 2 7.9 7.1 6.3 14.6z"/>
                        <path fill="#4caf50" d="M24 44c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.3c-2.1 1.4-4.9 2.2-7.4 2.2-5.6 0-10.4-3.6-12.1-8.6l-6.2 4.8C9 39.1 16.1 44 24 44z"/>
                        <path fill="#1565c0" d="M43.6 20.5H42v-.1H24v7.1h11.2c-1 2.5-2.7 4.6-4.9 6.1l.1.1 6.4 5.3c-.5.4 6.2-4.5 6.2-13 0-1.2-.1-2.4-.4-3.5z"/>
                    </svg>
                    Sign in with Google
                </button>

                <div className="text-center mt-6 text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-amber-500 hover:text-amber-400 font-medium hover:underline transition-colors">
                        Register Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
