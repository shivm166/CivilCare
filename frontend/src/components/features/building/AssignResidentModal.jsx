import React, { useState } from "react";
import { X, Search, UserPlus } from "lucide-react";
import { useAssignResident } from "../../../hooks/api/useBuildings";
import { useMembers } from "../../../hooks/api/useMembers";
import { useSocietyContext } from "../../../contexts/SocietyContext";

function AssignResidentModal({ isOpen, onClose, unit }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("member");

  const { activeSocietyId } = useSocietyContext();
  const { members, isMembersLoading } = useMembers(activeSocietyId);
  const { mutate: assignResident, isPending } = useAssignResident();

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedUser) return;

    assignResident(
      {
        unitId: unit._id,
        data: {
          userId: selectedUser._id,
          role,
        },
      },
      {
        onSuccess: () => {
          setSelectedUser(null);
          setRole("member");
          setSearchQuery("");
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Assign Resident to {unit.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Select a member and assign their role
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole("owner")}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  role === "owner"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => setRole("member")}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  role === "member"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => setRole("tenant")}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  role === "tenant"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                Tenant
              </button>
            </div>
          </div>

          {/* Selected User Display */}
          {selectedUser && (
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-indigo-900">
                    Selected: {selectedUser.name}
                  </p>
                  <p className="text-sm text-indigo-700">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Members List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Member
            </label>
            {isMembersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading members...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">
                  {searchQuery ? "No members found" : "No members available"}
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-[300px] overflow-y-auto">
                {filteredMembers.map((member) => (
                  <div
                    key={member._id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedUser?._id === member._id ? "bg-indigo-50" : ""
                    }`}
                    onClick={() => setSelectedUser(member)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        {member.phone && (
                          <p className="text-sm text-gray-500">{member.phone}</p>
                        )}
                      </div>
                      {selectedUser?._id === member._id && (
                        <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedUser || isPending}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Assigning..." : "Assign Resident"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignResidentModal;