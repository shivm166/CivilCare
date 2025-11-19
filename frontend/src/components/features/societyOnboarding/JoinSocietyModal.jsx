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
  Hash,
  AlertCircle,
} from "lucide-react";
import { useSearchSociety, useSendJoinRequest } from "../../../hooks/api/useJoinRequest";

const JoinSocietyModal = ({ onClose }) => {
  const [joiningCode, setJoiningCode] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [message, setMessage] = useState("");

  const {
    data: searchResult,
    isLoading: isSearching,
    error: searchError,
  } = useSearchSociety(joiningCode, searchEnabled);

  const { sendRequest, isPending } = useSendJoinRequest(onClose);

  const handleSearch = (e) => {
    e.preventDefault();
    if (joiningCode.trim()) {
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

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 sm:px-6 py-5 sm:py-6">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <motion.div
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                    Join Society
                  </h2>
                  <p className="text-purple-100 text-xs sm:text-sm truncate">
                    Enter code to join
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                disabled={isPending}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50 flex-shrink-0 ml-2"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
              {/* Search Form */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Joining Code <span className="text-red-500">*</span>
                </label>
                <form onSubmit={handleSearch} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        value={joiningCode}
                        onChange={(e) => {
                          setJoiningCode(e.target.value.toUpperCase());
                          setSearchEnabled(false);
                        }}
                        placeholder="ABC1234"
                        disabled={isPending}
                        className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:bg-gray-100 uppercase font-mono font-semibold tracking-wider outline-none"
                        required
                        maxLength="7"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={!joiningCode.trim() || isSearching || isPending}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">Search</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter 7-character code (e.g., ABC1234)
                  </p>
                </form>
              </div>

              {/* Search Results */}
              <AnimatePresence mode="wait">
                {/* Error State */}
                {searchError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">
                          Society Not Found
                        </p>
                        <p className="text-xs sm:text-sm text-red-700 mt-1">
                          Please check the joining code and try again.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Success State */}
                {searchResult?.society && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-2xl overflow-hidden"
                  >
                    {/* Society Info Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-5 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-white truncate">
                            {searchResult.society.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              <Hash className="w-3 h-3" />
                              {searchResult.society.JoiningCode}
                            </span>
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Society Details */}
                    <div className="p-4 sm:p-5 space-y-4">
                      <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-200">
                        <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="break-words">{searchResult.society.address}</p>
                            <p className="mt-1 font-medium">
                              {searchResult.society.city}, {searchResult.society.state} - {searchResult.society.pincode}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Message Input */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Introduce yourself or add a note..."
                          disabled={isPending}
                          rows="3"
                          maxLength="500"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none disabled:bg-gray-100 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {message.length}/500 characters
                        </p>
                      </div>

                      {/* Send Request Button */}
                      <motion.button
                        onClick={handleSendRequest}
                        disabled={isPending}
                        className="w-full px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Send Join Request</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info Box */}
              {!searchResult?.society && !searchError && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">🔑</span>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">
                        Need a Joining Code?
                      </p>
                      <p className="text-xs text-blue-700">
                        Contact your society admin to get the unique 7-character joining code.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JoinSocietyModal;
