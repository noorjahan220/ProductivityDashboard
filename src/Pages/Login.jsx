import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../Provider/AuthProvider';

const Login = () => {
    const { signIn, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect to dashboard if user is already logged in
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const handleSignin = async (e) => {
        e.preventDefault();
        if (isProcessing) return;
        
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            setIsProcessing(true);
            if (!email || !password) {
                throw new Error('Please provide both email and password');
            }
            
            await signIn(email, password);
            toast.success('Successfully logged in!');
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Login error:", error);
            
            let errorMessage = 'Login failed';
            switch (error.code) {
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    errorMessage = 'Invalid email or password. Please check your credentials.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email format. Please enter a valid email address.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your internet connection.';
                    break;
                default:
                    errorMessage = error.message || 'An unexpected error occurred. Please try again.';
            }
            
            toast.error(errorMessage, {
                duration: 4000
            });
            form.password.value = '';
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-zinc-800">
            <title>Login - Productivity Dashboard</title>

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
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className={`w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isProcessing ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

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
