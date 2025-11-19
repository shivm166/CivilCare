// import React, { useState, useEffect } from "react";
// import {
//   LogOut,
//   User,
//   Mail,
//   Phone,
//   Edit3,
//   CheckCircle,
//   X,
//   Save,
//   AlertOctagon,
//   Camera,
// } from "lucide-react";
// import useProfile from "../../../../hooks/api/auth/useProfile";
// import useLogout from "../../../../hooks/api/auth/useLogout";

// const ProfilePage = () => {
//   const { user, loading, error, updateProfileMutation, updateProfileStatus } =
//     useProfile();
//   const { logoutUser } = useLogout();

//   const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
//   const [isEditing, setIsEditing] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//       });
//     }
//   }, [user]);

//   const validate = (data) => {
//     const temp = {};
//     if (!data.name?.trim()) {
//       temp.name = "Name is required";
//     } else if (data.name.trim().length < 2) {
//       temp.name = "Name must be at least 2 characters long";
//     } else if (!/^[A-Za-z\s]+$/.test(data.name)) {
//       temp.name = "Name must contain only letters and spaces";
//     }
//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "name") {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//       if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
//       if (errors.general) setErrors((prev) => ({ ...prev, general: "" }));
//     }
//   };

//   const handleEditToggle = () => {
//     if (isEditing) {
//       if (!validate(formData)) return;
//       setSuccess("");
//       updateProfileMutation(
//         { name: formData.name },
//         {
//           onSuccess: (res) => {
//             if (res?.success) {
//               setSuccess(res.message || "Profile updated successfully!");
//               setIsEditing(true);
//               setTimeout(() => setSuccess(""), 3000);
//             }
//           },
//           onError: (err) => {
//             setErrors({
//               general:
//                 err.response?.data?.message ||
//                 "Failed to update profile. Please try again.",
//             });
//           },
//         }
//       );
//     } else {
//       setIsEditing(true);
//       setSuccess("");
//       setErrors({});
//     }
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setErrors({});
//     setSuccess("");
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
//         <div className="loading loading-spinner loading-lg text-primary"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
//         <div className="alert alert-error shadow-2xl max-w-md">
//           <AlertOctagon />
//           <span>Error loading profile: {error.message}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
//       <div className="max-w-3xl mx-auto">
//         {/* Logout Button - Top Right */}
//         <div className="flex justify-end mb-6">
//           <button
//             onClick={logoutUser}
//             className="btn btn-error gap-2 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
//           >
//             Logout
//             <LogOut size={18} />
//           </button>
//         </div>

//         {/* Main Profile Card */}
//         <div className="card bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
//           <div className="card-body p-8 md:p-12">
//             {/* Avatar Section */}
//             <div className="flex flex-col items-center mb-8">
//               <div className="relative group">
//                 <div className="avatar">
//                   <div className="w-32 md:w-40 rounded-full ring ring-primary ring-offset-4 ring-offset-base-100 shadow-2xl group-hover:ring-offset-8 group-hover:ring-[6px] transition-all duration-500">
//                     <img
//                       src={`https://ui-avatars.com/api/?name=${
//                         formData.name || "U"
//                       }&background=gradient&color=fff&size=256`}
//                       alt="avatar"
//                       className="group-hover:scale-110 transition-transform duration-500"
//                     />
//                   </div>
//                 </div>
//                 <button className="absolute bottom-2 right-2 btn btn-circle btn-primary btn-sm shadow-xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
//                   <Camera size={16} />
//                 </button>
//               </div>
//               <div className="text-center mt-6 space-y-2">
//                 <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
//                   {formData.name}
//                 </h2>
//                 <p className="text-gray-600 flex items-center justify-center gap-2">
//                   <Mail size={16} />
//                   {formData.email}
//                 </p>
//               </div>
//             </div>

//             <div className="divider text-gray-400">Profile Information</div>

//             {/* Form Section */}
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleEditToggle();
//               }}
//               className="space-y-6"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Name Field */}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text font-semibold text-gray-700">
//                       Full Name
//                     </span>
//                   </label>
//                   <label className="input input-bordered flex items-center gap-3 bg-gray-50 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 focus-within:input-primary focus-within:bg-white">
//                     <User size={18} className="text-primary" />
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       readOnly={!isEditing}
//                       className={`grow ${
//                         !isEditing
//                           ? "cursor-not-allowed text-gray-500"
//                           : "text-gray-900"
//                       }`}
//                       placeholder="Enter your name"
//                     />
//                   </label>
//                   {errors.name && (
//                     <p className="text-sm text-error mt-2 animate-pulse">
//                       {errors.name}
//                     </p>
//                   )}
//                 </div>

//                 {/* Email Field */}
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text font-semibold text-gray-700">
//                       Email Address
//                     </span>
//                   </label>
//                   <label className="input input-bordered flex items-center gap-3 bg-gray-100 cursor-not-allowed shadow-md">
//                     <Mail size={18} className="text-gray-400" />
//                     <input
//                       type="email"
//                       value={formData.email}
//                       readOnly
//                       className="grow cursor-not-allowed text-gray-500"
//                     />
//                   </label>
//                 </div>

//                 {/* Phone Field */}
//                 <div className="form-control md:col-span-2">
//                   <label className="label">
//                     <span className="label-text font-semibold text-gray-700">
//                       Phone Number
//                     </span>
//                   </label>
//                   <label className="input input-bordered flex items-center gap-3 bg-gray-100 cursor-not-allowed shadow-md">
//                     <Phone size={18} className="text-gray-400" />
//                     <input
//                       type="text"
//                       value={formData.phone}
//                       readOnly
//                       className="grow cursor-not-allowed text-gray-500"
//                     />
//                   </label>
//                 </div>
//               </div>

