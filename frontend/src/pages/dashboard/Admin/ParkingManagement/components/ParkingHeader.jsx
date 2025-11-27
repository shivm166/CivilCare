import React from "react";
import { Car, Building, User } from "lucide-react";

const ParkingHeader = ({ 
  societyName, 
  onUnitParkingClick, 
  onGeneralParkingClick 
}) => {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Car className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
              <span className="hidden sm:inline">Parking Management</span>
              <span className="sm:hidden">Parking</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
              {societyName}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onUnitParkingClick}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-sm sm:text-base sm:px-4"
            >
              <Building className="w-4 h-4" />
              <span className="font-medium hidden sm:inline">Unit Parking</span>
              <span className="font-medium sm:hidden">Unit</span>
            </button>

            <button
              onClick={onGeneralParkingClick}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md text-sm sm:text-base sm:px-4"
            >
              <User className="w-4 h-4" />
              <span className="font-medium hidden sm:inline">General Parking</span>
              <span className="font-medium sm:hidden">General</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingHeader;
