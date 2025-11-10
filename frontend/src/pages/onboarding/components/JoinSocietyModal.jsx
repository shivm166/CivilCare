import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  Search,
  Loader2,
  MapPin,
  CheckCircle,
  Users,
} from "lucide-react";
import { useSearchSociety, useSendJoinRequest } from "../../../hooks/useJoinRequest";

const JoinSocietyModal = ({ onClose }) => {
  const [joiningCode, setJoiningCode] = useState(""); // ⬅️ CHANGED
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [message, setMessage] = useState("");

  const {
    data: searchResult,
    isLoading: isSearching,
    error: searchError,
  } = useSearchSociety(joiningCode, searchEnabled); // ⬅️ CHANGED

  const { sendRequest, isPending } = useSendJoinRequest(onClose);

  const handleSearch = (e) => {
    e.preventDefault();
    if (joiningCode.trim()) { // ⬅️ CHANGED
      setSearchEnabled(true);
    }
  };

  const handleSendRequest = () => {
    if (!searchResult?.society) return;

    sendRequest({
      societyId: searchResult.society._id,
      message: message || "",
    });
  };

  // Animation Variants (keep all as is)
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Join Society</h2>
                  <p className="text-indigo-100 text-sm">
                    Search and request to join an existing society
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                disabled={isPending}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Search Form */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Joining Code <span className="text-red-500">*</span> {/* ⬅️ CHANGED */}
              </label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={joiningCode} // ⬅️ CHANGED
                    onChange={(e) => {
                      setJoiningCode(e.target.value.toUpperCase()); // ⬅️ AUTO UPPERCASE
                      setSearchEnabled(false);
                    }}
                    placeholder="Enter Joining Code (e.g., ABC1234)" // ⬅️ CHANGED
                    disabled={isPending}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-gray-100 uppercase" // ⬅️ ADDED uppercase class
                    required
                    maxLength="7" // ⬅️ ADDED (3 letters + 4 numbers)
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={!joiningCode.trim() || isSearching || isPending} // ⬅️ CHANGED
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </motion.button>
              </form>
              <p className="text-xs text-gray-500 mt-1">
                Enter the unique 7-character joining code {/* ⬅️ CHANGED */}
              </p>
            </div>

            {/* Search Result */}
            <AnimatePresence mode="wait">
              {searchError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <p className="text-sm text-red-800">
                    Society not found. Please check the joining code and try again. {/* ⬅️ CHANGED */}
                  </p>
                </motion.div>
              )}

              {searchResult?.society && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {searchResult.society.name}
                        </h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      
                      {/* ⬅️ ADDED: Display Joining Code */}
                      <div className="mb-2">
                        <span className="inline-block bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Code: {searchResult.society.JoiningCode}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>{searchResult.society.address}</p>
                        </div>
                        <p className="ml-6">
                          {searchResult.society.city}, {searchResult.society.state}{" "}
                          - {searchResult.society.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add a message with your join request..."
                      disabled={isPending}
                      rows="3"
                      maxLength="500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none disabled:bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {message.length}/500 characters
                    </p>
                  </div>

                  {/* Send Request Button */}
                  <motion.button
                    onClick={handleSendRequest}
                    disabled={isPending}
                    className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                        Sending Request...
                      </>
                    ) : (
                      "Send Join Request"
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Box */}
            {!searchResult?.society && !searchError && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You need the Joining Code to join. Contact your
                  society admin to get the code. {/* ⬅️ CHANGED */}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JoinSocietyModal;
