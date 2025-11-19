import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Loader2, AlertCircle } from "lucide-react";
import {
  useAcceptRequest,
  useRejectRequest,
  useGetSocietyRequests,
} from "../../../../hooks/api/useRequests";
import {
  useAcceptInvitation,
  useMyInvitations,
  useRejectInvitation,
} from "../../../../hooks/api/useInvitations";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import Container from "../../../../components/layout/Container/Container";
import NotificationList from "../../../../components/features/notifications/NotificationList";

const NotificationsPage = () => {
  const { activeSociety, activeRole } = useSocietyContext();
  const [processingId, setProcessingId] = useState(null);

  // Admin: Fetch join requests
  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useGetSocietyRequests(
    activeRole === "admin" ? activeSociety?.societyId : null
  );

  const { acceptRequestMutation, isAccepting } = useAcceptRequest();
  const { rejectRequestMutation, isRejecting } = useRejectRequest();

  // User: Fetch invitations
  const {
    data: invitationsData,
    isLoading: isLoadingInvitations,
    error: invitationsError,
  } = useMyInvitations();

  const { mutate: acceptInvitation, isPending: isAcceptingInvitation } =
    useAcceptInvitation();
  const { mutate: rejectInvitation, isPending: isRejectingInvitation } =
    useRejectInvitation();

  // Fix mobile viewport
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  // Handlers
  const handleAcceptRequest = (requestId) => {
    setProcessingId(requestId);
    acceptRequestMutation(requestId, {
      onSettled: () => setProcessingId(null),
    });
  };

  const handleRejectRequest = (requestId) => {
    setProcessingId(requestId);
    rejectRequestMutation(requestId, {
      onSettled: () => setProcessingId(null),
    });
  };

  const handleAcceptInvitation = (invitationId) => {
    setProcessingId(invitationId);
    acceptInvitation(invitationId, {
      onSettled: () => setProcessingId(null),
    });
  };

  const handleRejectInvitation = (invitationId) => {
    setProcessingId(invitationId);
    rejectInvitation(invitationId, {
      onSettled: () => setProcessingId(null),
    });
  };

  const requests = requestsData?.requests || [];
  const invitations = invitationsData?.invitations || [];
  const isLoading = isLoadingRequests || isLoadingInvitations;

  return (
    <Container>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Sticky Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bell className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-xs text-gray-600">
                  {activeRole === "admin" ? "Manage requests" : "Your invitations"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-600 mb-3" size={40} />
              <p className="text-gray-600 text-sm">Loading...</p>
            </div>
          ) : (requestsError || invitationsError) ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-red-900 font-semibold text-sm">Error Loading</p>
                <p className="text-red-700 text-xs mt-1">Please try again</p>
              </div>
            </div>
          ) : (
            <NotificationList
              requests={requests}
              invitations={invitations}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              onAcceptInvitation={handleAcceptInvitation}
              onRejectInvitation={handleRejectInvitation}
              processingId={processingId}
              isAccepting={isAccepting}
              isRejecting={isRejecting}
              isAcceptingInvitation={isAcceptingInvitation}
              isRejectingInvitation={isRejectingInvitation}
              isAdmin={activeRole === "admin"}
            />
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Bell className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-gray-600 text-sm">
                  {activeRole === "admin"
                    ? "Manage join requests from users"
                    : "View your society invitations"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : (requestsError || invitationsError) ? (
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
          ) : (
            <NotificationList
              requests={requests}
              invitations={invitations}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              onAcceptInvitation={handleAcceptInvitation}
              onRejectInvitation={handleRejectInvitation}
              processingId={processingId}
              isAccepting={isAccepting}
              isRejecting={isRejecting}
              isAcceptingInvitation={isAcceptingInvitation}
              isRejectingInvitation={isRejectingInvitation}
              isAdmin={activeRole === "admin"}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default NotificationsPage;
