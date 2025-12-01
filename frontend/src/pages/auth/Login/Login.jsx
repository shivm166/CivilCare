// frontend/src/pages/auth/Login/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../../hooks/api/auth/useLogin";
import { AlertCircle, LogIn } from "lucide-react";
import Button from "../../../components/common/Button/Button";
import Input from "../../../components/common/Input/Input";
import ErrorAlert from "./ErrorAlert";

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4  from-blue-100 via-white to-blue-200">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white/10 backdrop-blur-md">
        {/* left side */}
        <div
          className="w-full lg:w-1/2 p-8 flex flex-col justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(240,247,255,0.95) 0%, rgba(220,235,255,0.9) 100%)",
            backdropFilter: "blur(10px)",
          }}
        >
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

          {error && <ErrorAlert error={error} />}

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={loginData.email}
              onChange={handleChange}
              required
            />

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

        {/* right side -  */}
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
