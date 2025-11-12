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
    setFoundUser(null);
    setShowNotFound(false);
  }, [modalType]);

  if (!isOpen) return null;

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSearchByEmail = async () => {
    const email = searchEmail.trim();
    if (!email) return toast.error("Please enter an email address");
    if (!isValidEmail(email)) return toast.error("Invalid email format");

    try {
      const result = await searchUserMutation.mutateAsync(email);
      if (result.success && result.found) {
        setFoundUser(result.user);
        setShowNotFound(false);
        toast.success("User found!");
      } else {
        setFoundUser(null);
        setShowNotFound(true);
        setNewUserData((d) => ({ ...d, email: email.toLowerCase() }));
        toast.error("User not found. Redirecting to invite...");
        setTimeout(() => {
          setModalType("new");
          setShowNotFound(false);
        }, 1500);
      }
    } catch {
      toast.error("Search failed");
    }
  };

  const handleAddExisting = () => {
    if (!foundUser) return toast.error("Search and select a user first");
    onAddMember({ userId: foundUser._id, roleInSociety: "member" });
    handleClose();
  };

  const handleInviteNew = () => {
    const { name, email, phone } = newUserData;
    if (!name || !email || !phone)
      return toast.error("All fields are required");
    if (!isValidEmail(email)) return toast.error("Invalid email");
    onInviteMember(newUserData);
    handleClose();
  };

  const handleClose = () => {
    setSearchEmail("");
    setFoundUser(null);
    setShowNotFound(false);
    setNewUserData({
      name: "",
      email: "",
      phone: "",
      roleInSociety: "member",
    });
    setModalType("existing");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
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

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setModalType("existing")}
            className={`flex-1 py-3 font-medium ${
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
            className={`flex-1 py-3 font-medium ${
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
            <>
              {/* Search Existing */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSearchByEmail()
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSearchByEmail}
                      disabled={searchUserMutation.isPending}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <FiSearch />
                      {searchUserMutation.isPending ? "Searching..." : "Search"}
                    </button>
                  </div>
                </div>

                {showNotFound && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                    <FiAlertCircle className="text-yellow-600 text-xl" />
                    <p className="text-yellow-700">
                      No user found with {searchEmail}, redirecting...
                    </p>
                  </div>
                )}

                {foundUser && (
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                    <h3 className="font-semibold">{foundUser.name}</h3>
                    <p>{foundUser.email}</p>
                    <p>{foundUser.phone}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExisting}
                    disabled={!foundUser}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                  >
                    Add to Society
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Invite New */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newUserData.name}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newUserData.phone}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <button
                  onClick={handleInviteNew}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg"
                >
                  Send Invitation
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
