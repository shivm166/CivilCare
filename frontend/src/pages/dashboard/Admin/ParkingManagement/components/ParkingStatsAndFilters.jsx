import React from "react";
import { Car, Building, User, Search, X } from "lucide-react";

const ParkingStatsAndFilters = ({ 
  stats, 
  searchQuery, 
  onSearchChange,
  filters, 
  onFilterChange, 
  hasActiveFilters, 
  onClearFilters 
}) => {
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="bg-white rounded-lg shadow-md p-3 lg:p-4 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-600 font-medium mb-0.5 lg:mb-1">Total Parkings</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 lg:p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-600 font-medium mb-0.5 lg:mb-1">Unit-Based</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.unitBased}</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 lg:p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-600 font-medium mb-0.5 lg:mb-1">General</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.general}</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 lg:p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-600 font-medium mb-0.5 lg:mb-1">Active</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-3 lg:p-4 mb-4">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search parking, unit, member..."
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filters.allocationType}
              onChange={(e) => onFilterChange("allocationType", e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white hover:bg-gray-50 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="unit_based">Unit-Based</option>
              <option value="general">General</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white hover:bg-gray-50 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={filters.parkingLevel}
              onChange={(e) => onFilterChange("parkingLevel", e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white hover:bg-gray-50 transition-colors"
            >
              <option value="all">All Levels</option>
              <option value="basement_3">B-3</option>
              <option value="basement_2">B-2</option>
              <option value="basement_1">B-1</option>
              <option value="ground">Ground</option>
              <option value="outside_society">Outside</option>
            </select>

            <select
              value={filters.vehicleType}
              onChange={(e) => onFilterChange("vehicleType", e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white hover:bg-gray-50 transition-colors"
            >
              <option value="all">All Vehicles</option>
              <option value="two_wheeler">2W</option>
              <option value="four_wheeler">4W</option>
              <option value="bicycle">Bicycle</option>
              <option value="other">Other</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-2.5">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search parking, unit, member..."
              className="w-full pl-9 pr-2.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={filters.allocationType}
              onChange={(e) => onFilterChange("allocationType", e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs bg-white"
            >
              <option value="all">All Types</option>
              <option value="unit_based">Unit-Based</option>
              <option value="general">General</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={filters.parkingLevel}
              onChange={(e) => onFilterChange("parkingLevel", e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs bg-white"
            >
              <option value="all">All Levels</option>
              <option value="basement_3">B-3</option>
              <option value="basement_2">B-2</option>
              <option value="basement_1">B-1</option>
              <option value="ground">Ground</option>
              <option value="outside_society">Outside</option>
            </select>

            <select
              value={filters.vehicleType}
              onChange={(e) => onFilterChange("vehicleType", e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs bg-white"
            >
              <option value="all">All Vehicles</option>
              <option value="two_wheeler">2W</option>
              <option value="four_wheeler">4W</option>
              <option value="bicycle">Bicycle</option>
              <option value="other">Other</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium border border-red-200"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ParkingStatsAndFilters;
