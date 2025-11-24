// frontend/src/pages/auth/Login/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../../hooks/api/auth/useLogin";
import { AlertCircle, LogIn } from "lucide-react";

// 💡 NEW IMPORTS
import Button from "../../../components/common/Button/Button";
import Input from "../../../components/common/Input/Input";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginMutation(loginData);
  };

  // 💥 FIX: Updated Error Rendering Logic to handle nested API response structure
  const renderErrors = () => {
    if (!error) return null;
    const responseData = error.response?.data;

    let errorMessages = [];

    // 1. Check for deeply nested API message (e.g., from 401 with meta structure)
    const metaMessage =
      responseData?.meta?.message || responseData?.data?.meta?.message;
    if (metaMessage) {
      errorMessages = [metaMessage];
    }
    // 2. Check for Joi validation errors (array of strings)
    else if (responseData?.errors && Array.isArray(responseData.errors)) {
      errorMessages = responseData.errors;
    }
    // 3. Check for general controller errors (single string in data root)
    else if (responseData?.message) {
      errorMessages = [responseData.message];
    }
    // 4. Fallback for network/Axios errors
    else {
      errorMessages = [error.message];
    }

    return (
      <div className="alert alert-error mb-4 shadow-md">
        <AlertCircle className="w-5 h-5" />
        <div className="flex flex-col text-sm">
          {errorMessages.map((msg, index) => (
            // Clean up Joi's surrounding quotes
            <span key={index}>
              {msg.startsWith('"') ? msg.slice(1, -1).replace(/"/g, "") : msg}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4  from-blue-100 via-white to-blue-200">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white/10 backdrop-blur-md">
        {/* LEFT SIDE - LOGIN FORM */}
        <div
          className="w-full lg:w-1/2 p-8 flex flex-col justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(240,247,255,0.95) 0%, rgba(220,235,255,0.9) 100%)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* TITLE */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-indigo-600 tracking-wide">
              Sign In
            </h1>
            <p className="text-sm text-gray-700 mt-1">
              Welcome back to{" "}
              <span className="font-semibold text-indigo-600">Civil Care</span>{" "}
              — manage your society smarter.
            </p>
          </div>

          {/* ERROR MESSAGE (Using new renderErrors function) */}
          {renderErrors()}

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL (Using Input Component) */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={loginData.email}
              onChange={handleChange}
              required
            />

            {/* PASSWORD (Using Input Component) */}
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={handleChange}
                required
              />
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-600 hover:underline block text-right pt-1"
              >
                Forgot Password?
              </Link>
            </div>

            {/* SUBMIT BUTTON (Using Button Component) */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={LogIn}
              isLoading={isPending}
              className="w-full"
            >
              Sign In
            </Button>

            {/* SIGNUP LINK */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 hover:underline font-semibold"
                >
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - VIDEO SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gray-100 items-center justify-center relative overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="/introCivilCare.mp4"
          ></video>
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 text-center px-6 text-white">
            <h2 className="text-3xl font-bold mb-3">Welcome to Civil Care</h2>
            <p className="opacity-90 text-sm leading-relaxed max-w-md mx-auto">
              A digital platform designed to simplify society management —
              connect residents, handle maintenance, and organize events
              effortlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
