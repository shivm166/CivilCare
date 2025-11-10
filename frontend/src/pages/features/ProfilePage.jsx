import React, { useState, useEffect } from "react";
import { LogOut, User, Mail, Phone, Edit3, CheckCircle } from "lucide-react";
import useProfile from "../../hooks/useProfile.js";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePage = () => {
  const { updateProfileMutation, isPending } = useProfile();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const validate = (data) => {
    const tempErrors = {};
    if (!data.name?.trim()) tempErrors.name = "Name is required";
    else if (!/^[A-Za-z\s]+$/.test(data.name))
      tempErrors.name = "Name must contain only letters";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (!validate(formData)) return;

      updateProfileMutation(
        { name: formData.name },
        {
          onSuccess: (data) => {
            if (data?.success) {
              setUser((prev) => ({ ...prev, name: data.user.name }));
              setSuccess(data.message || "Profile updated successfully!");
              setIsEditing(false);
              setTimeout(() => setSuccess(""), 3000);
            }
          },
          onError: () => {
            setErrors({ general: "Failed to update profile" });
          },
        }
      );
    } else {
      setIsEditing(true);
      setSuccess("");
      setErrors({});
    }
  };

  const handleLogout = () => {
    alert("You have been logged out!");
    window.location.href = "/login";
  };

  return (
    <motion.div
      className="min-h-screen bg-base-200 flex flex-col items-center justify-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Logout button */}
      <div className="absolute top-6 right-8">
        <button
          onClick={handleLogout}
          className="btn btn-error btn-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-md"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-primary mb-6 tracking-wide">
        Admin Profile
      </h2>

      {/* Profile Card */}
      <motion.div
        className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 rounded-2xl"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <div className="card-body items-center text-center relative">
          {/* Avatar */}
          <motion.div
            className="avatar mb-4 relative group"
            whileHover={{ scale: 1.08 }}
          >
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden relative">
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                alt="avatar"
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </motion.div>

          {/* Info */}
          <h2 className="card-title text-lg font-bold text-primary">
            {user.name}
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>

          <div className="divider"></div>

          {/* Form */}
          <form
            className="w-full space-y-4 text-left"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Name */}
            <label className="form-control w-full">
              <span className="label-text font-semibold text-left">Name</span>
              <div className="input input-bordered flex items-center gap-2 hover:border-primary transition-all duration-200">
                <User size={18} className="text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`grow focus:outline-none ${
                    !isEditing ? "bg-base-200 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-error text-sm mt-1">{errors.name}</p>
              )}
            </label>

            {/* Email */}
            <label className="form-control w-full">
              <span className="label-text font-semibold text-left">Email</span>
              <div className="input input-bordered flex items-center gap-2 bg-base-200">
                <Mail size={18} className="text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="grow focus:outline-none cursor-not-allowed"
                />
              </div>
            </label>

            {/* Phone */}
            <label className="form-control w-full">
              <span className="label-text font-semibold text-left">
                Phone Number
              </span>
              <div className="input input-bordered flex items-center gap-2 bg-base-200">
                <Phone size={18} className="text-gray-500" />
                <input
                  type="text"
                  value={formData.phone}
                  readOnly
                  className="grow focus:outline-none cursor-not-allowed"
                />
              </div>
            </label>

            {/* Buttons */}
            <div className="card-actions justify-center mt-6">
              <button
                onClick={handleEditToggle}
                disabled={isPending}
                className={`btn btn-primary w-1/2 flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 ${
                  isPending ? "loading" : ""
                }`}
              >
                <Edit3 size={16} />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
          </form>

          {/* ✅ Success Message Animation */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white py-2 px-5 rounded-lg flex items-center gap-2 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <CheckCircle size={18} /> {success}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
