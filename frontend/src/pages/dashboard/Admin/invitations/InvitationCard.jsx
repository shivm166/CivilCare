import React from "react";
import { FiCheck, FiX, FiMail, FiMapPin, FiUser } from "react-icons/fi";

const InvitationCard = ({ invitation, onAccept, onReject, isProcessing }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {invitation.society?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {invitation.society?.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <FiMapPin className="text-gray-400" />
              {invitation.society?.city}, {invitation.society?.state}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
          Society Invitation
        </span>
      </div>

      <div className="mb-4 space-y-2">
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <FiUser className="text-gray-400" />
          <span className="font-medium">Invited by:</span>
          <span>{invitation.invitedBy?.name}</span>
        </p>
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <FiMail className="text-gray-400" />
          <span className="font-medium">Role:</span>
          <span className="capitalize">{invitation.roleInSociety}</span>
        </p>
        {invitation.message && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 italic">"{invitation.message}"</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onAccept(invitation._id)}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          <FiCheck className="text-lg" />
          Accept
        </button>
        <button
          onClick={() => onReject(invitation._id)}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          <FiX className="text-lg" />
          Reject
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Invited {new Date(invitation.createdAt).toLocaleDateString()} at{" "}
        {new Date(invitation.createdAt).toLocaleTimeString()}
      </p>
    </div>
  );
};

export default InvitationCard;
