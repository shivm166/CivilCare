import React, { useState } from "react";
import { X, Plus, Edit2, Trash2, Users, Home, Layers } from "lucide-react";
import {
  useBuildingById,
  useUpdateBuilding,
} from "../../../hooks/api/useBuildings";
import AssignResidentModal from "./AssignResidentModal";
import CreateUnitModal from "./CreateUnitModal";
import { useDeleteUnit } from "../../../hooks/api/useUnit";

function BuildingDetailModal({ isOpen, onClose, buildingId }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isCreateUnitModalOpen, setIsCreateUnitModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null); 
  const [isAssignResidentModalOpen, setIsAssignResidentModalOpen] = useState(false);

  const { data, isLoading } = useBuildingById(buildingId);
  const { mutate: updateBuilding, isPending: isUpdating } = useUpdateBuilding();
  const { mutate: deleteUnit, isPending: isDeleting } = useDeleteUnit();

  const building = data?.building;
  const units = data?.units || [];

  const handleEditClick = () => {
    setEditFormData({
      name: building.name,
      numberOfFloors: building.numberOfFloors,
      description: building.description || "",
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({});
  };

  const handleSaveEdit = () => {
    updateBuilding(
      {
        buildingId: building._id,
        data: editFormData,
      },
      {
        onSuccess: () => {
          setIsEditMode(false);
          setEditFormData({});
        },
      }
    );
  };

  const handleDeleteUnit = (unitId) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      deleteUnit(unitId);
    }
  };

  const handleAssignResident = (unit) => {
    setSelectedUnit(unit);
    setIsAssignResidentModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-400/75 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-4 sm:my-8 max-h-[95vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-indigo-600" />
              <span className="hidden sm:inline">Building Details</span>
              <span className="sm:hidden">Details</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-sm sm:text-base">Loading building details...</p>
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
              {/* Building Info */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Building Information
                  </h3>
                  {!isEditMode && (
                    <button
                      onClick={handleEditClick}
                      className="flex items-center justify-center sm:justify-start gap-2 px-3 py-1.5 text-xs sm:text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors w-full sm:w-auto"
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Edit
                    </button>
                  )}
                </div>

                {isEditMode ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Building Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Number of Floors
                      </label>
                      <input
                        type="number"
                        value={editFormData.numberOfFloors}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            numberOfFloors: parseInt(e.target.value),
                          }))
                        }
                        min="1"
                        max="200"
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editFormData.description}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows="3"
                        className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isUpdating}
                        className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Home className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600">Name</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{building.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Number of Floors</p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                          {building.numberOfFloors}
                        </p>
                      </div>
                    </div>
                    {building.description && (
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-600">Description</p>
                          <p className="text-gray-900 text-sm sm:text-base wrap-break-words">{building.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Units Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Units ({units.length})
                  </h3>
                  <button
                    onClick={() => setIsCreateUnitModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Add Unit
                  </button>
                </div>

                {units.length === 0 ? (
                  <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center">
                    <Home className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">No units in this building yet</p>
                    <button
                      onClick={() => setIsCreateUnitModalOpen(true)}
                      className="px-4 py-2 text-sm sm:text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Add First Unit
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {units.map((unit) => (
                      <div
                        key={unit._id}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3 gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {unit.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Floor {unit.floor}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap shrink-0 ${
                              unit.type === "owner_occupied"
                                ? "bg-green-100 text-green-700"
                                : unit.type === "tenant_occupied"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {unit.type === "owner_occupied"
                              ? "Owner"
                              : unit.type === "tenant_occupied"
                              ? "Tenant"
                              : "Vacant"}
                          </span>
                        </div>

                        {unit.owner && (
                          <div className="text-xs sm:text-sm mb-2">
                            <span className="text-gray-600">Owner: </span>
                            <span className="text-gray-900 truncate">{unit.owner.name}</span>
                          </div>
                        )}

                        {unit.primaryResident && (
                          <div className="text-xs sm:text-sm mb-3">
                            <span className="text-gray-600">Resident: </span>
                            <span className="text-gray-900 truncate">
                              {unit.primaryResident.name}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAssignResident(unit)}
                            className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                          >
                            Assign Resident
                          </button>
                          <button
                            onClick={() => handleDeleteUnit(unit._id)}
                            disabled={isDeleting}
                            className="px-3 py-1.5 text-xs sm:text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors disabled:opacity-50 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Unit Modal */}
      <CreateUnitModal
        isOpen={isCreateUnitModalOpen}
        onClose={() => setIsCreateUnitModalOpen(false)}
        buildingId={buildingId}
        maxFloors={building?.numberOfFloors}
      /> 

      {/* Assign Resident Modal */}
      {selectedUnit && (
        <AssignResidentModal
          isOpen={isAssignResidentModalOpen}
          onClose={() => {
            setIsAssignResidentModalOpen(false);
            setSelectedUnit(null);
          }}
          unit={selectedUnit}
        />
      )}
    </>
  );
}

export default BuildingDetailModal;