import React, { useState, useEffect } from "react";
import { LogOut, User, Mail, Phone, Edit3, CheckCircle } from "lucide-react";
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

  // populate form when user loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);
  const validate = (data) => {
    const temp = {};
    if (!data.name?.trim()) temp.name = "Name is required";
    else if (!/^[A-Za-z\s]+$/.test(data.name))
      temp.name = "Name must contain only letters and spaces";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setFormData((s) => ({ ...s, [name]: value }));
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
            setErrors({ general: "Failed to update profile" });
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

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl flex justify-end mb-6">
        <button
          onClick={logoutUser}
          className="btn btn-error btn-sm flex items-center gap-2"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="w-full max-w-lg card bg-base-100 shadow-xl rounded-xl border">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-4">
            <div className="avatar">
              <div className="w-16 rounded-full ring ring-primary">
                <img
                  src={`https://ui-avatars.com/api/?name=${
                    formData.name || "U"
                  }&background=random`}
                  alt="avatar"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {formData.name || "User"}
              </h3>
              <p className="text-sm text-gray-500">{formData.email}</p>
            </div>
          </div>
          <div className="divider my-1" />
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <div className="input input-bordered flex items-center gap-2">
                <User size={16} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`grow ${
                    !isEditing ? "bg-base-200 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter name"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-error mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="input input-bordered flex items-center gap-2 bg-base-200">
                <Mail size={16} />
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="grow cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone (read-only) */}
            <div>
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <div className="input input-bordered flex items-center gap-2 bg-base-200">
                <Phone size={16} />
                <input
                  type="text"
                  value={formData.phone}
                  readOnly
                  className="grow cursor-not-allowed"
                />
              </div>
            </div>
            {errors.general && (
              <p className="text-sm text-error">{errors.general}</p>
            )}
            <div className="flex justify-center mt-3">
              <button
                onClick={handleEditToggle}
                disabled={updateProfileStatus.isLoading}
                className={`btn btn-primary w-1/2 ${
                  updateProfileStatus.isLoading ? "loading" : ""
                }`}
              >
                <Edit3 size={16} />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>
            {success && (
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg">
                  <CheckCircle size={16} />
                  <span>{success}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
