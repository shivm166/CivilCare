import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLock, FiMail, FiCheckCircle, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import {
  useActivation,
  useVerifyToken,
} from "../../../hooks/api/useActivation";

const ActivateAccountPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: verifyData, isLoading, isError } = useVerifyToken(token);
  const { activateAccount, isActivating } = useActivation();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid activation link");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleActivate = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    activateAccount({ token, password });
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-3">
            <div className="absolute inset-0 border-3 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-3 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-700 font-medium text-sm">Verifying...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !verifyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiAlertCircle className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Invalid or Expired Link
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-5">
            This invitation link is invalid or has expired. Contact your admin for a new one.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Main Activation Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Compact Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-2">
            <FiCheckCircle className="text-2xl" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1">Activate Account</h1>
          <p className="text-indigo-100 text-xs sm:text-sm">Set your password to continue</p>
        </div>

        {/* User Info - Compact */}
        <div className="px-6 py-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
              {verifyData?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {verifyData?.user?.name}
              </p>
              <p className="text-xs text-gray-600 flex items-center gap-1 truncate">
                <FiMail className="flex-shrink-0 text-xs" />
                {verifyData?.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Compact Form */}
        <form onSubmit={handleActivate} className="px-6 py-5 space-y-4">
          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Create Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-10 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Min. 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-9 pr-10 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isActivating}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-xl disabled:shadow-none mt-5 text-sm"
          >
            {isActivating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Activating...
              </span>
            ) : (
              "Activate Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-600">
            Already activated?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccountPage;
