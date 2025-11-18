import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Search, Home, Trash2 } from "lucide-react";
import { useBuildingById } from "../../../../hooks/api/useBuildings";
import { useDeleteUnit } from "../../../../hooks/api/useUnit";
import PageLoader from "../../../error/PageLoader";
import CreateUnitModal from "../../../../components/features/building/CreateUnitModal";

function BuildingUnitsPage() {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useBuildingById(buildingId);
  const { mutate: deleteUnit, isPending: isDeleting } = useDeleteUnit();

  const building = data?.building;
  const units = data?.units || [];

  // Filter units based on search
  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUnit = (unitId) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      deleteUnit(unitId);
    }
  };

  const handleViewUnit = (unitId) => {
    navigate(`/admin/buildings/${buildingId}/units/${unitId}`);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/admin/buildings")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Buildings
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Home className="w-8 h-8 text-indigo-600" />
              {building?.name} - Units
            </h1>
            <p className="text-gray-600 mt-1">
              Manage units in this building
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Unit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Units</p>
          <p className="text-2xl font-bold text-gray-900">{units.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Occupied</p>
          <p className="text-2xl font-bold text-green-600">
            {units.filter(u => u.type !== 'vacant').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Vacant</p>
          <p className="text-2xl font-bold text-gray-600">
            {units.filter(u => u.type === 'vacant').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Floors</p>
          <p className="text-2xl font-bold text-indigo-600">{building?.numberOfFloors}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Units Grid */}
      {filteredUnits.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No units found" : "No units yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? "Try adjusting your search"
              : "Get started by adding your first unit"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add Unit
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map((unit) => (
            <div
              key={unit._id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{unit.name}</h4>
                  <p className="text-sm text-gray-600">Floor {unit.floor}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                <div className="text-sm mb-2">
                  <span className="text-gray-600">Owner: </span>
                  <span className="text-gray-900">{unit.owner.name}</span>
                </div>
              )}

              {unit.primaryResident && (
                <div className="text-sm mb-3">
                  <span className="text-gray-600">Resident: </span>
                  <span className="text-gray-900">{unit.primaryResident.name}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewUnit(unit._id)}
                  className="flex-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Home className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteUnit(unit._id)}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Unit Modal */}
      <CreateUnitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        buildingId={buildingId}
        buildingMaxFloors={building?.numberOfFloors}
      />
    </div>
  );
}

export default BuildingUnitsPage;