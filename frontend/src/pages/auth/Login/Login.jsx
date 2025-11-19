import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useLogin from "../../../hooks/api/auth/useLogin";
import useAuthUser from "../../../hooks/api/auth/useAuthUser";
import PageLoader from "../../error/PageLoader";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();
  const { authUser, isLoading } = useAuthUser();

  // 🔥 CRITICAL: Redirect after successful login based on user role
  useEffect(() => {
    if (authUser && !isLoading) {
      // Determine redirect path based on globalRole
      const redirectPath = authUser.globalRole === "super_admin" 
        ? "/super-admin/dashboard" 
        : "/user/dashboard";
      
      toast.success(`Welcome back, ${authUser.name}!`);
      navigate(redirectPath, { replace: true });
    }
  }, [authUser, isLoading, navigate]);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await loginMutation(loginData);
      // Success is handled by useEffect above when authUser updates
    } catch (err) {
      // Error is already displayed by the error state
      toast.error(err?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  // Show loader while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 from-blue-100 via-white to-blue-200">
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
            <div className="alert alert-error mb-4 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
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
                className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={loginData.email}
                onChange={handleChange}
                required
                disabled={isPending}
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
                className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={loginData.password}
                onChange={handleChange}
                required
                disabled={isPending}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn btn-primary w-full transition-all hover:scale-[1.02] shadow-lg"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* SIGNUP LINK */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-primary hover:underline font-semibold"
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