import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import useSignup from "../../hooks/useSignup";

const Signup = () => {
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const { isPending, error, signupMutation } = useSignup();

  const handleChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    await signupMutation(signUpData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4  from-blue-100 via-white to-blue-200">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white/10 backdrop-blur-md">
        {/* LEFT SIDE - SIGNUP FORM */}
        <div
          className="w-full lg:w-1/2 p-8 flex flex-col justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(240,247,255,0.95) 0%, rgba(220,235,255,0.9) 100%)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* LOGO / TITLE */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-primary tracking-wide">
              Create Your Account
            </h1>
            <p className="text-sm text-gray-700 mt-1">
              Join your society network and manage your community seamlessly.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response?.data?.message || error.message}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* FULL NAME */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                name="name"
                className="input input-bordered w-full rounded-lg"
                value={signUpData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* PHONE */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="123-456-7890"
                className="input input-bordered w-full rounded-lg"
                value={signUpData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input input-bordered w-full rounded-lg"
                value={signUpData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input input-bordered w-full rounded-lg"
                value={signUpData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* AGREEMENT */}
            <div className="form-control mt-2">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  required
                />
                <span className="text-xs leading-tight">
                  I agree to the{" "}
                  <span className="text-primary hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary hover:underline">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              className="btn btn-primary w-full transition-all hover:scale-[1.02]"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* LOGIN LINK */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - VIDEO BACKGROUND */}
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
            <h2 className="text-3xl font-bold mb-3">Smart Society Living</h2>
            <p className="opacity-90 text-sm leading-relaxed max-w-md mx-auto">
              Streamline your society’s communication, events, and maintenance —
              all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
