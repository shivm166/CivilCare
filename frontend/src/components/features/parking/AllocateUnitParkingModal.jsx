import React, { useState, useEffect } from "react";
import { X, Car, Building, MapPin, Hash } from "lucide-react";
import { useAllocateUnitParking } from "../../../hooks/api/useParking";
import { useBuildings } from "../../../hooks/api/useBuildings";
import { getUnitsInBuilding } from "../../../api/services/unit.api";


const AllocateUnitParkingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    parkingNumber: "",
    buildingId: "",
    unitId: "",
    vehicleType: "two_wheeler",
    vehicleNumber: "",
    parkingLevel: "ground",
    remarks: "",
  });


  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);


  const { mutate: allocateParking, isPending } = useAllocateUnitParking();
  const { data: buildingsData, isLoading: loadingBuildings } = useBuildings();


  // ✅ FIX: Handle multiple possible response formats from building API
  const buildings = Array.isArray(buildingsData)
    ? buildingsData
    : buildingsData?.buildingWithUnitCount
    ? buildingsData.buildingWithUnitCount
    : buildingsData?.building
    ? buildingsData.building
    : buildingsData?.buildings
    ? buildingsData.buildings
    : [];


  // Fetch units when building is selected
  useEffect(() => {
    const fetchUnits = async () => {
      if (!formData.buildingId) {
        setUnits([]);
        return;
      }


      setLoadingUnits(true);
      try {
        const response = await getUnitsInBuilding(formData.buildingId);


        // ✅ FIX: Handle multiple possible response formats from unit API
        const unitsData = Array.isArray(response)
          ? response
          : response?.units
          ? response.units
          : response?.data?.units
          ? response.data.units
          : [];


        setUnits(unitsData);
      } catch (error) {
        console.error("Error fetching units:", error);
        setUnits([]);
      } finally {
        setLoadingUnits(false);
      }
    };


    fetchUnits();
  }, [formData.buildingId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset unit when building changes
      ...(name === "buildingId" && { unitId: "" }),
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();


    if (!formData.parkingNumber.trim()) {
      return;
    }


    if (!formData.unitId) {
      return;
    }


    allocateParking(
      {
        parkingNumber: formData.parkingNumber.trim(),
        unitId: formData.unitId,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber.trim(),
        parkingLevel: formData.parkingLevel,
        remarks: formData.remarks.trim(),
      },
      {
        onSuccess: () => {
          setFormData({
            parkingNumber: "",
            buildingId: "",
            unitId: "",
            vehicleType: "two_wheeler",
            vehicleNumber: "",
            parkingLevel: "ground",
            remarks: "",
          });
          onClose();
        },
      }
    );
  };


  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
              <Car className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold">Allocate Unit Parking</h2>
              <p className="text-xs sm:text-sm text-blue-100">
                Assign parking to a specific unit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>


        {/* ✅ FIXED: Removed excessive padding-bottom (was pb-24 sm:pb-28) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Parking Number */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Parking Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                name="parkingNumber"
                value={formData.parkingNumber}
                onChange={handleChange}
                placeholder="e.g., P-101, A-25"
                required
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>


          {/* Building Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Building <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              <select
                name="buildingId"
                value={formData.buildingId}
                onChange={handleChange}
                required
                disabled={loadingBuildings}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100"
              >
                <option value="">
                  {loadingBuildings ? "Loading buildings..." : "Select building"}
                </option>
                {buildings.map((building) => (
                  <option key={building._id} value={building._id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
          </div>


          {/* Unit Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              required
              disabled={!formData.buildingId || loadingUnits}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100"
            >
              <option value="">
                {!formData.buildingId
                  ? "Select building first"
                  : loadingUnits
                  ? "Loading units..."
                  : units.length === 0
                  ? "No units available"
                  : "Select unit"}
              </option>
              {units.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.name || unit.unitNumber || `Unit ${unit.floor}-${unit.type}`}
                </option>
              ))}
            </select>
          </div>


          {/* Vehicle Type */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Vehicle Type
            </label>
            <div className="relative">
              <Car className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="two_wheeler">Two Wheeler</option>
                <option value="four_wheeler">Four Wheeler</option>
                <option value="bicycle">Bicycle</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>


          {/* Vehicle Number */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Vehicle Number (Optional)
            </label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="e.g., GJ01AB1234"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            />
          </div>


          {/* Parking Level */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Parking Level
            </label>
            <div className="relative">
              <MapPin className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              <select
                name="parkingLevel"
                value={formData.parkingLevel}
                onChange={handleChange}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="basement_3">Basement -3</option>
                <option value="basement_2">Basement -2</option>
                <option value="basement_1">Basement -1</option>
                <option value="ground">Ground Floor</option>
                <option value="outside_society">Outside Society</option>
              </select>
            </div>
          </div>


          {/* Remarks */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Remarks (Optional)
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Any additional notes..."
              rows="3"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </form>


        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3 shadow-lg z-20">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isPending || !formData.unitId}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-600 text-white font-semibold rounded-lg transition-all  disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            {isPending ? "Allocating..." : "Allocate Parking"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default AllocateUnitParkingModal;
