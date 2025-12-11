import React, { useState, useEffect } from "react";
import {
  LogOut,
  User,
  Mail,
  Phone,
  Edit3,
  CheckCircle,
  X,
  Save,
  AlertOctagon,
  Camera,
} from "lucide-react";

import useProfile from "../../../../hooks/api/auth/useProfile";
import useLogout from "../../../../hooks/api/auth/useLogout";

const ProfilePage = () => {
  const { user, loading, error, updateProfileMutation, updateProfileStatus } =
    useProfile();

  const { logoutUser } = useLogout();

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Load user profile data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Validation
  const validate = (data) => {
    const temp = {};
    if (!data.name?.trim()) temp.name = "Name is required";
    else if (data.name.trim().length < 2)
      temp.name = "Name must be at least 2 characters";
    else if (!/^[A-Za-z\s]+$/.test(data.name))
      temp.name = "Name must contain only letters";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  // Edit / Save handler
  const handleEditToggle = () => {
    if (isEditing) {
      if (!validate(formData)) return;

      setSuccess("");
      updateProfileMutation(
        { name: formData.name },
        {
          onSuccess: (res) => {
            if (res?.success) {
              setSuccess(res.meta?.message || "Profile updated successfully!");
              setTimeout(() => setSuccess(""), 3000);
              setIsEditing(false);
            }
          },
          onError: (err) => {
            setErrors({
              general:
                err.response?.data?.message ||
                "Failed to update profile. Please try again.",
            });
          },
        }
      );
    } else {
      setIsEditing(true);
      setSuccess("");
      setErrors({});
    }
  };

  // Cancel Editing
  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setSuccess("");
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="alert alert-error shadow-2xl max-w-md">
          <AlertOctagon />
          <span>Error loading profile: {error.message}</span>
        </div>
      </div>
    );
  }

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">
            Profile
          </h1>

          <button
            onClick={logoutUser}
            className="btn btn-error btn-sm gap-2 hover:scale-105 transition-all duration-300"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Success Message */}
        {success && (
          <div className="alert alert-success shadow-lg mb-4 animate-pulse text-sm">
            <CheckCircle size={18} />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="alert alert-error shadow-lg mb-4 text-sm">
            <AlertOctagon size={18} />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="card bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Purple Header Section - COMPACT */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 px-4 sm:px-6 py-5 sm:py-6">
            <div className="flex flex-col items-center gap-3">
              {/* Avatar */}
              <div className="relative group">
                <div className="avatar">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-indigo-600">
                    {formData.name
                      ? formData.name.substring(0, 2).toUpperCase()
                      : "U"}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 btn btn-circle btn-xs bg-white text-indigo-600 border-0 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-300 shadow-lg">
                  <Camera size={12} />
                </button>
              </div>

              {/* User Info - COMPACT */}
              <div className="text-center text-white">
                <h2 className="text-xl sm:text-2xl font-bold mb-1 break-words px-2">
                  {formData.name}
                </h2>
                <p className="text-indigo-100 flex items-center justify-center gap-2 text-xs sm:text-sm break-all px-2">
                  <Mail size={14} className="flex-shrink-0" />
                  <span className="truncate max-w-[250px]">
                    {formData.email}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Form Section - COMPACT */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Full Name */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-bold text-sm sm:text-base text-gray-700">
                    Full Name
                  </span>
                  {isEditing && (
                    <span className="label-text-alt text-indigo-600 font-medium text-xs">
                      Editable
                    </span>
                  )}
                </label>

                <label
                  className={`input input-bordered input-sm sm:input-md flex items-center gap-2 transition-all duration-300 ${
                    isEditing
                      ? "border-indigo-400 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 bg-white"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <User
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-indigo-600"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`grow text-sm ${
                      !isEditing
                        ? "cursor-not-allowed text-gray-600"
                        : "text-gray-900"
                    }`}
                    placeholder="Enter your full name"
                  />
                </label>
                {errors.name && (
                  <p className="text-xs text-error mt-1 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-bold text-sm sm:text-base text-gray-700">
                    Email Address
                  </span>
                  <span className="label-text-alt text-gray-500 font-medium text-xs">
                    Read-only
                  </span>
                </label>

                <label className="input input-bordered input-sm sm:input-md flex items-center gap-2 bg-gray-50 border-gray-300 cursor-not-allowed">
                  <Mail
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-indigo-600"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="grow cursor-not-allowed text-gray-600 text-sm truncate"
                  />
                </label>
              </div>

              {/* Phone Number */}
              <div className="form-control md:col-span-2">
                <label className="label pb-1">
                  <span className="label-text font-bold text-sm sm:text-base text-gray-700">
                    Phone Number
                  </span>
                  <span className="label-text-alt text-gray-500 font-medium text-xs">
                    Read-only
                  </span>
                </label>

                <label className="input input-bordered input-sm sm:input-md flex items-center gap-2 bg-gray-50 border-gray-300 cursor-not-allowed">
                  <Phone
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-indigo-600"
                  />
                  <input
                    type="text"
                    value={formData.phone}
                    readOnly
                    className="grow cursor-not-allowed text-gray-600 text-sm"
                  />
                </label>
              </div>
            </div>

            {/* Action Buttons - COMPACT */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200">
              {isEditing ? (
                <>
                  {/* Cancel */}
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost btn-sm sm:btn-md gap-2 hover:scale-105 hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto"
                  >
                    <X size={16} />
                    Cancel
                  </button>

                  {/* Save */}
                  <button
                    onClick={handleEditToggle}
                    disabled={updateProfileStatus.isLoading}
                    className={`btn btn-primary btn-sm sm:btn-md gap-2 hover:scale-105 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 border-0 w-full sm:w-auto ${
                      updateProfileStatus.isLoading ? "loading" : ""
                    }`}
                  >
                    {!updateProfileStatus.isLoading && <Save size={16} />}
                    {updateProfileStatus.isLoading
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </>
              ) : (
                /* Edit Button */
                <button
                  onClick={handleEditToggle}
                  className="btn btn-primary btn-sm sm:btn-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 gap-2 hover:scale-105 transition-all duration-300 shadow-lg w-full sm:w-auto"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
