import { useSocietyContext } from "../../../../contexts/SocietyContext.jsx";
import {
  useGetMyComplaints,
  useUpdateComplaintStatus,
  useGetAllComplaints,
} from "../../../../hooks/api/useComplaints.js";
import { Loader2, } from "lucide-react";
import React, { useState } from "react";
import {
  ComplaintsHeader,
  EmptyState,
  ComplaintTable,
} from "./Complaints/ComplaintTable.jsx";

export default function ComplaintsPage() {
  const { activeRole, activeSocietyId } = useSocietyContext();
  const isAdmin = activeRole === "admin";

  const [updatingId, setUpdatingId] = useState(null);
  const [updatingStatusKey, setUpdatingStatusKey] = useState(null);

  const { updateStatus, isUpdating: isHookUpdating } = useUpdateComplaintStatus(
    {
      onMutate: ({ id, status }) => {
        setUpdatingId(id);
        setUpdatingStatusKey(status);
      },
      onSettled: () => {
        setUpdatingId(null);
        setUpdatingStatusKey(null);
      },
    }
  );

  const handleUpdateStatus = async ({ id, status }) => {
    try {
      await updateStatus({ id, status });
    } catch (err) {
      console.log(err)
    }
  };

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
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
        <p className="mt-6 text-gray-600 font-medium">Loading complaints...</p>
      </div>
    );

  const updateState = {
    id: isHookUpdating ? updatingId : null,
    statusKey: isHookUpdating ? updatingStatusKey : null,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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

        <div>
          {!complaints || complaints.length === 0 ? (
            <EmptyState isAdmin={isAdmin} />
          ) : (
            <ComplaintTable
              complaints={complaints}
              isAdmin={isAdmin}
              onUpdateStatus={handleUpdateStatus}
              updating={updateState}
            />
          )}
        </div>
      </div>
    </div>
  );
}
