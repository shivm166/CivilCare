import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignResidentToUnit } from "../../../api/services/unit.api";
import { getSocietyMembers } from "../../../api/services/member.api"; // ✅ Import service
import { useSocietyContext } from "../../../contexts/SocietyContext"; // ✅ Import context
import { useState } from "react";
import toast from "react-hot-toast"; // ✅ Added toast import if missing

function AssignResidentModal({ isOpen, onClose, unit }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("member");

  const queryClient = useQueryClient();
  const { activeSocietyId } = useSocietyContext(); // ✅ Get society ID

  // ✅ Use correct API service
  const { data: membersData, isLoading } = useQuery({
    queryKey: ["societyMembers", activeSocietyId],
    queryFn: () => getSocietyMembers(activeSocietyId),
    enabled: isOpen && !!activeSocietyId,
  });

  const { mutate: assignResident, isPending } = useMutation({
    mutationFn: (data) => assignResidentToUnit(unit._id, data), // ✅ Fixed unit._id access
    onSuccess: () => {
      toast.success("Resident assigned successfully");
      queryClient.invalidateQueries(["unit", unit._id]);
      queryClient.invalidateQueries(["buildings"]); // Refresh building view too
      setSelectedUser(null);
      setSearchQuery("");
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to assign resident");
    },
  });

  const members = membersData?.members || [];

  // ✅ Fix filter logic to handle nested user object
  const filteredMembers = members.filter((member) => {
    const name = member.user?.name || "";
    const email = member.user?.email || "";
    const query = searchQuery.toLowerCase();

    return (
      name.toLowerCase().includes(query) || email.toLowerCase().includes(query)
    );
  });

  const handleAssign = () => {
    if (!selectedUser) return;
    // ✅ Send the USER ID (from the nested user object), not the member ID
    assignResident({ userId: selectedUser.user._id, role });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Assign Resident to {unit?.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Select a member and assign their role
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <div className="flex gap-3">
              {["owner", "member", "tenant"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                    role === r
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {selectedUser && (
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  {/* ✅ Corrected data access */}
                  <p className="font-medium text-indigo-900">
                    {selectedUser.user?.name}
                  </p>
                  <p className="text-sm text-indigo-700">
                    {selectedUser.user?.email}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Member
            </label>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading members...
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No members found
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <div
                    key={member._id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedUser?._id === member._id ? "bg-indigo-50" : ""
                    }`}
                    onClick={() => setSelectedUser(member)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        {/* ✅ Corrected data access for display */}
                        <p className="font-medium text-gray-900">
                          {member.user?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {member.user?.email}
                        </p>
                        {/* Optional: Show unit if already assigned */}
                        {member.unit && (
                          <p className="text-xs text-gray-500 mt-1">
                            Current Unit: {member.unit.unitNumber || "Assigned"}
                          </p>
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
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedUser || isPending}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
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