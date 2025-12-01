import React from "react";
import { Edit2, Trash2, Building, User, Car, MapPin } from "lucide-react";

const ParkingListCard = ({ 
  parkings, 
  expandedCards, 
  onToggleCard, 
  onEdit, 
  onDelete,
  getVehicleTypeLabel,
  getParkingLevelLabel,
  hasSearch,
  onUnitParkingClick,
  onGeneralParkingClick
}) => {
  if (parkings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {hasSearch ? "No parkings found" : "No parkings allocated yet"}
        </h3>
        <p className="text-gray-600 mb-6">
          {hasSearch
            ? "Try adjusting your search or filters"
            : "Start by allocating parking spaces to units or members"}
        </p>
        {!hasSearch && (
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={onUnitParkingClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Building className="w-4 h-4" />
              Allocate Unit Parking
            </button>
            <button
              onClick={onGeneralParkingClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <User className="w-4 h-4" />
              Allocate General Parking
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {parkings.map((parking) => {
        const isExpanded = expandedCards[parking._id];
        
        return (
          <div
            key={parking._id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border-l-4"
            style={{
              borderLeftColor: parking.allocationType === "unit_based" ? "#3b82f6" : "#a855f7",
            }}
          >
            <div className="px-3 py-2.5 sm:px-4 sm:py-3">
              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex items-center gap-2 w-64 flex-shrink-0">
                    <h3 className="text-base font-bold text-gray-900">{parking.parkingNumber}</h3>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded whitespace-nowrap ${
                      parking.allocationType === "unit_based" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}>
                      {parking.allocationType === "unit_based" ? "Unit" : "General"}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded whitespace-nowrap ${
                      parking.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {parking.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm w-56 flex-shrink-0">
                    {parking.allocationType === "unit_based" ? (
                      <>
                        <Building className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-gray-600 truncate">{parking.building?.name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-semibold text-gray-900 truncate">
                          {parking.unit?.name || parking.unit?.unitNumber}
                        </span>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span className="font-semibold text-gray-900 truncate">{parking.member?.name}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-sm w-32 flex-shrink-0">
                    <Car className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 truncate">{getVehicleTypeLabel(parking.vehicleType)}</span>
                  </div>

                  <div className="w-36 flex-shrink-0">
                    {parking.vehicleNumber && (
                      <span className="font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs inline-block">
                        {parking.vehicleNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-sm w-48 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="text-gray-700 truncate">{getParkingLevelLabel(parking.parkingLevel)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => onEdit(parking)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(parking._id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onToggleCard(parking._id)} className={`p-2 text-gray-400 hover:bg-gray-50 rounded transition-all ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-bold text-gray-900">{parking.parkingNumber}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 text-xs font-semibold rounded ${
                        parking.allocationType === "unit_based" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {parking.allocationType === "unit_based" ? "Unit" : "General"}
                      </span>
                      <span className={`px-1.5 py-0.5 text-xs font-semibold rounded ${
                        parking.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {parking.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button onClick={() => onEdit(parking)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(parking._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onToggleCard(parking._id)} className={`p-1.5 text-gray-400 hover:bg-gray-50 rounded transition-all ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-1.5">
                    {parking.allocationType === "unit_based" ? (
                      <>
                        <Building className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="text-gray-600 text-xs">{parking.building?.name}</span>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="font-semibold text-gray-900 text-xs">
                          {parking.unit?.name || parking.unit?.unitNumber}
                        </span>
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                        <span className="font-semibold text-gray-900 text-xs">{parking.member?.name}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 text-xs">{getVehicleTypeLabel(parking.vehicleType)}</span>
                    {parking.vehicleNumber && (
                      <>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="font-mono font-semibold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                          {parking.vehicleNumber}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="text-gray-700 text-xs">{getParkingLevelLabel(parking.parkingLevel)}</span>
                  </div>
                </div>
              </div>

              {/* Expandable Details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  {parking.remarks && (
                    <div className="flex items-start gap-2 text-xs sm:text-sm mb-2">
                      <span className="text-gray-500 font-medium whitespace-nowrap">Remarks:</span>
                      <span className="italic text-gray-600">"{parking.remarks}"</span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-gray-500">
                    <span>
                      Allocated by <span className="font-semibold text-gray-700">{parking.allocatedBy?.name}</span>
                    </span>
                    <span className="text-gray-600">
                      {new Date(parking.allocatedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ParkingListCard;
