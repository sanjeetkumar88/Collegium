import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as userApi from "../api/user";
import { TextInput, PasswordInput, Button, Divider } from "@mantine/core";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaUserCircle, FaIdCard } from "react-icons/fa";
import { Loader2 } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    avatar: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!formData.username) validationErrors.username = "Username is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.fullName) validationErrors.fullName = "Full name is required";
    if (!formData.password) validationErrors.password = "Password is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await userApi.register(formData);
      if (response.status === 201) navigate("/login");
    } catch (error) {
      setErrors({
        server: error.response?.data?.message || "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white overflow-hidden px-4 py-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-50/50 blur-[120px] rounded-full -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-50/50 blur-[120px] rounded-full -mr-64 -mb-64" />

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-6">
               <div className="text-2xl font-black text-blue-600 tracking-tighter uppercase">COLLEGIUM</div>
            </Link>
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium">Join the student innovation ecosystem.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                    label="Username"
                    placeholder="student_pro"
                    name="username"
                    size="md"
                    radius="lg"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    leftSection={<FaUserCircle className="text-slate-400" size={14} />}
                    styles={{
                        input: { border: '1px solid #e2e8f0', backgroundColor: '#fff' },
                        label: { fontWeight: 700, marginBottom: '8px', color: '#1e293b' }
                    }}
                />

                <TextInput
                    label="Full Name"
                    placeholder="Alex Johnson"
                    name="fullName"
                    size="md"
                    radius="lg"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    leftSection={<FaIdCard className="text-slate-400" size={14} />}
                    styles={{
                        input: { border: '1px solid #e2e8f0', backgroundColor: '#fff' },
                        label: { fontWeight: 700, marginBottom: '8px', color: '#1e293b' }
                    }}
                />

                <div className="md:col-span-2">
                    <TextInput
                        label="Email Address"
                        placeholder="alex@university.edu"
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
                </div>

                <div className="md:col-span-2">
                    <PasswordInput
                        label="Choose Password"
                        placeholder="Minimum 8 characters"
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
                </div>
             </div>

            {errors.server && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm font-bold text-center bg-red-50 py-3 rounded-2xl border border-red-100"
              >
                {errors.server}
              </motion.p>
            )}

            <Button
              type="submit"
              fullWidth
              size="xl"
              radius="xl"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-600/25 mt-4 transition-all"
              leftSection={loading ? <Loader2 className="animate-spin" size={20} /> : null}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-10">
            <p className="text-slate-500 text-sm font-bold">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2">
                Sign in instead
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
