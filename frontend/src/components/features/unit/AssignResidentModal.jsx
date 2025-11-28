import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignResidentToUnit } from "../../../api/services/unit.api";
import { getSocietyMembers } from "../../../api/services/member.api";
import { useSocietyContext } from "../../../contexts/SocietyContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function AssignResidentModal({ isOpen, onClose, unit }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [unitRole, setUnitRole] = useState("member");

  const queryClient = useQueryClient();
  const { activeSocietyId } = useSocietyContext();

  const { data: membersData, isLoading } = useQuery({
    queryKey: ["societyMembers", activeSocietyId],
    queryFn: () => getSocietyMembers(activeSocietyId),
    enabled: isOpen && !!activeSocietyId,
  });

  const { mutate: assignResident, isPending } = useMutation({
    mutationFn: (data) => assignResidentToUnit(unit._id, data),
    onSuccess: (response) => {
      const { userRole } = response;
      if (userRole?.primaryRole === "admin") {
        toast.success(
          `Unit assigned! Admin role maintained, unit role: ${userRole.unitRole}`
        );
      } else {
        toast.success("Resident assigned successfully");
      }
      queryClient.invalidateQueries(["unit", unit._id]);
      queryClient.invalidateQueries(["buildings"]);
      queryClient.invalidateQueries(["societyMembers", activeSocietyId]);
      setSelectedUser(null);
      setSearchQuery("");
      setUnitRole("member");
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to assign resident");
    },
  });

  const members = membersData?.members || [];

  const filteredMembers = members.filter((member) => {
    const name = member.user?.name || "";
    const email = member.user?.email || "";
    const query = searchQuery.toLowerCase();

    return (
      name.toLowerCase().includes(query) || email.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    if (selectedUser) {
      // If user already has a unit role, use it; otherwise default to member
      setUnitRole(selectedUser.unitRole || "member");
    }
  }, [selectedUser]);

  const handleAssign = () => {
    if (!selectedUser) return;

    assignResident({ 
      userId: selectedUser.user._id, 
      unitRole: unitRole 
    });
  };

  if (!isOpen) return null;

  // Check if selected user is admin (primary role)
  const isAdminUser = selectedUser?.roleInSociety === "admin";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-xl sm:rounded-2xl bg-white shadow-2xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 shrink-0">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
              Assign Resident
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              {unit.name} - Select member and role
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 sm:p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          {/* Search */}
          <div className="mb-4 sm:mb-6">
            <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700">
              Search Member
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg sm:rounded-xl border-2 border-gray-200 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Unit Role Selection */}
          {selectedUser && (
            <div className="mb-4 sm:mb-6">
              <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700">
                Select Unit Role
              </label>
              <select
                value={unitRole}
                onChange={(e) => setUnitRole(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl border-2 border-gray-200 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              >
                <option value="owner">Owner</option>
                <option value="member">Member</option>
                <option value="tenant">Tenant</option>
              </select>
              {isAdminUser && (
                <div className="mt-2 sm:mt-3 rounded-lg bg-linear-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-500 p-2 sm:p-3">
                  <p className="text-xs text-purple-700 flex items-start gap-2">
                    <svg className="h-4 w-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>
                      <strong className="font-semibold">Admin role preserved!</strong> This user's primary admin role will stay unchanged.
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Selected User Card */}
          {selectedUser && (
            <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-xl border-2 border-indigo-200 bg-linear-to-br from-indigo-50 to-purple-50 p-3 sm:p-4">
              <p className="mb-2 text-xs sm:text-sm font-semibold text-indigo-900">
                Selected Member
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-purple-600 text-base sm:text-lg font-bold text-white shadow-lg">
                  {selectedUser.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {selectedUser.user?.name}
                    </p>
                    {isAdminUser && (
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800">
                        🛡️ Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{selectedUser.user?.email}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-gray-500">
                    <span className="font-medium">Primary:</span>
                    <span className="capitalize">{selectedUser.roleInSociety}</span>
                    {selectedUser.unitRole && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-medium">Unit:</span>
                        <span className="capitalize">{selectedUser.unitRole}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="mb-4">
            <label className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700">
              Select Member
            </label>
            {isLoading ? (
              <div className="flex justify-center py-6 sm:py-8">
                <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300 p-6 sm:p-8 text-center">
                <p className="text-sm sm:text-base text-gray-500">No members found</p>
              </div>
            ) : (
              <div className="max-h-48 sm:max-h-64 space-y-2 overflow-y-auto rounded-lg sm:rounded-xl border-2 border-gray-200 p-2">
                {filteredMembers.map((member) => {
                  const isSelected = selectedUser?._id === member._id;
                  const memberIsAdmin = member.roleInSociety === "admin";

                  return (
                    <div
                      key={member._id}
                      onClick={() => setSelectedUser(member)}
                      className={`cursor-pointer rounded-lg border-2 p-2 sm:p-3 transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-transparent bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {member.user?.name}
                            </p>
                            {memberIsAdmin && (
                              <span className="inline-flex items-center rounded-full bg-purple-100 px-1.5 sm:px-2 py-0.5 text-xs font-medium text-purple-800">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{member.user?.email}</p>
                          {member.unit && (
                            <p className="mt-1 text-xs text-gray-500">
                              Unit: {member.unit.name}
                              {member.unitRole && (
                                <span className="ml-1 capitalize">({member.unitRole})</span>
                              )}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <svg className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 border-t border-gray-200 px-4 py-3 sm:px-6 sm:py-4 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 rounded-lg sm:rounded-xl border-2 border-gray-300 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedUser || isPending}
            className="w-full sm:flex-1 rounded-lg sm:rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Assigning..." : "Assign Resident"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignResidentModal;
