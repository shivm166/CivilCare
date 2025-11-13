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
import {
  useMyInvitations,
  useAcceptInvitation,
  useRejectInvitation,
} from "../../hooks/useInvitations";
import InvitationCard from "../../components/invitations/InvitationCard";

const NotificationsPage = () => {
  const { activeSociety, activeRole } = useSocietyContext();
  const [processingId, setProcessingId] = useState(null);

  // ========== ADMIN: Fetch join requests ==========
  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useGetSocietyRequests(
    activeRole === "admin" ? activeSociety?.societyId : null
  );

  const { acceptRequestMutation, isAccepting } = useAcceptRequest();
  const { rejectRequestMutation, isRejecting } = useRejectRequest();

  // ========== USER: Fetch invitations ==========
  const {
    data: invitationsData,
    isLoading: isLoadingInvitations,
    error: invitationsError,
  } = useMyInvitations();

  const { mutate: acceptInvitation, isPending: isAcceptingInvitation } =
    useAcceptInvitation();
  const { mutate: rejectInvitation, isPending: isRejectingInvitation } =
    useRejectInvitation();

  // Handle join request accept (for admin)
  const handleAccept = (requestId) => {
    setProcessingId(requestId);
    acceptRequestMutation(requestId, {
      onSettled: () => setProcessingId(null),
    });
  };

  // Handle join request reject (for admin)
  const handleReject = (requestId) => {
    setProcessingId(requestId);
    rejectRequestMutation(requestId, {
      onSettled: () => setProcessingId(null),
    });
  };

  // Handle invitation accept (for user)
  const handleAcceptInvitation = (invitationId) => {
    setProcessingId(invitationId);
    acceptInvitation(invitationId, {
      onSettled: () => setProcessingId(null),
    });
  };

  // Handle invitation reject (for user)
  const handleRejectInvitation = (invitationId) => {
    setProcessingId(invitationId);
    rejectInvitation(invitationId, {
      onSettled: () => setProcessingId(null),
    });
  };

  const requests = requestsData?.requests || [];
  const invitations = invitationsData?.invitations || [];
  const hasRequests = requests.length > 0;
  const hasInvitations = invitations.length > 0;
  const isLoading = isLoadingRequests || isLoadingInvitations;

  return (
    <Container>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Bell className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notifications
              </h1>
            </div>
            <p className="text-gray-600 ml-16">
              {activeRole === "admin"
                ? "Manage join requests from users"
                : "View your society invitations"}
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          )}

          {/* Error State */}
          {(requestsError || invitationsError) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4"
            >
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-red-900 font-semibold mb-1">
                  Error Loading Notifications
                </h3>
                <p className="text-red-700 text-sm">
                  {requestsError?.message || invitationsError?.message ||
                    "Something went wrong. Please try again."}
                </p>
              </div>
            </motion.div>
          )}

          {/* Content */}
          {!isLoading && !requestsError && !invitationsError && (
            <>
              {/* ========== ADMIN: Join Requests ========== */}
              {activeRole === "admin" && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="text-blue-600" size={20} />
                    Join Requests
                    {hasRequests && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {requests.length}
                      </span>
                    )}
                  </h2>

                  {!hasRequests ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 bg-white rounded-xl shadow-sm"
                    >
                      <Mail className="mx-auto text-gray-300 mb-4" size={64} />
                      <p className="text-gray-600 text-lg font-medium">
                        No pending join requests
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        When users request to join your society, they'll appear
                        here
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {requests.map((request) => (
                          <motion.div
                            key={request._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-green-500"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                  {request.user?.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {request.user?.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {request.user?.email}
                                  </p>
                                  {request.message && (
                                    <p className="text-sm text-gray-700 mt-2 italic bg-gray-50 p-3 rounded-lg">
                                      "{request.message}"
                                    </p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <Clock size={12} />
                                    {new Date(
                                      request.createdAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAccept(request._id)}
                                  disabled={
                                    isAccepting ||
                                    isRejecting ||
                                    processingId === request._id
                                  }
                                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
                                  title="Accept"
                                >
                                  {processingId === request._id &&
                                  isAccepting ? (
                                    <Loader2
                                      className="animate-spin"
                                      size={20}
                                    />
                                  ) : (
                                    <CheckCircle size={20} />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleReject(request._id)}
                                  disabled={
                                    isAccepting ||
                                    isRejecting ||
                                    processingId === request._id
                                  }
                                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all"
                                  title="Reject"
                                >
                                  {processingId === request._id &&
                                  isRejecting ? (
                                    <Loader2
                                      className="animate-spin"
                                      size={20}
                                    />
                                  ) : (
                                    <XCircle size={20} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}

              {/* ========== USER: Invitations ========== */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="text-purple-600" size={20} />
                  Society Invitations
                  {hasInvitations && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {invitations.length}
                    </span>
                  )}
                </h2>

                {!hasInvitations ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-white rounded-xl shadow-sm"
                  >
                    <Bell className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-600 text-lg font-medium">
                      No pending invitations
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      When admins invite you to join societies, they'll appear
                      here
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {invitations.map((invitation) => (
                        <motion.div
                          key={invitation._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                        >
                          <InvitationCard
                            invitation={invitation}
                            onAccept={handleAcceptInvitation}
                            onReject={handleRejectInvitation}
                            isProcessing={
                              processingId === invitation._id &&
                              (isAcceptingInvitation || isRejectingInvitation)
                            }
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default NotificationsPage;
