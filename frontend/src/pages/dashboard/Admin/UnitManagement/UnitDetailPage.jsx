import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Home, 
  ArrowLeft, 
  User, 
  Users, 
  Edit2, 
  Trash2,
  UserPlus,
  Building2
} from "lucide-react";
import EditUnitModal from "../../../../components/features/unit/EditUnitModal";
import PageLoader from "../../../error/PageLoader";
import { useDeleteUnit, useUnitById } from "../../../../hooks/api/useUnit";
import AssignResidentModal from "../../../../components/features/unit/AssignResidentModal";

function UnitDetailPage() {
  const { buildingId, unitId } = useParams();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Use your existing hooks
  const { data, isLoading, error } = useUnitById(unitId);
  const { mutate: deleteUnitMutation, isPending: isDeleting } = useDeleteUnit();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      deleteUnitMutation(unitId, {
        onSuccess: () => {
          navigate(`/admin/buildings/${buildingId}/units`);
        }
      });
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error loading unit: {error.message}
        </div>
      </div>
    );
  }

  const unit = data?.unit;
  const building = data?.building;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/admin/buildings/${buildingId}/units`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Units</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Home className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{unit?.name}</h1>
                  <p className="text-gray-600">{building?.name} - Floor {unit?.floor}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Unit Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Unit Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Unit Name</p>
                  <p className="font-medium text-gray-900">{unit?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Floor</p>
                  <p className="font-medium text-gray-900">Floor {unit?.floor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      unit?.type === "owner_occupied"
                        ? "bg-green-100 text-green-700"
                        : unit?.type === "tenant_occupied"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {unit?.type === "owner_occupied"
                      ? "Owner Occupied"
                      : unit?.type === "tenant_occupied"
                      ? "Tenant Occupied"
                      : "Vacant"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Building</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{building?.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resident Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resident Information
                </h2>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Assign Resident
                </button>
              </div>

              {unit?.owner || unit?.primaryResident ? (
                <div className="space-y-4">
                  {unit.owner && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Owner</p>
                        <p className="font-medium text-gray-900">{unit.owner.name}</p>
                        <p className="text-sm text-gray-600">{unit.owner.email}</p>
                        {unit.owner.phone && (
                          <p className="text-sm text-gray-600">{unit.owner.phone}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {unit.primaryResident && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Primary Resident</p>
                        <p className="font-medium text-gray-900">
                          {unit.primaryResident.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {unit.primaryResident.email}
                        </p>
                        {unit.primaryResident.phone && (
                          <p className="text-sm text-gray-600">
                            {unit.primaryResident.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 mb-4">No residents assigned yet</p>
                  <button
                    onClick={() => setIsAssignModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Assign First Resident
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      unit?.type === "vacant"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {unit?.type === "vacant" ? "Vacant" : "Occupied"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Occupancy Type</span>
                  <span className="font-medium text-gray-900">
                    {unit?.type === "owner_occupied"
                      ? "Owner"
                      : unit?.type === "tenant_occupied"
                      ? "Tenant"
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Assign Resident
                </button>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Unit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditUnitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        unit={unit}
        buildingMaxFloors={building?.numberOfFloors}
      />

      <AssignResidentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        unit={unit}
      />
    </div>
  );
}

export default UnitDetailPage;