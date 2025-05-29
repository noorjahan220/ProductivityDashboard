import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Provider/AuthProvider';
import toast from 'react-hot-toast';

const Register = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        // Validation
        if (!name || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        try {
            const result = await createUser(email, password);
            const newUser = result.user;

            if (!newUser) throw new Error('User creation failed');

            // Update profile with name and an optional photo URL (you can customize it)
            await updateUserProfile(name, null);

            toast.success('Registration successful!');
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.error("Registration failed:", error);

            let errorMessage = 'Registration failed';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered. Please login instead.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Check your internet connection.';
                    break;
                default:
                    errorMessage = error.message || 'Unexpected error. Please try again.';
            }

            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-zinc-800">
            <title>Register - Productivity Dashboard</title>

            <div className="w-full max-w-md bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 shadow-lg rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
                <h1 className="text-3xl font-bold text-center mb-6 text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                        Create Account
                    </span>
                </h1>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-gray-200 focus:outline-none focus:border-amber-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-gray-200 focus:outline-none focus:border-amber-500"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-gray-200 focus:outline-none focus:border-amber-500"
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
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Create Account
                    </button>
                </form>

                <div className="text-center mt-6 text-gray-400">
                    Already have an account?{' '}
                    <Link to="/" className="text-amber-500 hover:text-amber-400 font-medium hover:underline transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
