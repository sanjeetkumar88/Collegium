import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FiLoader } from "react-icons/fi";

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.password) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/users/login', formData);

      if (response.status === 200) {
        auth.login(response.data.data.user);
        window.location.href = '/';
      }
    } catch (error) {
      if (error.response) {
        // Check for specific error and extract the message
        if (error.response.data && error.response.data.message) {
          setErrors({ server: error.response.data.message });
        } else if (error.response.data.includes("Error: User does not exist")) {
          // If the response contains a "User does not exist" error
          setErrors({ server: "User does not exist. Please check your credentials." });
        } else {
          setErrors({ server: 'Inalid password' });
        }
      } else if (error.request) {
        setErrors({ server: 'No response received from the server. Please check your network.' });
      } else {
        setErrors({ server: 'An unexpected error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login to Your Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-600">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password}</p>}
          </div>

          {errors.server && <p className="text-red-500 text-center text-sm mt-4">{errors.server}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white mt-6 transition-colors ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            {loading ? <FiLoader className="inline-block animate-spin mr-2" /> : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
