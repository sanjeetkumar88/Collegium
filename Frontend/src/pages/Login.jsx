import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as userApi from "../api/user";
import { useAuth } from "../context/AuthContext";

import { TextInput, PasswordInput, Button, Divider } from "@mantine/core";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.password) validationErrors.password = "Password is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await userApi.login(formData);

      if (response.status === 200) {
        auth.login(response.data.data.user);
        navigate("/");
      }
    } catch (error) {
      setErrors({
        server: error.response?.data?.message || "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white overflow-hidden px-4">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100/40 blur-[120px] rounded-full -ml-64 -mb-64" />
      
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-6">
               <div className="text-2xl font-black text-blue-600 tracking-tighter">COLLEGIUM</div>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Continue your journey with the community.</p>
          </div>

          {/* Social Login */}
          <Button
            variant="default"
            fullWidth
            size="lg"
            radius="xl"
            leftSection={<FaGoogle className="text-red-500" size={18} />}
            className="mb-8 border-slate-200 hover:bg-slate-50 transition-colors font-bold"
          >
            Continue with Google
          </Button>

          <div className="relative mb-8">
            <Divider label="or sign in with email" labelPosition="center" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextInput
              label="Email Address"
              placeholder="name@university.edu"
              name="email"
              size="md"
              radius="lg"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftSection={<FaEnvelope className="text-slate-400" size={14} />}
              styles={{
                input: { border: '1px solid #e2e8f0', backgroundColor: '#fff' },
                label: { fontWeight: 700, marginBottom: '8px', color: '#1e293b' }
              }}
            />

            <div className="space-y-1">
              <PasswordInput
                label="Password"
                placeholder="••••••••"
                name="password"
                size="md"
                radius="lg"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftSection={<FaLock className="text-slate-400" size={14} />}
                styles={{
                  input: { border: '1px solid #e2e8f0', backgroundColor: '#fff' },
                  label: { fontWeight: 700, marginBottom: '8px', color: '#1e293b' }
                }}
              />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {errors.server && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-600 text-sm font-bold text-center bg-red-50 py-2 rounded-xl border border-red-100"
              >
                {errors.server}
              </motion.p>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              radius="xl"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-600/25 mt-4"
              leftSection={loading ? <Loader2 className="animate-spin" size={18} /> : null}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-10">
            <p className="text-slate-500 text-sm font-bold">
              New to Collegium?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2">
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
