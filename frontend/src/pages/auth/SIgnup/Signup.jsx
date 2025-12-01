// frontend/src/pages/auth/SIgnup/Signup.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../../../hooks/api/auth/useSignup";
import { AlertCircle, UserPlus } from "lucide-react";
import Button from "../../../components/common/Button/Button";
import Input from "../../../components/common/Input/Input";

const Signup = () => {
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [agreed, setAgreed] = useState(false);
  const { isPending, error, signupMutation } = useSignup();

  const handleChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    await signupMutation(signUpData);
  };

  const renderErrors = () => {
    if (!error) return null;
    const responseData = error.response?.data;

    let errorMessages = [];

    // 1. Check for  API m
    const metaMessage =
      responseData?.meta?.message || responseData?.data?.meta?.message;
    if (metaMessage) {
      errorMessages = [metaMessage];
    }
    else if (responseData?.errors && Array.isArray(responseData.errors)) {
      errorMessages = responseData.errors;
    }
    else if (responseData?.message) {
      errorMessages = [responseData.message];
    }
    else {
      errorMessages = [error.message];
    }

    return (
      <div className="alert alert-error mb-4 shadow-md">
        <AlertCircle className="w-5 h-5" />
        <div className="flex flex-col text-sm">
          {errorMessages.map((msg, index) => (
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
        {/* LEFT SIDE - SIGNUP FORM */}
        <div
          className="w-full lg:w-1/2 p-8 flex flex-col justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(240,247,255,0.95) 0%, rgba(220,235,255,0.9) 100%)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* logo  */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-indigo-600 tracking-wide">
              Create Your Account
            </h1>
            <p className="text-sm text-gray-700 mt-1">
              Join your society network and manage your community seamlessly.
            </p>
          </div>

          {/* ERROR MESSAGE (Using new renderErrors function) */}
          {renderErrors()}

          {/* FORM */}
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={signUpData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="123-456-7890"
              value={signUpData.phone}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={signUpData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={signUpData.password}
              onChange={handleChange}
              required
            />

            <div className="form-control mt-2">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                />
                <span className="text-xs leading-tight">
                  I agree to the{" "}
                  <span className="text-indigo-600 hover:underline font-semibold">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-indigo-600 hover:underline font-semibold">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={UserPlus}
              isLoading={isPending}
              disabled={!agreed || isPending}
              className="w-full"
            >
              Create Account
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 hover:underline font-semibold"
                >
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
