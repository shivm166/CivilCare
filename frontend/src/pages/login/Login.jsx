import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import useLogin from "../../hooks/useLogin";

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

    // Basic client-side validation
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    // Email validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    if (loginData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    try {
      await loginMutation(loginData);
      toast.success("Login successful! Redirecting...");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 via-white to-blue-200">
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
            <h1 className="text-3xl font-extrabold text-primary tracking-wide">
              Sign In
            </h1>
            <p className="text-sm text-gray-700 mt-1">
              Welcome back to{" "}
              <span className="font-semibold text-primary">Civil Care</span> —
              manage your society smarter.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response?.data?.message || error.message}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input input-bordered w-full rounded-lg"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="form-control w-full">
              <label className="label flex justify-between items-center">
                <span className="label-text font-medium">Password</span>
                {/* <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot?
                </Link> */}
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input input-bordered w-full rounded-lg"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn btn-primary w-full transition-all hover:scale-[1.02]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* SIGNUP LINK */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
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
            src="/civil care.mp4"
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
