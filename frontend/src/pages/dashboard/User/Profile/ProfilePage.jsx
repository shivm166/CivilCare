import React, { useState, useEffect } from "react";
import { LogOut, User, Mail, Phone, Edit3, CheckCircle, X } from "lucide-react";
import useProfile from "../../hooks/useProfile.js";
import useLogout from "../../hooks/useLogout.js";

const ProfilePage = () => {
  const { user, loading, error, updateProfileMutation, updateProfileStatus } =
    useProfile();
  const { logoutUser } = useLogout();

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  // Populate form when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Enhanced validation for name (since email and phone are read-only, no need for their validation)
  const validate = (data) => {
    const temp = {};
    if (!data.name?.trim()) {
      temp.name = "Name is required";
    } else if (data.name.trim().length < 2) {
      temp.name = "Name must be at least 2 characters long";
    } else if (!/^[A-Za-z\s]+$/.test(data.name)) {
      temp.name = "Name must contain only letters and spaces";
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear errors on change for better UX
      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (!validate(formData)) return;
      updateProfileMutation(
        { name: formData.name },
        {
          onSuccess: (res) => {
            if (res?.success) {
              setSuccess(res.message || "Profile updated successfully!");
              setIsEditing(false);
              setTimeout(() => setSuccess(""), 3000);
            }
          },
          onError: (err) => {
            setErrors({
              general: "Failed to update profile. Please try again.",
            });
            console.error(err);
          },
        }
      );
    } else {
      setIsEditing(true);
      setSuccess("");
      setErrors({});
    }
  };

  const handleProfileClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSuccess("");
    setErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="alert alert-error shadow-lg">
          <span>Error loading profile: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex flex-col items-center py-12 px-4">
      {/* Adjusted logout button: Positioned neatly in the top-right with better styling and hover effect */}
      <div className="w-full max-w-4xl flex justify-end mb-6">
        <button
          onClick={logoutUser}
          className="btn btn-error btn-sm flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 ease-in-out"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Profile Summary Card - Clickable to open modal */}
      <div
        className="w-full max-w-lg card bg-base-100 shadow-2xl rounded-2xl border border-base-300 hover:shadow-3xl transition-all duration-300 cursor-pointer hover:scale-102"
        onClick={handleProfileClick}
      >
        <div className="card-body p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="avatar">
              <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-2 hover:ring-offset-4 transition-all duration-300">
                <img
                  src={`https://ui-avatars.com/api/?name=${
                    formData.name || "U"
                  }&background=random`}
                  alt="avatar"
                  className="transition-opacity duration-300 hover:opacity-90"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-base-content">
                {formData.name || "User"}
              </h3>
              <p className="text-sm text-base-content/70">{formData.email}</p>
            </div>
          </div>
          <div className="text-center text-base-content/60">
            <p>Click to view and edit your profile</p>
          </div>
        </div>
      </div>

      {/* Modal for Profile Details and Editing */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg bg-base-100 shadow-2xl rounded-2xl border border-base-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit Profile</h3>
              <button
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost hover:bg-base-200 transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-6">
              {/* Name field with enhanced styling and hover */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Name</span>
                </label>
                <div className="input input-bordered flex items-center gap-2 hover:input-primary focus-within:input-primary transition-all duration-200">
                  <User size={16} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`grow transition-all duration-200 ${
                      !isEditing
                        ? "bg-base-200 cursor-not-allowed text-base-content/60"
                        : "bg-base-100 text-base-content hover:bg-base-50"
                    }`}
                    placeholder="Enter your name"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-error mt-2 animate-pulse">
                    {errors.name}
                  </p>
                )}
              </div>
              {/* Email field (read-only) with subtle styling */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="input input-bordered flex items-center gap-2 bg-base-200 hover:bg-base-300 transition-colors duration-200">
                  <Mail size={16} />
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="grow cursor-not-allowed text-base-content/60"
                  />
                </div>
              </div>
              {/* Phone field (read-only) with subtle styling */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Phone</span>
                </label>
                <div className="input input-bordered flex items-center gap-2 bg-base-200 hover:bg-base-300 transition-colors duration-200">
                  <Phone size={16} />
                  <input
                    type="text"
                    value={formData.phone}
                    readOnly
                    className="grow cursor-not-allowed text-base-content/60"
                  />
                </div>
              </div>
              {/* General error display */}
              {errors.general && (
                <p className="text-sm text-error text-center animate-bounce">
                  {errors.general}
                </p>
              )}
              {/* Edit/Save button with hover and loading animation */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleEditToggle}
                  disabled={updateProfileStatus.isLoading}
                  className={`btn btn-primary w-1/2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 ease-in-out ${
                    updateProfileStatus.isLoading ? "loading" : ""
                  }`}
                >
                  <Edit3 size={16} />
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>
              {/* Success message with animation */}
              {success && (
                <div className="mt-4 text-center animate-fade-in">
                  <div className="inline-flex items-center gap-2 bg-success text-success-content px-4 py-2 rounded-lg shadow-md">
                    <CheckCircle size={16} />
                    <span>{success}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-action">
              <button
                onClick={closeModal}
                className="btn btn-ghost hover:bg-base-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