//               {/* Success Alert */}
//               {success && (
//                 <div className="alert alert-success shadow-xl animate-bounce">
//                   <CheckCircle size={20} />
//                   <span className="font-semibold">{success}</span>
//                 </div>
//               )}

//               {/* Error Alert */}
//               {errors.general && (
//                 <div className="alert alert-error shadow-xl">
//                   <AlertOctagon size={20} />
//                   <span className="font-semibold">{errors.general}</span>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex gap-4 justify-end pt-4">
//                 {isEditing && (
//                   <button
//                     type="button"
//                     onClick={handleCancel}
//                     className="btn btn-ghost gap-2 hover:scale-110 transition-all duration-300"
//                   >
//                     <X size={18} />
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   type={isEditing ? "submit" : "button"}
//                   onClick={!isEditing ? handleEditToggle : undefined}
//                   disabled={updateProfileStatus.isLoading}
//                   className={`btn btn-primary gap-2 shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 ${
//                     updateProfileStatus.isLoading ? "loading" : ""
//                   }`}
//                 >
//                   {isEditing ? (
//                     <>
//                       <Save size={18} /> Save Changes
//                     </>
//                   ) : (
//                     <>
//                       <Edit3 size={18} /> Edit Profile
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

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
              setSuccess(res.message || "Profile updated successfully!");
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

  // UI — File–2 Design applied
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">Profile</h1>

          {/* REAL LOGOUT from file-1 logic */}
          <button
            onClick={logoutUser}
            className="btn btn-error gap-2 hover:scale-105 transition-all duration-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Message */}
        {success && (
          <div className="alert alert-success shadow-lg mb-6 animate-pulse">
            <CheckCircle size={20} />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="alert alert-error shadow-lg mb-6">
            <AlertOctagon size={20} />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="card bg-white shadow-xl rounded-3xl overflow-hidden">
          {/* Purple Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="avatar">
                  <div className="w-36 h-36 rounded-full bg-white shadow-2xl flex items-center justify-center text-6xl font-bold text-indigo-600">
                    {formData.name
                      ? formData.name.substring(0, 2).toUpperCase()
                      : "U"}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 btn btn-circle btn-sm bg-white text-indigo-600 border-0 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-300 shadow-lg">
                  <Camera size={16} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-3">
                  {formData.name}
                </h2>
                <p className="text-indigo-100 flex items-center justify-center md:justify-start gap-2 text-lg">
                  <Mail size={20} />
                  {formData.email}
                </p>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={handleEditToggle}
                  className="btn bg-white text-indigo-600 hover:bg-indigo-50 border-0 gap-2 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="form-control">
                <label className="label pb-3">
                  <span className="label-text font-bold text-lg text-gray-700">
                    Full Name
                  </span>
                  {isEditing && (
                    <span className="label-text-alt text-indigo-600 font-medium">
                      Editable
                    </span>
                  )}
                </label>

                <label
                  className={`input input-bordered input-lg flex items-center gap-3 transition-all duration-300 ${
                    isEditing
                      ? "border-indigo-400 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 bg-white"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <User size={22} className="text-indigo-600" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`grow text-lg ${
                      !isEditing
                        ? "cursor-not-allowed text-gray-600"
                        : "text-gray-900"
                    }`}
                    placeholder="Enter your full name"
                  />
                </label>
                {errors.name && (
                  <p className="text-sm text-error mt-2 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label pb-3">
                  <span className="label-text font-bold text-lg text-gray-700">
                    Email Address
                  </span>
                  <span className="label-text-alt text-gray-500 font-medium">
                    Read-only
                  </span>
                </label>

                <label className="input input-bordered input-lg flex items-center gap-3 bg-gray-50 border-gray-300 cursor-not-allowed">
                  <Mail size={22} className="text-indigo-600" />
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="grow cursor-not-allowed text-gray-600 text-lg"
                  />
                </label>
              </div>

              {/* Phone Number */}
              <div className="form-control md:col-span-2">
                <label className="label pb-3">
                  <span className="label-text font-bold text-lg text-gray-700">
                    Phone Number
                  </span>
                  <span className="label-text-alt text-gray-500 font-medium">
                    Read-only
                  </span>
                </label>

                <label className="input input-bordered input-lg flex items-center gap-3 bg-gray-50 border-gray-300 cursor-not-allowed">
                  <Phone size={22} className="text-indigo-600" />
                  <input
                    type="text"
                    value={formData.phone}
                    readOnly
                    className="grow cursor-not-allowed text-gray-600 text-lg"
                  />
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10 pt-8 border-t-2 border-gray-200">
                {/* Cancel */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-ghost btn-lg gap-2 hover:scale-105 hover:bg-gray-100 transition-all duration-300"
                >
                  <X size={20} />
                  Cancel
                </button>

                {/* Save */}
                <button
                  onClick={handleEditToggle}
                  disabled={updateProfileStatus.isLoading}
                  className={`btn btn-primary btn-lg gap-2 hover:scale-105 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 border-0 ${
                    updateProfileStatus.isLoading ? "loading" : ""
                  }`}
                >
                  {!updateProfileStatus.isLoading && <Save size={20} />}
                  {updateProfileStatus.isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
