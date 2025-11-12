import React, { useState } from "react";
import { useMembers } from "../../hooks/useMembers";
import { useSocietyContext } from "../../context/SocietyContext";
import { FiPlus } from "react-icons/fi";
import AddMemberModal from "../../components/members/AddMemberModal";
import MemberCard from "../../components/members/MemberCard";

const ResidentsPage = () => {
  const { activeSocietyId, activeRole } = useSocietyContext();
  const {
    members,
    isMembersLoading,
    addMember,
    inviteMember,
    removeMember,
    isRemovingMember,
  } = useMembers(activeSocietyId);

  const [showAddModal, setShowAddModal] = useState(false);
  const isAdmin = activeRole === "admin";

  const handleRemoveMember = (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      removeMember(memberId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Society Members
            </h1>
            <p className="text-gray-600 mt-1">
              {isAdmin
                ? "Manage your society residents"
                : "View society residents"}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              <FiPlus className="text-xl" />
              Add Member
            </button>
          )}
        </div>

        {isMembersLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500">
              {isAdmin
                ? "No members found. Add your first member!"
                : "No members found in this society."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                onRemove={handleRemoveMember}
                isRemoving={isRemovingMember}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}

        {isAdmin && (
          <AddMemberModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAddMember={addMember}
            onInviteMember={inviteMember}
          />
        )}
      </div>
    </div>
  );
};

export default ResidentsPage;
