import React, { useState, useMemo } from "react";
import { Car, Plus, Search, Edit2, Trash2, Building, User, Filter, X, MapPin } from "lucide-react";
import { useParkings, useDeleteParking } from "../../../../hooks/api/useParking";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import AllocateUnitParkingModal from "../../../../components/features/parking/AllocateUnitParkingModal";
import AllocateGeneralParkingModal from "../../../../components/features/parking/AllocateGeneralParkingModal";
import EditParkingModal from "../../../../components/features/parking/EditParkingModal";

const ParkingManagement = () => {
  const { currentSociety } = useSocietyContext();
  const [showUnitParkingModal, setShowUnitParkingModal] = useState(false);
  const [showGeneralParkingModal, setShowGeneralParkingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParking, setSelectedParking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState({});
  const [filters, setFilters] = useState({
    allocationType: "all",
    status: "all",
    parkingLevel: "all",
    vehicleType: "all",
  });

  const { data, isLoading } = useParkings();
  const { mutate: deleteParking } = useDeleteParking();

  const parkings = data?.parkings || [];

  const toggleCard = (parkingId) => {
    setExpandedCards(prev => ({
      ...prev,
      [parkingId]: !prev[parkingId]
    }));
  };

  // Apply filters and search
  const filteredParkings = useMemo(() => {
    let result = [...parkings];

    if (filters.allocationType !== "all") {
      result = result.filter((p) => p.allocationType === filters.allocationType);
    }

    if (filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters.parkingLevel !== "all") {
      result = result.filter((p) => p.parkingLevel === filters.parkingLevel);
    }

    if (filters.vehicleType !== "all") {
      result = result.filter((p) => p.vehicleType === filters.vehicleType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((parking) => {
        const parkingNumber = parking.parkingNumber?.toLowerCase() || "";
        const unitNumber = parking.unit?.unitNumber?.toLowerCase() || "";
        const unitName = parking.unit?.name?.toLowerCase() || "";
        const buildingName = parking.building?.name?.toLowerCase() || "";
        const memberName = parking.member?.name?.toLowerCase() || "";
        const vehicleNumber = parking.vehicleNumber?.toLowerCase() || "";

        return (
          parkingNumber.includes(query) ||
          unitNumber.includes(query) ||
          unitName.includes(query) ||
          buildingName.includes(query) ||
          memberName.includes(query) ||
          vehicleNumber.includes(query)
        );
      });
    }

    return result;
  }, [parkings, filters, searchQuery]);

  // Stats calculations
  const stats = useMemo(() => {
    return {
      total: parkings.length,
      unitBased: parkings.filter((p) => p.allocationType === "unit_based").length,
      general: parkings.filter((p) => p.allocationType === "general").length,
      active: parkings.filter((p) => p.status === "active").length,
    };
  }, [parkings]);

  const handleEdit = (parking) => {
    setSelectedParking(parking);
    setShowEditModal(true);
  };

  const handleDelete = (parkingId) => {
    if (window.confirm("Are you sure you want to delete this parking allocation?")) {
      deleteParking(parkingId);
    }
  };

  const clearFilters = () => {
    setFilters({
      allocationType: "all",
      status: "all",
      parkingLevel: "all",
      vehicleType: "all",
    });
    setSearchQuery("");
  };

  const hasActiveFilters =
    filters.allocationType !== "all" ||
    filters.status !== "all" ||
    filters.parkingLevel !== "all" ||
    filters.vehicleType !== "all" ||
    searchQuery.trim() !== "";

  const getParkingLevelLabel = (level) => {
    const labels = {
      basement_3: "Basement Level -3",
      basement_2: "Basement Level -2",
      basement_1: "Basement Level -1",
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading parkings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
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
                {currentSociety?.name}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowUnitParkingModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md text-sm sm:text-base sm:px-4"
              >
                <Building className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Unit Parking</span>
                <span className="font-medium sm:hidden">Unit</span>
              </button>

              <button
                onClick={() => setShowGeneralParkingModal(true)}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Total Parkings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Unit-Based</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unitBased}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">General</p>
                <p className="text-2xl font-bold text-gray-900">{stats.general}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parking, unit, member..."
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={filters.allocationType}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, allocationType: e.target.value }))
                }
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white hover:bg-gray-50 transition-colors"
              >
                <option value="all">All Types</option>
                <option value="unit_based">Unit-Based</option>
                <option value="general">General</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white hover:bg-gray-50 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={filters.parkingLevel}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, parkingLevel: e.target.value }))
                }
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
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, vehicleType: e.target.value }))
                }
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
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parking, unit, member..."
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filters.allocationType}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, allocationType: e.target.value }))
                }
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Types</option>
                <option value="unit_based">Unit-Based</option>
                <option value="general">General</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={filters.parkingLevel}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, parkingLevel: e.target.value }))
                }
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
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
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, vehicleType: e.target.value }))
                }
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
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
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-3 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredParkings.length}</span> of{" "}
          <span className="font-semibold text-gray-900">{parkings.length}</span> parkings
        </div>

        {/* Parkings List */}
        {filteredParkings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || hasActiveFilters ? "No parkings found" : "No parkings allocated yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || hasActiveFilters
                ? "Try adjusting your search or filters"
                : "Start by allocating parking spaces to units or members"}
            </p>
            {!searchQuery && !hasActiveFilters && (
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setShowUnitParkingModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Building className="w-4 h-4" />
                  Allocate Unit Parking
                </button>
                <button
                  onClick={() => setShowGeneralParkingModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Allocate General Parking
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredParkings.map((parking) => {
              const isExpanded = expandedCards[parking._id];
              
              return (
                <div
                  key={parking._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border-l-4"
                  style={{
                    borderLeftColor:
                      parking.allocationType === "unit_based"
                        ? "#3b82f6"
                        : "#a855f7",
                  }}
                >
                  <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex items-center justify-between gap-4">
                      {/* Left Side - Fixed Width Columns */}
                      <div className="flex-1 flex items-center gap-4">
                        {/* Column 1: Parking Number & Badges - Fixed Width */}
                        <div className="flex items-center gap-2 w-64 flex-shrink-0">
                          <h3 className="text-base font-bold text-gray-900">
                            {parking.parkingNumber}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded whitespace-nowrap ${
                              parking.allocationType === "unit_based"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {parking.allocationType === "unit_based" ? "Unit" : "General"}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded whitespace-nowrap ${
                              parking.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {parking.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>

                        {/* Column 2: Building/Member - Fixed Width */}
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
                              <span className="font-semibold text-gray-900 truncate">
                                {parking.member?.name}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Column 3: Vehicle Type - Fixed Width */}
                        <div className="flex items-center gap-1.5 text-sm w-32 flex-shrink-0">
                          <Car className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-700 truncate">{getVehicleTypeLabel(parking.vehicleType)}</span>
                        </div>

                        {/* Column 4: Vehicle Number - Fixed Width */}
                        <div className="w-36 flex-shrink-0">
                          {parking.vehicleNumber && (
                            <span className="font-mono font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs inline-block">
                              {parking.vehicleNumber}
                            </span>
                          )}
                        </div>

                        {/* Column 5: Location - Fixed Width */}
                        <div className="flex items-center gap-1.5 text-sm w-48 flex-shrink-0">
                          <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <span className="text-gray-700 truncate">{getParkingLevelLabel(parking.parkingLevel)}</span>
                        </div>
                      </div>

                      {/* Right Side - Action Buttons */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(parking)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(parking._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleCard(parking._id)}
                          className={`p-2 text-gray-400 hover:bg-gray-50 rounded transition-all ${isExpanded ? 'rotate-180' : ''}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        {/* Left: Parking Number & Badges */}
                        <div className="flex flex-col gap-1.5">
                          <h3 className="text-base font-bold text-gray-900">
                            {parking.parkingNumber}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 text-xs font-semibold rounded ${
                                parking.allocationType === "unit_based"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {parking.allocationType === "unit_based" ? "Unit" : "General"}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 text-xs font-semibold rounded ${
                                parking.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {parking.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>

                        {/* Right: Action Buttons */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => handleEdit(parking)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(parking._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleCard(parking._id)}
                            className={`p-1.5 text-gray-400 hover:bg-gray-50 rounded transition-all ${isExpanded ? 'rotate-180' : ''}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Mobile Info Grid */}
                      <div className="space-y-1.5 text-sm">
                        {/* Building/Member */}
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
                              <span className="font-semibold text-gray-900 text-xs">
                                {parking.member?.name}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Vehicle Type & Number */}
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

                        {/* Location */}
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                          <span className="text-gray-700 text-xs">{getParkingLevelLabel(parking.parkingLevel)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        {/* Remarks */}
                        {parking.remarks && (
                          <div className="flex items-start gap-2 text-xs sm:text-sm mb-2">
                            <span className="text-gray-500 font-medium whitespace-nowrap">Remarks:</span>
                            <span className="italic text-gray-600">"{parking.remarks}"</span>
                          </div>
                        )}

                        {/* Allocation Info */}
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
        )}
      </div>

      {/* Modals */}
      <AllocateUnitParkingModal
        isOpen={showUnitParkingModal}
        onClose={() => setShowUnitParkingModal(false)}
      />
      <AllocateGeneralParkingModal
        isOpen={showGeneralParkingModal}
        onClose={() => setShowGeneralParkingModal(false)}
      />
      <EditParkingModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedParking(null);
        }}
        parking={selectedParking}
      />
    </div>
  );
};

export default ParkingManagement;