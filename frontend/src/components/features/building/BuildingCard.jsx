import React from "react";
import { Building2, Layers, Eye, Trash2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add this import

function BuildingCard({ building, onDelete, isDeleting }) {
  const navigate = useNavigate(); // Add this hook

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {building.name}
              </h3>
              {building.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {building.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Layers className="w-4 h-4" />
            <span>Floors</span>
          </div>
          <span className="font-semibold text-gray-900">
            {building.numberOfFloors}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Home className="w-4 h-4" />
            <span>Units</span>
          </div>
          <span className="font-semibold text-gray-900">
            {building.unitCount || 0}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 rounded-b-lg flex gap-2">
        {/* CHANGED: View Units button instead of View Details */}
        <button
          onClick={() => navigate(`/admin/buildings/${building._id}/units`)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Units
        </button>
        <button
          onClick={() => onDelete(building._id)}
          disabled={isDeleting || building.unitCount > 0}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            building.unitCount > 0
              ? "Cannot delete building with units"
              : "Delete building"
          }
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default BuildingCard;