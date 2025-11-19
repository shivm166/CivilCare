import React from "react";
import { FiCheck, FiX, FiMapPin, FiUser, FiClock } from "react-icons/fi";

const InvitationCard = ({ invitation, onAccept, onReject, isProcessing }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-blue-500 overflow-hidden">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {invitation.society?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white truncate">
              {invitation.society?.name}
            </h3>
            <p className="text-xs text-white/90 flex items-center gap-1 truncate">
              <FiMapPin className="flex-shrink-0 text-xs" />
              {invitation.society?.city}, {invitation.society?.state}
            </p>
          </div>
        </div>
        <div className="hidden sm:block flex-shrink-0 ml-2">
          <span className="text-2xl">🏘️</span>
        </div>
      </div>

      {/* Compact Content */}
      <div className="p-4">
        {/* Info Grid - 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiUser className="text-blue-600 text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs">Invited by</p>
              <p className="font-semibold text-gray-900 truncate">{invitation.invitedBy?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs">Role</p>
              <p className="font-semibold text-gray-900 capitalize truncate">{invitation.roleInSociety}</p>
            </div>
          </div>
        </div>

        {/* Message - Compact */}
        {invitation.message && (
          <div className="mb-3 p-2.5 bg-amber-50 border-l-3 border-amber-400 rounded">
            <p className="text-xs text-gray-700 italic line-clamp-2">"{invitation.message}"</p>
          </div>
        )}

        {/* Action Buttons - Compact */}
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(invitation._id)}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-sm"
          >
            <FiCheck className="text-base" />
            Accept
          </button>
          <button
            onClick={() => onReject(invitation._id)}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-sm"
          >
            <FiX className="text-base" />
            Decline
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <FiClock className="text-xs" />
            <span>
              {new Date(invitation.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <span className="text-blue-600 font-medium">Society Invite</span>
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
