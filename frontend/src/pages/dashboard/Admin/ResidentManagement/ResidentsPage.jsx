import React, { useState, useEffect } from "react";
import { FiPlus, FiCopy, FiCheck, FiUsers } from "react-icons/fi";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import { useMembers } from "../../../../hooks/api/useMembers";
import { getSocietyById } from "../../../../api/services/society.api";
import AddMemberModal from "../../../../components/features/member/AddMemberModal/AddMemberModal";
import MemberCard from "../../../../components/features/member/MemberCard/MemberCard";
import toast from "react-hot-toast";

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
  const [copied, setCopied] = useState(false);
  const [joiningCode, setJoiningCode] = useState("");
  const [isLoadingCode, setIsLoadingCode] = useState(true);

  const isAdmin = activeRole === "admin";

  useEffect(() => {
    const fetchCode = async () => {
      if (activeSocietyId && isAdmin) {
        setIsLoadingCode(true);
        try {
          const society = await getSocietyById(activeSocietyId);
          setJoiningCode(society.JoiningCode || "");
        } catch (error) {
          console.error("Error fetching code:", error);
        } finally {
          setIsLoadingCode(false);
        }
      } else {
        setIsLoadingCode(false);
      }
    };
    fetchCode();
  }, [activeSocietyId, isAdmin]);

  const handleCopyCode = () => {
    if (joiningCode) {
      navigator.clipboard.writeText(joiningCode);
      setCopied(true);
      toast.success("Joining code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      removeMember(memberId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
              Society Members
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
              {isAdmin ? "Manage residents" : "View residents"}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:shadow-lg transition-all text-sm sm:text-base font-medium w-full sm:w-auto"
            >
              <FiPlus className="text-lg sm:text-xl" />
              Add Member
            </button>
          )}
        </div>

        {/* COMPACT Joining Code Card - Half Width on Desktop */}
        {isAdmin && (
          <div className="mb-4 sm:mb-6 max-w-full lg:max-w-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-3 sm:p-4 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                {/* Compact Header */}
                <div className="flex-shrink-0">
                  <h3 className="text-sm sm:text-base font-semibold flex items-center gap-1.5">
                    <span className="text-base sm:text-lg">🔑</span>
                    Joining Code
                  </h3>
                </div>
                
                {/* Compact Code Display */}
                <div className="flex items-center gap-2">
                  {isLoadingCode ? (
                    // Loading
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 border border-white/30 animate-pulse">
                        <div className="h-5 sm:h-6 w-20 sm:w-24 bg-white/30 rounded"></div>
                      </div>
                      <div className="bg-white/50 px-3 py-2 rounded-lg">
                        <div className="h-4 w-12 bg-white/30 rounded"></div>
                      </div>
                    </div>
                  ) : joiningCode ? (
                    // Code & Button
                    <>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 border border-white/30">
                        <p className="text-lg sm:text-xl font-bold tracking-wider font-mono">
                          {joiningCode}
                        </p>
                      </div>
                      
                      <button
                        onClick={handleCopyCode}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-medium text-sm whitespace-nowrap"
                      >
                        {copied ? (
                          <>
                            <FiCheck className="text-base sm:text-lg" />
                            <span className="hidden sm:inline">Copied</span>
                          </>
                        ) : (
                          <>
                            <FiCopy className="text-base sm:text-lg" />
                            <span className="hidden sm:inline">Copy</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    // No code
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 border border-white/30">
                      <p className="text-sm text-white/70 italic">Unavailable</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Members List */}
        {isMembersLoading ? (
          <div className="text-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-blue-600 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <FiUsers className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-medium">No members found</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {isAdmin ? "Add your first member to get started" : "This society has no members yet"}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Member Count */}
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {members.length} {members.length === 1 ? 'Member' : 'Members'}
              </p>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
          </div>
        )}

        {/* Add Member Modal */}
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
