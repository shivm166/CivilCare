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

  // Populate form when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Validation logic (unchanged, but now feeds into the 'errors' state)
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
      // Clear errors on change
      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
      if (errors.general) setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  // Combined "Edit" and "Save" handler
  const handleEditToggle = () => {
    // If we are currently editing, this click means "Save"
    if (isEditing) {
      if (!validate(formData)) return; // Stop if validation fails

      setSuccess(""); // Clear previous success messages
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
              general:
                err.response?.data?.message ||
                "Failed to update profile. Please try again.",
            });
          },
        }
      );
    }
    // If we are not editing, this click means "Edit"
    else {
      setIsEditing(true);
      setSuccess("");
      setErrors({});
    }
  };

  // New handler for the "Cancel" button
  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setSuccess("");
    // Reset form data to the original user data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
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
        <div className="alert alert-error shadow-lg max-w-md">
          <AlertOctagon />
          <span>Error loading profile: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* === Main Profile Card === */}
        <div className="card w-full bg-base-100 shadow-xl rounded-2xl">
          <div className="card-body p-6 md:p-8">
            {/* Avatar and Name Section */}
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${
                      formData.name || "U"
                    }&background=random&color=fff&size=128`}
                    alt="avatar"
                  />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">{formData.name}</h2>
                <p className="text-base-content/70">{formData.email}</p>
              </div>
            </div>

            <div className="divider">Profile Details</div>

            {/* Form Section */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditToggle();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field (Editable) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2 transition-all duration-300 ease-in-out focus-within:input-primary">
                    <User size={16} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={`grow ${
                        !isEditing
                          ? "bg-transparent cursor-not-allowed text-base-content/70"
                          : "bg-transparent"
                      }`}
                      placeholder="Enter your name"
                    />
                  </label>
                  {errors.name && (
                    <p className="text-sm text-error mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field (Read-only) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2 bg-base-200 cursor-not-allowed">
                    <Mail size={16} />
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="grow bg-transparent cursor-not-allowed text-base-content/70"
                    />
                  </label>
                </div>

                {/* Phone Field (Read-only) */}
                <div className="form-control col-span-1 md:col-span-2">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2 bg-base-200 cursor-not-allowed">
                    <Phone size={16} />
                    <input
                      type="text"
                      value={formData.phone}
                      readOnly
                      className="grow bg-transparent cursor-not-allowed text-base-content/70"
                    />
                  </label>
                </div>
              </div>

              {/* Success Alert */}
              {success && (
                <div className="alert alert-success shadow-sm mt-4">
                  <CheckCircle size={16} />
                  <span>{success}</span>
                </div>
              )}

              {/* General Error Alert */}
              {errors.general && (
                <div className="alert alert-error shadow-sm mt-4">
                  <AlertOctagon size={16} />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="card-actions justify-end pt-6">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
                <button
                  type={isEditing ? "submit" : "button"}
                  onClick={!isEditing ? handleEditToggle : undefined}
                  disabled={updateProfileStatus.isLoading}
                  className={`btn btn-primary ${
                    updateProfileStatus.isLoading ? "loading" : ""
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 size={16} /> Edit Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* === Danger Zone Card === */}
        <div className="card w-full bg-base-100 shadow-xl rounded-2xl border border-error/50">
          <div className="card-body flex-col md:flex-row md:items-center md:justify-between p-6">
            <div>
              <h3 className="card-title text-error">Logout</h3>
              <p className="text-base-content/70">
                Log out of your CivilCare account.
              </p>
            </div>
            <button
              onClick={logoutUser}
              className="btn btn-error btn-outline mt-4 md:mt-0 md:ml-4"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
