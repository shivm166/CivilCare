import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  User,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Container from "../../components/layout/Container";
import { useSocietyContext } from "../../context/SocietyContext";
import {
  useGetSocietyRequests,
  useAcceptRequest,
  useRejectRequest,
} from "../../hooks/useRequests";

const NotificationsPage = () => {
  const { activeSociety, activeRole } = useSocietyContext();
  const [processingId, setProcessingId] = useState(null);

  // Fetch requests for admin
  const {
    data: requestsData,
    isLoading,
    error,
  } = useGetSocietyRequests(
    activeRole === "admin" ? activeSociety?.societyId : null
  );

  const { acceptRequestMutation, isAccepting } = useAcceptRequest();
  const { rejectRequestMutation, isRejecting } = useRejectRequest();

  const handleAccept = (requestId) => {
    setProcessingId(requestId);
    acceptRequestMutation(requestId);
  };

  const handleReject = (requestId) => {
    setProcessingId(requestId);
    rejectRequestMutation(requestId);
  };

  const requests = requestsData?.requests || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      },
    },
  };

  if (activeRole !== "admin") {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600">
            Only admins can view join requests.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Bell className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Join Requests
            </h1>
            <p className="text-gray-600">
              Manage requests to join {activeSociety?.societyName}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading requests...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-800">Failed to load requests</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && requests.length === 0 && (
          <motion.div
            className="bg-gray-50 rounded-xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Pending Requests
            </h3>
            <p className="text-gray-600">
              You're all caught up! No join requests at the moment.
            </p>
          </motion.div>
        )}

        {/* Requests List */}
        {!isLoading && !error && requests.length > 0 && (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {requests.map((request) => (
                <motion.div
                  key={request._id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, x: -100 }}
                >
                  <div className="flex items-start justify-between">
                    {/* User Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.user.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{request.user.email}</span>
                          </div>
                          {request.user.phone && (
                            <div className="flex items-center space-x-2">
                              <span>📱</span>
                              <span>{request.user.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(request.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Message */}
                        {request.message && (
                          <div className="mt-3 bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700">
                              "{request.message}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 ml-4">
                      <motion.button
                        onClick={() => handleAccept(request._id)}
                        disabled={
                          isAccepting ||
                          isRejecting ||
                          processingId === request._id
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isAccepting && processingId === request._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept</span>
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        onClick={() => handleReject(request._id)}
                        disabled={
                          isAccepting ||
                          isRejecting ||
                          processingId === request._id
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isRejecting && processingId === request._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </Container>
  );
};

export default NotificationsPage;
