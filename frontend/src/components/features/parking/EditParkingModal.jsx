import React, { useState, useEffect } from "react";
import { X, Car, MapPin } from "lucide-react";
import { useUpdateParking } from "../../../hooks/api/useParking";


const EditParkingModal = ({ isOpen, onClose, parking }) => {
  const [formData, setFormData] = useState({
    vehicleType: "two_wheeler",
    vehicleNumber: "",
    parkingLevel: "ground",
    status: "active",
    remarks: "",
  });


  const { mutate: updateParking, isPending } = useUpdateParking();


  useEffect(() => {
    if (parking) {
      setFormData({
        vehicleType: parking.vehicleType || "two_wheeler",
        vehicleNumber: parking.vehicleNumber || "",
        parkingLevel: parking.parkingLevel || "ground",
        status: parking.status || "active",
        remarks: parking.remarks || "",
      });
    }
  }, [parking]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();


    updateParking(
      {
        parkingId: parking._id,
        parkingData: formData,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };


  if (!isOpen || !parking) return null;


  return (
    // ✅ FIXED: Added backdrop blur and responsive padding
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4">
      {/* ✅ FIXED: Proper responsive modal with flex layout */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* ✅ FIXED: Sticky header with responsive padding */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
              <Car className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold">Edit Parking</h2>
              <p className="text-xs sm:text-sm text-green-100">
                Parking: {parking.parkingNumber}
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


        {/* ✅ FIXED: Removed excessive padding-bottom for proper spacing */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Parking Info (Read-only) */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Parking Number:
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {parking.parkingNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Allocation Type:
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">
                {parking.allocationType?.replace("_", " ")}
              </span>
            </div>
            {parking.allocationType === "unit_based" && (
              <>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    Building:
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {parking.building?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">Unit:</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {parking.unit?.unitNumber}
                  </span>
                </div>
              </>
            )}
            {parking.allocationType === "general" && (
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-600">Member:</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  {parking.member?.name}
                </span>
              </div>
            )}
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
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
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
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="e.g., GJ01AB1234"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
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
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="basement_3">Basement -3</option>
                <option value="basement_2">Basement -2</option>
                <option value="basement_1">Basement -1</option>
                <option value="ground">Ground Floor</option>
                <option value="outside_society">Outside Society</option>
              </select>
            </div>
          </div>


          {/* Status */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>


          {/* Remarks */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Any additional notes..."
              rows="3"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>
        </form>


        {/* ✅ FIXED: Sticky footer buttons with proper responsive styling */}
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
            disabled={isPending}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-10 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            {isPending ? "Updating..." : "Update Parking"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default EditParkingModal;
