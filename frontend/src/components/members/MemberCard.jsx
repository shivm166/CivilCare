import React from "react";
import { FiTrash2, FiMail } from "react-icons/fi";

const MemberCard = ({ member, onRemove, isRemoving, isAdmin }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {member.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{member.user?.name}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                member.roleInSociety === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {member.roleInSociety}
            </span>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => onRemove(member._id)}
            disabled={isRemoving}
            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            title="Remove member"
          >
            <FiTrash2 />
          </button>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <p className="text-gray-600">
          <span className="font-medium">Email:</span> {member.user?.email}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Phone:</span> {member.user?.phone}
        </p>
        {member.unit && (
          <p className="text-gray-600">
            <span className="font-medium">Unit:</span> {member.unit.unitNumber}
          </p>
        )}
        <p className="text-xs text-gray-500">
          Joined: {new Date(member.joinedAt).toLocaleDateString()}
        </p>
        {member.user?.isInvited && !member.user?.isActivated && (
          <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            <FiMail /> Invitation Pending
          </span>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
