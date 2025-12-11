import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";

import { TextInput, PasswordInput, Button, Card, Divider } from "@mantine/core";
import {Github, Facebook, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
const Google = FaGoogle;

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
      const response = await axios.post("/users/login", formData);

      if (response.status === 200) {
        auth.login(response.data.data.user);
        window.location.href = "/";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      
      {/* Logo */}
      <motion.img
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        src="/Logo.png"
        alt="logo"
        className="w-12 mb-6 opacity-80"
      />

      {/* Social login buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-sm space-y-3 mb-5"
      >
        <Button
          variant="default"
          fullWidth
          leftSection={<Google size={18} />}
        >
          Log in with Google
        </Button>
      </motion.div>

      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card shadow="sm" padding="lg" radius="md" withBorder className="w-[22rem]">

          <form onSubmit={handleSubmit} className="space-y-16">

            <div className="space-y-4">
              {/* Email */}
              <TextInput
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              {/* Password */}
              <PasswordInput
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                mt="sm"
                rightSectionWidth={40}
              />

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Server Error */}
              {errors.server && (
                <p className="text-red-600 text-sm text-center">
                  {errors.server}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="md"
              color="blue"
              disabled={loading}
              leftSection={loading ? <Loader2 className="animate-spin" size={18} /> : null}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <Divider my="lg" />

          {/* Signup Link */}
          <p className="text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

export default Login;
