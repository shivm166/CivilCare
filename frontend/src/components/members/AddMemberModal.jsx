import React, { useState, useEffect } from "react";
import {
  FiUserPlus,
  FiMail,
  FiSearch,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { useSearchUserByEmail } from "../../hooks/useMembers";
import toast from "react-hot-toast";

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
    // Reset states when modal type changes
    setFoundUser(null);
    setShowNotFound(false);
  }, [modalType]);

  if (!isOpen) return null;

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email search
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
        // ✅ User found
        setFoundUser(result.user);
        setShowNotFound(false);
        toast.success("User found!");
      } else {
        // ❌ User not found - Auto switch to invite tab
        setFoundUser(null);
        setShowNotFound(true);

        // Pre-fill email in invite form
        setNewUserData({
          ...newUserData,
          email: email.toLowerCase(),
        });

        // Show message and auto-switch after 1.5 seconds
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

  // Handle add existing user
  const handleAddExisting = () => {
    if (!foundUser) {
      toast.error("Please search and select a user first");
      return;
    }

    onAddMember({ userId: foundUser._id, roleInSociety: "member" });
    handleClose();
  };

  // Handle invite new user
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

  // Close and reset
  const handleClose = () => {
    setSearchEmail("");
    setFoundUser(null);
    setShowNotFound(false);
    setNewUserData({ name: "", email: "", phone: "", roleInSociety: "member" });
    setModalType("existing");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Member</h2>
            <p className="text-gray-600 mt-1">
              Search by email or invite new member
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
          >
            <FiX />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setModalType("existing")}
            className={`flex-1 py-3 font-medium transition-all ${
              modalType === "existing"
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiUserPlus className="inline mr-2" />
            Search Existing User
          </button>
          <button
            onClick={() => setModalType("new")}
            className={`flex-1 py-3 font-medium transition-all ${
              modalType === "new"
                ? "text-purple-600 border-b-2 border-purple-600 bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiMail className="inline mr-2" />
            Invite New User
          </button>
        </div>

        <div className="p-6">
          {modalType === "existing" ? (
            /* ========== EXISTING USER TAB ========== */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter exact email address..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearchByEmail();
                      }
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSearchByEmail}
                    disabled={searchUserMutation.isPending}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                  >
                    <FiSearch />
                    {searchUserMutation.isPending ? "Searching..." : "Search"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Enter the complete email address to search
                </p>
              </div>

              {/* Not Found Message */}
              {showNotFound && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                  <FiAlertCircle className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">
                      User not found
                    </p>
                    <p className="text-yellow-700 text-sm mt-1">
                      No user exists with email:{" "}
                      <span className="font-mono">{searchEmail}</span>
                    </p>
                    <p className="text-yellow-600 text-sm mt-1">
                      Redirecting to invite form...
                    </p>
                  </div>
                </div>
              )}

              {/* Found User Card */}
              {foundUser && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-5 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {foundUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {foundUser.name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        📧 {foundUser.email}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        📱 {foundUser.phone}
                      </p>
                      {foundUser.isInvited && !foundUser.isActivated && (
                        <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full mt-2">
                          ⏳ Activation Pending
                        </span>
                      )}
                      {foundUser.isActivated && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mt-2">
                          ✅ Active Account
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExisting}
                  disabled={!foundUser}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {foundUser ? "Send Invitation" : "Search User First"}
                </button>
              </div>
            </div>
          ) : (
            /* ========== INVITE NEW USER TAB ========== */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newUserData.name}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={newUserData.phone}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, phone: e.target.value })
                  }
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-700 flex items-start gap-2">
                  <span className="text-lg">📧</span>
                  <span>
                    An invitation email will be sent to activate the account.
                    The user can set their password and join the society.
                  </span>
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteNew}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
