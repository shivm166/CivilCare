import React, { useState, useEffect } from "react";
import {
  FiUserPlus,
  FiMail,
  FiSearch,
  FiX,
  FiAlertCircle,
  FiUser,
  FiPhone,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useSearchUserByEmail } from "../../../../hooks/api/useMembers";

const AddMemberModal = ({ isOpen, onClose, onAddMember, onInviteMember }) => {
  const [modalType, setModalType] = useState("existing");
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [showNotFound, setShowNotFound] = useState(false);

  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    phone: "",
    roleInSociety: "member",
  });

  const searchUserMutation = useSearchUserByEmail();

  useEffect(() => {
    setFoundUser(null);
    setShowNotFound(false);
  }, [modalType]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSearchByEmail = async () => {
    const email = searchEmail.trim();

    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await searchUserMutation.mutateAsync(email);

      if (result.success && result.found) {
        setFoundUser(result.user);
        setShowNotFound(false);
        toast.success("User found!");
      } else {
        setFoundUser(null);
        setShowNotFound(true);
        setNewUserData({ ...newUserData, email: email.toLowerCase() });
        toast.error("User not found. Redirecting to invite...");
        setTimeout(() => {
          setModalType("new");
          setShowNotFound(false);
        }, 1500);
      }
    } catch (error) {
      toast.error("Failed to search user");
      setFoundUser(null);
      setShowNotFound(false);
    }
  };

  const handleAddExisting = () => {
    if (!foundUser) {
      toast.error("Please search and select a user first");
      return;
    }
    onAddMember({ userId: foundUser._id, roleInSociety: "member" });
    handleClose();
  };

  const handleInviteNew = () => {
    if (!newUserData.name || !newUserData.email || !newUserData.phone) {
      toast.error("All fields are required");
      return;
    }

    if (!isValidEmail(newUserData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    onInviteMember(newUserData);
    handleClose();
  };

  const handleClose = () => {
    setSearchEmail("");
    setFoundUser(null);
    setShowNotFound(false);
    setNewUserData({ name: "", email: "", phone: "", roleInSociety: "member" });
    setModalType("existing");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 sm:px-8 pt-6 sm:pt-8 pb-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:rotate-90"
            aria-label="Close modal"
          >
            <FiX className="text-xl" />
          </button>

          <div className="pr-12">
            <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Add Member
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Search existing users or invite new members
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/50">
          <button
            onClick={() => setModalType("existing")}
            className={`flex-1 py-3.5 sm:py-4 px-4 font-semibold text-sm sm:text-base transition-all duration-200 relative ${
              modalType === "existing"
                ? "text-indigo-600 bg-white"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FiUserPlus className="inline mr-2 text-lg" />
            <span className="hidden sm:inline">Search Existing</span>
            <span className="sm:hidden">Search</span>
            {modalType === "existing" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600" />
            )}
          </button>
          <button
            onClick={() => setModalType("new")}
            className={`flex-1 py-3.5 sm:py-4 px-4 font-semibold text-sm sm:text-base transition-all duration-200 relative ${
              modalType === "new"
                ? "text-purple-600 bg-white"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FiMail className="inline mr-2 text-lg" />
            <span className="hidden sm:inline">Invite New</span>
            <span className="sm:hidden">Invite</span>
            {modalType === "new" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600" />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 sm:py-8">
          {modalType === "existing" ? (
            <div className="space-y-5">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search by Email
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearchByEmail()}
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
                    />
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  </div>
                  <button
                    onClick={handleSearchByEmail}
                    disabled={searchUserMutation.isPending}
                    className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
                  >
                    <FiSearch className="text-lg" />
                    <span className="hidden sm:inline">
                      {searchUserMutation.isPending ? "Searching..." : "Search"}
                    </span>
                    <span className="sm:hidden">
                      {searchUserMutation.isPending ? "..." : "Go"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Not Found Alert */}
              {showNotFound && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl p-4 flex items-start gap-3 animate-slideDown">
                  <FiAlertCircle className="text-amber-600 text-xl flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-900 font-semibold text-sm sm:text-base">
                      User not found
                    </p>
                    <p className="text-amber-700 text-xs sm:text-sm mt-1 break-all">
                      {searchEmail}
                    </p>
                    <p className="text-amber-600 text-xs sm:text-sm mt-1.5">
                      Redirecting to invite form...
                    </p>
                  </div>
                </div>
              )}

              {/* Found User Card */}
              {foundUser && (
                <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl p-5 sm:p-6 animate-slideDown overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl flex-shrink-0 shadow-lg">
                      {foundUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                        {foundUser.name}
                      </h3>
                      <div className="space-y-1.5">
                        <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-2 break-all">
                          <FiMail className="shrink-0" />
                          {foundUser.email}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-2">
                          <FiPhone className="flex-shrink-0" />
                          {foundUser.phone}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {foundUser.isInvited && !foundUser.isActivated && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">
                            ⏳ Pending Activation
                          </span>
                        )}
                        {foundUser.isActivated && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">
                            ✓ Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Form Fields */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={newUserData.name}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, name: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
                  />
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={newUserData.email}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
                  />
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="1234567890"
                    value={newUserData.phone}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, phone: e.target.value })
                    }
                    maxLength={10}
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
                  />
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Role in Society
                </label>
                <select
                  value={newUserData.roleInSociety}
                  onChange={(e) =>
                    setNewUserData({
                      ...newUserData,
                      roleInSociety: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none bg-white"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-xl p-4">
                <p className="text-xs sm:text-sm text-purple-700 flex items-start gap-2.5">
                  <span className="text-xl flex-shrink-0">📧</span>
                  <span>
                    An invitation will be sent to activate the account and set password.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-8 py-5 sm:py-6 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={modalType === "existing" ? handleAddExisting : handleInviteNew}
              disabled={modalType === "existing" && !foundUser}
              className={`flex-1 px-6 py-3.5 font-semibold rounded-xl transition-all duration-200 shadow-lg ${
                modalType === "existing"
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-500/30 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/30 hover:shadow-xl"
              }`}
            >
              {modalType === "existing"
                ? foundUser
                  ? "Send Invitation"
                  : "Search First"
                : "Send Invitation"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddMemberModal;
