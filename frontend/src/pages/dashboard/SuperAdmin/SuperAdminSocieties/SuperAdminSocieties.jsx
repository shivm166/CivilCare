import React, { useState } from "react";
import { Edit, Trash2, Building2, Users, Home } from "lucide-react";
import { useSocieties, useDeleteSociety } from "../../../../hooks/api/useSuperAdmin";
import PageLoader from "../../../error/PageLoader";
import EditSocietyModal from "../../../../components/features/superAdmin/EditSocietyModal";

function SocietyCard({ society, onEdit, onDelete, isDeleting }) {
  return (
    <div className="relative card bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="absolute right-2 top-2 sm:right-3 sm:top-3 flex space-x-1 sm:space-x-2">
        <button
          onClick={() => onEdit(society)}
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit society"
        >
          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
        </button>
        <button
          onClick={() => onDelete(society._id)}
          disabled={isDeleting || (society.buildingCount > 0 || society.unitCount > 0)}
          className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            society.buildingCount > 0 || society.unitCount > 0
              ? "Cannot delete society with buildings/units"
              : "Delete society"
          }
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
        </button>
      </div>

      <div className="mb-3 pr-16 sm:pr-20">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg shrink-0">
            <Building2 className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">{society.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{society.address}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-600">City:</span>
          <span className="text-gray-900 truncate ml-2">{society.city || "-"}</span>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-600">State:</span>
          <span className="text-gray-900 truncate ml-2">{society.state || "-"}</span>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-600">Pincode:</span>
          <span className="text-gray-900">{society.pincode || "-"}</span>
        </div>

        <div className="pt-2 border-t border-gray-100 space-y-1">
          {society.memberCount !== undefined && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                Members:
              </span>
              <span className="font-medium text-gray-900">{society.memberCount}</span>
            </div>
          )}
          {society.buildingCount !== undefined && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                Buildings:
              </span>
              <span className="font-medium text-gray-900">{society.buildingCount}</span>
            </div>
          )}
          {society.unitCount !== undefined && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                Units:
              </span>
              <span className="font-medium text-gray-900">{society.unitCount}</span>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 space-y-0.5">
          <div className="truncate">
            <strong>Code:</strong> {society.JoiningCode}
          </div>
          <div>
            Created: {society.createdAt && new Date(society.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function SuperAdminSocieties() {
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading, isError } = useSocieties();
  const { mutate: deleteSociety, isPending: isDeleting } = useDeleteSociety();

  const societies = Array.isArray(data?.societies) ? data.societies : [];

  const handleEdit = (society) => {
    setSelectedSociety(society);
    setIsEditModalOpen(true);
  };

  const handleDelete = (societyId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this society? This action cannot be undone."
      )
    ) {
      deleteSociety(societyId);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedSociety(null);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Society Management</h1>
        <p className="text-xs sm:text-base text-gray-600 mt-1">
          Manage all societies across the platform
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">Total Societies</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{societies.length}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">Total Buildings</p>
          <p className="text-xl sm:text-2xl font-bold text-indigo-600">
            {societies.reduce((sum, s) => sum + (s.buildingCount || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">Total Members</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {societies.reduce((sum, s) => sum + (s.memberCount || 0), 0)}
          </p>
        </div>
      </div>

      {isError ? (
        <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
          Failed to load societies. Please try again.
        </div>
      ) : societies.length === 0 ? (
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600">No societies found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {societies.map((society) => (
            <SocietyCard
              key={society._id}
              society={society}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      <EditSocietyModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        society={selectedSociety}
      />
    </div>
  );
}

export default SuperAdminSocieties;