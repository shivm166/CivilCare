import React, { useState } from "react";
import { X, Car, User, Search, MapPin, Hash } from "lucide-react";
import { useAllocateGeneralParking } from "../../../hooks/api/useParking";
import { useMembers } from "../../../hooks/api/useMembers";
import { useSocietyContext } from "../../../contexts/SocietyContext";


const AllocateGeneralParkingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    parkingNumber: "",
    memberId: "",
    vehicleType: "two_wheeler",
    vehicleNumber: "",
    parkingLevel: "ground",
    remarks: "",
  });


  const [searchQuery, setSearchQuery] = useState("");


  const { activeSocietyId } = useSocietyContext();
  const { mutate: allocateParking, isPending } = useAllocateGeneralParking();
  const { members, isMembersLoading: loadingMembers } = useMembers(activeSocietyId);


  const membersList = members || [];


  const filteredMembers = membersList.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.user?.name?.toLowerCase().includes(searchLower) ||
      member.user?.email?.toLowerCase().includes(searchLower) ||
      member.user?.phone?.includes(searchQuery)
    );
  });


  const selectedMember = membersList.find((m) => m.user?._id === formData.memberId);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleMemberSelect = (memberId) => {
    setFormData((prev) => ({ ...prev, memberId }));
    setSearchQuery("");
  };


  const handleSubmit = (e) => {
    e.preventDefault();


    if (!formData.parkingNumber.trim() || !formData.memberId) {
      return;
    }


    allocateParking(
      {
        parkingNumber: formData.parkingNumber.trim(),
        memberId: formData.memberId,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber.trim(),
        parkingLevel: formData.parkingLevel,
        remarks: formData.remarks.trim(),
      },
      {
        onSuccess: () => {
          setFormData({
            parkingNumber: "",
            memberId: "",
            vehicleType: "two_wheeler",
            vehicleNumber: "",
            parkingLevel: "ground",
            remarks: "",
          });
          setSearchQuery("");
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
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
              <Car className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold">Allocate General Parking</h2>
              <p className="text-xs sm:text-sm text-purple-100">
                Assign parking to a society member
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


        {/* ✅ FIXED: Removed excessive padding-bottom */}
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
                placeholder="e.g., G-101, V-25"
                required
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>


          {/* Member Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Select Member <span className="text-red-500">*</span>
            </label>


            {/* Search Input */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>


            {/* Selected Member Display */}
            {selectedMember && !searchQuery && (
              <div className="p-2.5 sm:p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm sm:text-base">
                    {selectedMember.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {selectedMember.user?.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[180px] sm:max-w-none">
                      {selectedMember.user?.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, memberId: "" }))}
                  className="text-red-500 hover:text-red-700 font-medium text-xs sm:text-sm whitespace-nowrap ml-2"
                >
                  Change
                </button>
              </div>
            )}


            {/* Member Dropdown */}
            {searchQuery && (
              <div className="border border-gray-300 rounded-lg max-h-40 sm:max-h-48 overflow-y-auto">
                {loadingMembers ? (
                  <div className="p-3 sm:p-4 text-center text-gray-500 text-sm">
                    Loading members...
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="p-3 sm:p-4 text-center text-gray-500 text-sm">
                    No members found
                  </div>
                ) : (
                  filteredMembers.map((member) => (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() => handleMemberSelect(member.user?._id)}
                      className="w-full p-2.5 sm:p-3 hover:bg-purple-50 transition-colors flex items-center gap-2 sm:gap-3 border-b last:border-b-0 text-left"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm sm:text-base flex-shrink-0">
                        {member.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {member.user?.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {member.user?.email}
                        </p>
                        {member.user?.phone && (
                          <p className="text-xs text-gray-500">
                            {member.user?.phone}
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}


            {!selectedMember && !searchQuery && (
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Search and select a member to assign parking
              </p>
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
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
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
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
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
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
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
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </form>


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
            disabled={isPending || !formData.memberId}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#f43f5e] hover:from-[#7e22ce] hover:via-[#db2777] hover:to-[#e11d48] text-white font-bold rounded-lg transition-all  disabled:cursor-not-allowed shadow-lg hover:shadow-2xl active:scale-[0.98]"
          >
            {isPending ? "Allocating..." : "Allocate Parking"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default AllocateGeneralParkingModal;
