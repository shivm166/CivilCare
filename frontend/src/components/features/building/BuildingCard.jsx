import React from "react";
import { Building2, Layers, Eye, Trash2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BuildingCard({ building, onDelete, isDeleting }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {building.name}
              </h3>
              {building.description && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                  {building.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Floors</span>
          </div>
          <span className="font-semibold text-gray-900">
            {building.numberOfFloors}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Units</span>
          </div>
          <span className="font-semibold text-gray-900">
            {building.unitCount || 0}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 sm:p-4 bg-gray-50 rounded-b-lg flex gap-2">
        <button
          onClick={() => navigate(`/admin/buildings/${building._id}/units`)}
          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">View Units</span>
          <span className="xs:hidden">Units</span>
        </button>
        <button
          onClick={() => onDelete(building._id)}
          disabled={isDeleting || building.unitCount > 0}
          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            building.unitCount > 0
              ? "Cannot delete building with units"
              : "Delete building"
          }
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}

export default BuildingCard;