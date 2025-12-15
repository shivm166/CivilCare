import React from "react";
import { Building2, ChevronDown, Check, Loader, Zap } from "lucide-react";
import { useSocietyContext } from "../../../contexts/SocietyContext";


const RoleSocietySwitcher = () => {
  const {
    societies,
    activeSociety,
    activeSocietyId,
    activeRole,
    switchSociety,
    switchRole,
    isSocietiesLoading,
  } = useSocietyContext();

  // Function to close dropdown
  const closeDropdown = () => {
    document.activeElement.blur();
  };

  // Handle role switch
  const handleRoleSwitch = (role) => {
    switchRole(role);
    closeDropdown();
  };

  // Handle society switch
  const handleSocietySwitch = (societyId) => {
    switchSociety(societyId);
    closeDropdown();
  };


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


  const availableRoles = activeSociety?.availableRoles || [activeSociety?.role];


  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost m-1 flex items-center gap-2 bg-white hover:bg-gray-50 px-3 sm:px-4 py-2 rounded-xl border border-gray-200 cursor-pointer transition-all duration-200 ease-in-out min-w-0"
      >
        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
        <span className="font-medium text-gray-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">
          {activeSociety?.societyName || "Select Society"}
        </span>
        <div
          className={`badge badge-sm font-semibold text-[10px] sm:text-xs flex-shrink-0 ${
            activeRole === "admin" ? "badge-primary" : "badge-neutral"
          }`}
          style={{ 
            minWidth: '52px',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out'
          }}
        >
          <span className="inline-block" style={{ width: '100%', textAlign: 'center' }}>
            {activeRole?.toUpperCase()}
          </span>
        </div>
        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
      </div>


      <ul
        tabIndex={0}
        className="dropdown-content mt-2 bg-white shadow-xl border border-gray-200 rounded-xl w-[280px] sm:w-72 md:w-80 p-2 max-h-[80vh] overflow-y-auto z-50"
      >
        {/*  Role Switcher Section */}
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
                  onClick={() => handleRoleSwitch(role)}
                  className={`flex-1 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out ${
                    activeRole === role
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{ minWidth: '110px' }}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    {/* Fixed width container for icon to prevent layout shift */}
                    <span className="inline-flex items-center justify-center w-4 h-4 flex-shrink-0">
                      <Check 
                        className={`w-4 h-4 transition-opacity duration-200 ease-in-out ${
                          activeRole === role ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </span>
                    <span className="whitespace-nowrap">
                      {role === "admin" ? "Admin View" : "Member View"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="divider my-1"></div>
          </>
        )}
        {/* --- Society Switcher Section --- */}
        <li className="px-3 py-2 text-xs text-gray-500">Switch Society</li>
        <div className="space-y-1">
          {societies.map((society) => {
            const isActiveSociety = society.societyId === activeSocietyId;
            const isHighestRoleAdmin = society.role === "admin";
            return (
              <li key={society.societyId}>
                <button
                  onClick={() => handleSocietySwitch(society.societyId)}
                  className={`flex items-start gap-2 w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                    isActiveSociety
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-100 text-gray-700"
                  } ${
                    isActiveSociety && activeRole === "admin"
                      ? "border border-blue-500"
                      : ""
                  }`}
                >
                  {/* Fixed width container for icon to prevent layout shift */}
                  <div className="flex-shrink-0 mt-0.5 w-4 h-4 flex items-center justify-center">
                    {isActiveSociety && (
                      <Check className="w-4 h-4 text-emerald-600" />
                    )}
                    {!isActiveSociety && (
                      <Building2 className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm block truncate">
                      {society.societyName}
                    </span>
                    <span className="block text-xs opacity-70 text-gray-500">
                      ({isHighestRoleAdmin ? "Admin" : "Member"}) •{" "}
                      {society.details.city}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </div>
      </ul>
    </div>
  );
};


export default RoleSocietySwitcher;
