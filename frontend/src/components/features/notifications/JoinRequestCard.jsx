import React from "react";
import { User, Mail, Clock, CheckCircle, XCircle, Loader2, UserPlus } from "lucide-react";

const JoinRequestCard = ({ request, onAccept, onReject, isProcessing }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-green-500 overflow-hidden">
      {/* Top Badge - Clear Identification */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <UserPlus className="text-white" size={14} />
          </div>
          <span className="text-white text-xs sm:text-sm font-semibold">Join Request</span>
        </div>
        <span className="text-white/90 text-xs">👋</span>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0 shadow-lg">
            {request.user?.name?.charAt(0).toUpperCase()}
          </div>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">
              {request.user?.name}
            </h3>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 truncate">
                <Mail className="flex-shrink-0 text-gray-400" size={13} />
                <span className="truncate">{request.user?.email}</span>
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Clock className="flex-shrink-0 text-gray-400" size={12} />
                <span>
                  {new Date(request.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(request.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {request.message && (
          <div className="mb-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg">
            <p className="text-xs font-semibold text-green-800 mb-1 flex items-center gap-1.5">
              💬 Message
            </p>
            <p className="text-xs sm:text-sm text-gray-700 italic line-clamp-2 break-words">
              "{request.message}"
            </p>
          </div>
        )}

        {/* Info Alert */}
        <div className="mb-3 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 flex items-start gap-2">
            <span className="flex-shrink-0">ℹ️</span>
            <span>Review this request carefully before accepting</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(request._id)}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30 hover:shadow-xl text-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span className="hidden sm:inline">Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                <span>Accept</span>
              </>
            )}
          </button>
          <button
            onClick={() => onReject(request._id)}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30 hover:shadow-xl text-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span className="hidden sm:inline">Processing...</span>
              </>
            ) : (
              <>
                <XCircle size={16} />
                <span>Decline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer Note */}
      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          🔒 User wants to join your society
        </p>
      </div>
    </div>
  );
};

export default JoinRequestCard;
