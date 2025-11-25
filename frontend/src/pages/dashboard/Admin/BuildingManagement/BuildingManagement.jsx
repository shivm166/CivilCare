import React, { useState } from "react";
import { Building2, Loader2, Plus, Search } from "lucide-react";
import { useBuildings, useDeleteBuilding } from "../../../../hooks/api/useBuildings";
import BuildingCard from "../../../../components/features/building/BuildingCard";
import CreateBuildingModal from "../../../../components/features/building/CreateBuildingModal";
import PageLoader from "../../../error/PageLoader";

function BuildingManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading, error } = useBuildings();
  const { mutate: deleteBuilding, isPending: isDeleting } = useDeleteBuilding();

  const buildings = data?.building || [];

  // Filter buildings based on search
  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteBuilding = (buildingId) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      deleteBuilding(buildingId);
    }
  };

  if (isLoading) {
    return(
      <div className="h-full bg-white max-h-fit flex items-center justify-center z-50">
        <div className="text-centerflex flex h-full items-center justify-center">
          <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-blue-500 animate-spin mx-auto mb-4" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error.response?.data?.message || error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-indigo-600" />
            Building Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage buildings and units in your society
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Building
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Buildings</p>
              <p className="text-2xl font-bold text-gray-900">{buildings.length}</p>
            </div>
            <Building2 className="w-10 h-10 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">
                {buildings.reduce((sum, b) => sum + (b.unitCount || 0), 0)}
              </p>
            </div>
            <Building2 className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Floors</p>
              <p className="text-2xl font-bold text-gray-900">
                {buildings.reduce((sum, b) => sum + b.numberOfFloors, 0)}
              </p>
            </div>
            <Building2 className="w-10 h-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search buildings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Buildings Grid */}
      {filteredBuildings.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No buildings found" : "No buildings yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? "Try adjusting your search"
              : "Get started by adding your first building"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Building
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => (
            <BuildingCard
              key={building._id}
              building={building}
              onDelete={handleDeleteBuilding}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* Create Building Modal */}
      <CreateBuildingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default BuildingManagement;