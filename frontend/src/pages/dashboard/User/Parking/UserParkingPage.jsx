import React from "react";
import { Car, Building, MapPin, Calendar, AlertCircle } from "lucide-react";
import { useMyParking } from "../../../../hooks/api/useParking";
import { useSocietyContext } from "../../../../contexts/SocietyContext";

const UserParkingPage = () => {
  const { currentSociety } = useSocietyContext();
  const { data, isLoading } = useMyParking();

  const parkings = data?.parkings || [];

  const getParkingLevelLabel = (level) => {
    const labels = {
      basement_3: "Basement -3",
      basement_2: "Basement -2",
      basement_1: "Basement -1",
      ground: "Ground Floor",
      outside_society: "Outside Society",
    };
    return labels[level] || level;
  };

  const getVehicleTypeLabel = (type) => {
    const labels = {
      two_wheeler: "Two Wheeler",
      four_wheeler: "Four Wheeler",
      bicycle: "Bicycle",
      other: "Other",
    };
    return labels[type] || type;
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case "two_wheeler":
        return "🏍️";
      case "four_wheeler":
        return "🚗";
      case "bicycle":
        return "🚲";
      default:
        return "🚙";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading your parkings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header - Compact & Responsive */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                My Parking
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {currentSociety?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {parkings.length === 0 ? (
          /* Empty State - Compact */
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Car className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              No Parking Assigned
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              You don't have any parking space assigned yet. Please contact your
              society admin to allocate a parking space.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Summary - Compact & Responsive */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 lg:p-6 border-l-4 border-indigo-500">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                      Total
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {parkings.length}
                    </p>
                  </div>
                  <Car className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-indigo-600 hidden sm:block" />
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 lg:p-6 border-l-4 border-blue-500">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                      Unit
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {
                        parkings.filter((p) => p.allocationType === "unit_based")
                          .length
                      }
                    </p>
                  </div>
                  <Building className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-blue-600 hidden sm:block" />
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 lg:p-6 border-l-4 border-purple-500">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                      General
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {parkings.filter((p) => p.allocationType === "general").length}
                    </p>
                  </div>
                  <Car className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-purple-600 hidden sm:block" />
                </div>
              </div>
            </div>

            {/* Parkings Cards - Compact & Fully Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {parkings.map((parking) => (
                <div
                  key={parking._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Card Header - Compact */}
                  <div
                    className="p-4 sm:p-5 text-white"
                    style={{
                      background:
                        parking.allocationType === "unit_based"
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl sm:text-3xl flex-shrink-0">
                            {getVehicleIcon(parking.vehicleType)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold truncate">
                              {parking.parkingNumber}
                            </h3>
                            <p className="text-xs sm:text-sm opacity-90 truncate">
                              {getVehicleTypeLabel(parking.vehicleType)}
                            </p>
                          </div>
                        </div>
                        {parking.vehicleNumber && (
                          <div className="inline-block bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                            <p className="text-xs sm:text-sm font-mono font-semibold">
                              {parking.vehicleNumber}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap ${
                            parking.allocationType === "unit_based"
                              ? "bg-blue-500/30 backdrop-blur-sm"
                              : "bg-pink-500/30 backdrop-blur-sm"
                          }`}
                        >
                          {parking.allocationType === "unit_based"
                            ? "Unit"
                            : "General"}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-green-500/30 backdrop-blur-sm whitespace-nowrap">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body - Compact */}
                  <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                    {/* Location Details */}
                    {parking.allocationType === "unit_based" ? (
                      <div className="space-y-2 sm:space-y-2.5">
                        <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-blue-50 rounded-lg">
                          <Building className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] sm:text-xs text-gray-600 font-medium">
                              Building
                            </p>
                            <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                              {parking.building?.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-indigo-50 rounded-lg">
                          <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0 text-sm">
                            #
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] sm:text-xs text-gray-600 font-medium">
                              Unit
                            </p>
                            <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                              {parking.unit?.name || parking.unit?.unitNumber || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-purple-50 rounded-lg">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs text-gray-600 font-medium">
                            Allocation Type
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-gray-900">
                            General Parking
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Parking Level */}
                    <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-green-50 rounded-lg">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-gray-600 font-medium">
                          Parking Level
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                          {getParkingLevelLabel(parking.parkingLevel)}
                        </p>
                      </div>
                    </div>

                    {/* Remarks */}
                    {parking.remarks && (
                      <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                        <p className="text-[10px] sm:text-xs text-gray-600 font-medium mb-1">
                          Remarks
                        </p>
                        <p className="text-xs sm:text-sm text-gray-900 italic line-clamp-2">
                          "{parking.remarks}"
                        </p>
                      </div>
                    )}

                    {/* Allocated Info */}
                    <div className="pt-2.5 border-t border-gray-200">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">
                          Allocated on{" "}
                          {new Date(parking.allocatedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserParkingPage;
