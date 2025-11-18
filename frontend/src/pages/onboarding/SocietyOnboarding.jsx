import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Sparkles, ArrowRight, Shield, Zap } from "lucide-react";
import CreateSocietyModal from "../../components/features/societyOnboarding/CreateSocietyModal";
import JoinSocietyModal from "../../components/features/societyOnboarding/JoinSocietyModal";


const SocietyOnboarding = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return (
    <div className="min-h-screen lg:h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-y-auto lg:overflow-hidden relative">
      {/* Compact Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-56 sm:w-72 lg:w-80 h-56 sm:h-72 lg:h-80 bg-blue-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Compact Hero */}
        <motion.div
          className="text-center mb-4 sm:mb-5 lg:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-2 sm:mb-3 shadow-xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              CivilCare
            </span>
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-xl mx-auto px-4">
            Modern society management made simple
          </p>
        </motion.div>

        {/* Compact Main Card */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-5 lg:px-6 py-3 sm:py-4 text-center border-b border-gray-200 rounded-t-2xl">
            <div className="w-full h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 absolute top-0 left-0" />
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
              Choose Your Path
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">Select the best option for you</p>
          </div>

          {/* Compact Action Cards */}
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
              {/* Create Society - Compact */}
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="group relative bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg overflow-hidden"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />

                <div className="relative flex flex-col items-center text-center">
                  <motion.div
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 8 }}
                  >
                    <Building2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                  </motion.div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1">
                    Create Society
                  </h3>
                  <p className="text-blue-100 text-xs sm:text-sm mb-2 sm:mb-3">
                    Set up your community
                  </p>
                  <motion.div
                    className="flex items-center text-xs sm:text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-full"
                    whileHover={{ x: 4 }}
                  >
                    Get Started
                    <ArrowRight className="ml-1.5 w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.div>
                </div>

                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              </motion.button>

              {/* Join Society - Compact */}
              <motion.button
                onClick={() => setShowJoinModal(true)}
                className="group relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg overflow-hidden"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />

                <div className="relative flex flex-col items-center text-center">
                  <motion.div
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: -8 }}
                  >
                    <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                  </motion.div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-1">
                    Join Society
                  </h3>
                  <p className="text-purple-100 text-xs sm:text-sm mb-2 sm:mb-3">
                    Connect with existing
                  </p>
                  <motion.div
                    className="flex items-center text-xs sm:text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-full"
                    whileHover={{ x: 4 }}
                  >
                    Get Started
                    <ArrowRight className="ml-1.5 w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.div>
                </div>

                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              </motion.button>
            </div>

            {/* Compact Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { icon: Sparkles, text: "Easy", color: "blue" },
                { icon: Zap, text: "Fast", color: "indigo" },
                { icon: Shield, text: "Secure", color: "purple" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className={`flex items-center bg-${feature.color}-50 text-${feature.color}-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-sm`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {feature.text}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Compact Footer */}
        <motion.p
          className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          💬 Need help? Contact support
        </motion.p>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateSocietyModal onClose={() => setShowCreateModal(false)} />
      )}
      {showJoinModal && (
        <JoinSocietyModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  );
};

export default SocietyOnboarding;
