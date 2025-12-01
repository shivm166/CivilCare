import React, { useState, useMemo } from "react";
import { useParkings, useDeleteParking } from "../../../../hooks/api/useParking";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import AllocateUnitParkingModal from "../../../../components/features/parking/AllocateUnitParkingModal";
import AllocateGeneralParkingModal from "../../../../components/features/parking/AllocateGeneralParkingModal";
import EditParkingModal from "../../../../components/features/parking/EditParkingModal";
import ParkingHeader from "./components/ParkingHeader";
import ParkingStatsAndFilters from "./components/ParkingStatsAndFilters";
import ParkingListCard from "./components/ParkingListCard";

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
    setExpandedCards(prev => ({ ...prev, [parkingId]: !prev[parkingId] }));
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

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
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
      <ParkingHeader
        societyName={currentSociety?.name}
        onUnitParkingClick={() => setShowUnitParkingModal(true)}
        onGeneralParkingClick={() => setShowGeneralParkingModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ParkingStatsAndFilters
          stats={stats}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={handleFilterChange}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {/* Results Count */}
        <div className="mb-3 text-xs sm:text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredParkings.length}</span> of{" "}
          <span className="font-semibold text-gray-900">{parkings.length}</span> parkings
        </div>

        <ParkingListCard
          parkings={filteredParkings}
          expandedCards={expandedCards}
          onToggleCard={toggleCard}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getVehicleTypeLabel={getVehicleTypeLabel}
          getParkingLevelLabel={getParkingLevelLabel}
          hasSearch={hasActiveFilters}
          onUnitParkingClick={() => setShowUnitParkingModal(true)}
          onGeneralParkingClick={() => setShowGeneralParkingModal(true)}
        />
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
