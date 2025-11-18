import React from "react";
import { FiTrash2, FiMail, FiPhone, FiCalendar } from "react-icons/fi";

const MemberCard = ({ member, onRemove, isRemoving, isAdmin }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-300 overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Compact Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                {member.user?.name?.charAt(0).toUpperCase()}
              </div>
              {member.user?.isActivated && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Name & Role */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                {member.user?.name}
              </h3>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
                  member.roleInSociety === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : member.roleInSociety === "owner"
                    ? "bg-amber-100 text-amber-700"
                    : member.roleInSociety === "tenant"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span className="capitalize">{member.roleInSociety}</span>
              </span>
            </div>
          </div>

          {/* Delete Button */}
          {isAdmin && (
            <button
              onClick={() => onRemove(member._id)}
              disabled={isRemoving}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove member"
              aria-label="Remove member"
            >
              <FiTrash2 className="text-base" />
            </button>
          )}
        </div>

        {/* Compact Info Grid */}
        <div className="space-y-2">
          {/* Email */}
          <div className="flex items-center gap-2 text-xs">
            <FiMail className="flex-shrink-0 text-gray-400" />
            <span className="text-gray-600 truncate">{member.user?.email}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 text-xs">
            <FiPhone className="flex-shrink-0 text-gray-400" />
            <span className="text-gray-600">{member.user?.phone}</span>
          </div>

          {/* Unit & Date Row */}
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500 pt-1">
            {member.unit && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Unit:</span> {member.unit.unitNumber}
              </span>
            )}
            <span className="flex items-center gap-1 ml-auto">
              <FiCalendar className="flex-shrink-0" />
              {new Date(member.joinedAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Pending Badge */}
        {member.user?.isInvited && !member.user?.isActivated && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-200">
              <FiMail className="text-xs" />
              <span>Pending</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
