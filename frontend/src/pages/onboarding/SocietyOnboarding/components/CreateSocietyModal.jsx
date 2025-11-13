import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, MapPin, Mail, Loader2 } from "lucide-react";
import useCreateSociety from "../../../../hooks/api/useCreateSociety";

const CreateSocietyModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const { isPending, createSocietyMutation } = useCreateSociety();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Pincode validation
    if (!/^\d{6}$/.test(formData.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    createSocietyMutation(formData);
  };

  // Animation Variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const formItemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const headerIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
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
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                  variants={headerIconVariants}
                >
                  <Building2 className="w-6 h-6" />
                </motion.div>
                <motion.div variants={formItemVariants}>
                  <h2 className="text-2xl font-bold">Create Your Society</h2>
                  <p className="text-blue-100 text-sm">
                    Fill in the details below to get started
                  </p>
                </motion.div>
              </div>
              <motion.button
                onClick={onClose}
                disabled={isPending}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="p-6 space-y-6"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Society Name */}
            <motion.div variants={formItemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Society Name <span className="text-red-500">*</span>
              </label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter society name"
                  disabled={isPending}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </motion.div>
            </motion.div>

            {/* Address */}
            <motion.div variants={formItemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  disabled={isPending}
                  rows="3"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </motion.div>

            {/* City and State */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={formItemVariants}
            >
              <motion.div whileFocus={{ scale: 1.01 }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  disabled={isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.01 }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  disabled={isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </motion.div>
            </motion.div>

            {/* Pincode */}
            <motion.div variants={formItemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pincode <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter 6-digit pincode"
                  disabled={isPending}
                  maxLength="6"
                  pattern="\d{6}"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter a valid 6-digit pincode
              </p>
            </motion.div>

            {/* Info Box */}
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              variants={formItemVariants}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You will be assigned as the admin of this
                society and can manage all settings, members, and features.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 pt-4"
              variants={formItemVariants}
            >
              <motion.button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isPending}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Creating Society...
                  </>
                ) : (
                  "Create Society"
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateSocietyModal;
