import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Mail, Bell } from "lucide-react";
import JoinRequestCard from "./JoinRequestCard";
import InvitationCard from "./societyInvitation/InvitationCard";

const NotificationList = ({
  requests = [],
  invitations = [],
  onAcceptRequest,
  onRejectRequest,
  onAcceptInvitation,
  onRejectInvitation,
  processingId,
  isAccepting,
  isRejecting,
  isAcceptingInvitation,
  isRejectingInvitation,
  isAdmin,
}) => {
  const hasRequests = requests.length > 0;
  const hasInvitations = invitations.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Join Requests Section (Admin Only) */}
      {isAdmin && (
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="text-green-600" size={18} />
            </div>
            <span>Join Requests</span>
            {hasRequests && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                {requests.length}
              </span>
            )}
          </h2>

          {!hasRequests ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm"
            >
              <Mail className="mx-auto text-gray-300 mb-3 sm:mb-4" size={48} />
              <p className="text-gray-600 text-sm sm:text-base font-medium">
                No pending join requests
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">
                New requests will appear here
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <AnimatePresence>
                {requests.map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <JoinRequestCard
                      request={request}
                      onAccept={onAcceptRequest}
                      onReject={onRejectRequest}
                      isProcessing={
                        processingId === request._id && (isAccepting || isRejecting)
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Invitations Section */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Mail className="text-blue-600" size={18} />
          </div>
          <span>Society Invitations</span>
          {hasInvitations && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
              {invitations.length}
            </span>
          )}
        </h2>

        {!hasInvitations ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm"
          >
            <Bell className="mx-auto text-gray-300 mb-3 sm:mb-4" size={48} />
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              No pending invitations
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              New invitations will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
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
                    onAccept={onAcceptInvitation}
                    onReject={onRejectInvitation}
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
    </div>
  );
};

export default NotificationList;
