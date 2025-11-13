import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Sparkles, ArrowRight } from "lucide-react";
import CreateSocietyModal from "./components/CreateSocietyModal";
import JoinSocietyModal from "./components/JoinSocietyModal"; // ⬅️ ADD THIS

const SocietyOnboarding = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false); // ⬅️ ADD THIS

  // ... (keep all your existing animation variants)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      y: -4,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const pillVariants = {
    hidden: { opacity: 0, scale: 0.8, x: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        className="max-w-3xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg"
            variants={iconVariants}
            animate="animate"
            {...floatVariants}
          >
            <Building2 className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight"
            variants={itemVariants}
          >
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              CivilCare
            </span>
          </motion.h1>

          <motion.p
            className="text-base text-gray-600 max-w-xl mx-auto"
            variants={itemVariants}
          >
            Streamline communication, manage complaints, and build a stronger
            community
          </motion.p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20"
          variants={itemVariants}
        >
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get Started
            </h2>
            <p className="text-sm text-gray-600">
              Choose how you'd like to join our community
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
            variants={containerVariants}
          >
            {/* Create Society Button */}
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="group relative bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg overflow-hidden"
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              {...buttonVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative flex flex-col items-center text-center">
                <motion.div
                  className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Building2 className="w-7 h-7" />
                </motion.div>
                <h3 className="text-xl font-bold mb-1">Create Society</h3>
                <p className="text-blue-100 text-sm mb-3">
                  Set up your society from scratch
                </p>
                <motion.div
                  className="flex items-center text-sm font-semibold"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </motion.div>
              </div>

              <motion.div
                className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full"
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>

            {/* Join Society Button - NOW FUNCTIONAL ⬅️ */}
            <motion.button
              onClick={() => setShowJoinModal(true)} // ⬅️ CHANGED FROM disabled
              className="group relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg overflow-hidden"
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              {...buttonVariants}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative flex flex-col items-center text-center">
                <motion.div
                  className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Users className="w-7 h-7" />
                </motion.div>
                <h3 className="text-xl font-bold mb-1">Join Society</h3>
                <p className="text-purple-100 text-sm mb-3">
                  Connect with existing community
                </p>
                <motion.div
                  className="flex items-center text-sm font-semibold"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </motion.div>
              </div>

              <motion.div
                className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full"
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
              variants={pillVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Easy Management
            </motion.div>
            <motion.div
              className="flex items-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium"
              variants={pillVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-4 h-4 mr-2" />
              Community First
            </motion.div>
            <motion.div
              className="flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium"
              variants={pillVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Digital Solution
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          className="text-center text-xs text-gray-500 mt-4"
          variants={itemVariants}
        >
          Need help? Contact our support team
        </motion.p>
      </motion.div>

      {/* Modals */}
      {showCreateModal && (
        <CreateSocietyModal onClose={() => setShowCreateModal(false)} />
      )}
      
      {/* ⬅️ ADD JOIN MODAL */}
      {showJoinModal && (
        <JoinSocietyModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  );
};

export default SocietyOnboarding;
