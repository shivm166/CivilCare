import React from "react";
import { Building2, ChevronDown, Check, Loader, User, Zap } from "lucide-react";
import { useSocietyContext } from "../context/SocietyContext";

const RoleSocietySwitcher = () => {
  const {
    societies,
    activeSociety,
    activeSocietyId, // <--- CORRECTED: activeSocietyId is now correctly destructured
    activeRole,
    switchSociety,
    switchRole,
    isSocietiesLoading,
  } = useSocietyContext();

  if (isSocietiesLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (societies.length === 0) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <Zap className="w-5 h-5" />
        <span className="text-sm font-medium">No Societies</span>
      </div>
    );
  }

  // Available roles will be ['admin', 'member'] if the highest role is 'admin', otherwise it's just ['member']
  const availableRoles = activeSociety?.availableRoles || [activeSociety?.role];
  const highestRole = activeSociety?.role;

  return (
    <div className="dropdown dropdown-end">
      {/* Dropdown Toggle */}
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost m-1 flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 cursor-pointer transition-all"
      >
        <Building2 className="w-5 h-5 text-emerald-600" />
        <span className="font-medium text-gray-800 text-sm">
          {activeSociety?.societyName || "Select Society"}
        </span>
        <div
          className={`badge badge-sm font-semibold ${
            activeRole === "admin" ? "badge-primary" : "badge-neutral"
          }`}
        >
          {activeRole?.toUpperCase()}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {/* Dropdown Menu */}
      <ul
        tabIndex={0}
        className="dropdown-content mt-2 z-[1] bg-white shadow-xl border border-gray-200 rounded-xl w-72 p-2"
      >
        {/* --- Role Switcher Section (if multiple roles available: admin to member view) --- */}
        {availableRoles.length > 1 && (
          <>
            <li className="px-3 py-2 text-xs text-gray-500">
              Switch View in:{" "}
              <span className="font-semibold text-gray-700">
                {activeSociety.societyName}
              </span>
            </li>
            <div className="flex gap-2 p-2">
              {availableRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => switchRole(role)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeRole === role
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {activeRole === role && <Check className="w-4 h-4" />}
                    {role === "admin" ? "Admin View" : "Member View"}
                  </div>
                </button>
              ))}
            </div>
            <div className="divider my-1"></div>
          </>
        )}

        {/* --- Society Switcher Section --- */}
        <li className="px-3 py-2 text-xs text-gray-500">Switch Society</li>
        {societies.map((society) => {
          // The fix allows activeSocietyId to be referenced correctly.
          const isActiveSociety = society.societyId === activeSocietyId;
          const isHighestRoleAdmin = society.role === "admin";
          return (
            <li key={society.societyId}>
              <button
                onClick={() => switchSociety(society.societyId)}
                className={`flex items-start gap-2 w-full text-left px-3 py-2 rounded-lg transition-all ${
                  isActiveSociety
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                } ${
                  isActiveSociety && activeRole === "admin"
                    ? "border border-blue-500"
                    : ""
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isActiveSociety && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                  {!isActiveSociety && (
                    <Building2 className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div>
                  <span className="font-medium">{society.societyName}</span>
                  <span className="block text-xs opacity-70 text-gray-500">
                    ({isHighestRoleAdmin ? "Admin" : "Member"}) •{" "}
                    {society.details.city}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RoleSocietySwitcher;
