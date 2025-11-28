import { useSocietyContext } from "../../../../contexts/SocietyContext.jsx";
import {
  useGetMyComplaints,
  useUpdateComplaintStatus,
  useGetAllComplaints,
} from "../../../../hooks/api/useComplaints.js";
import { Loader2 } from "lucide-react";

import {
  ComplaintsHeader,
  EmptyState,
  ComplaintTable,
} from "./Complaints/ComplaintTable.jsx";

export default function ComplaintsPage() {
  const { activeRole, activeSocietyId } = useSocietyContext();
  const isAdmin = activeRole === "admin";

  const { updateStatus, isUpdating } = useUpdateComplaintStatus();

  const { data: myComplaints, isLoading: isLoadingMy } = useGetMyComplaints(
    isAdmin ? null : activeSocietyId
  );

  const { data: allComplaints, isLoading: isLoadingAll } = useGetAllComplaints(
    isAdmin ? activeSocietyId : null
  );

  const isLoading = isAdmin ? isLoadingAll : isLoadingMy;
  const complaints = isAdmin ? allComplaints : myComplaints;

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
        <p className="mt-6 text-gray-600 font-medium animate-pulse">
          Loading complaints...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ComplaintsHeader
          title={isAdmin ? "Society Complaints" : "My Complaints"}
          subtitle={
            isAdmin
              ? `Manage and resolve all issues • ${
                  complaints?.length || 0
                } total`
              : `Track your submitted requests • ${
                  complaints?.length || 0
                } total`
          }
        />

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Empty State */}
          {!complaints || complaints.length === 0 ? (
            <EmptyState isAdmin={isAdmin} />
          ) : (
            <>
              {/* Table header (desktop) */}
              <div className="hidden md:grid md:grid-cols-[1fr_144px_96px_360px] text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-100 p-4 border-b border-gray-200">
                <div>Issue & Reporter</div>
                <div className="text-center">Status & Date</div>
                <div className="text-center">Priority</div>
                {isAdmin && <div>Admin Actions</div>}
              </div>

              {/* Complaints List */}
              <ComplaintTable
                complaints={complaints}
                isAdmin={isAdmin}
                onUpdateStatus={updateStatus}
                isUpdating={isUpdating}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
