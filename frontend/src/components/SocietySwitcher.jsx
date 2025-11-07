// frontend/src/components/SocietySwitcher.jsx (Modified - Removed redundant admin/user text)
import React from "react";
import { Building2, ChevronDown, Check, Loader } from "lucide-react";
import { useSocietyContext } from "../context/SocietyContext";

const SocietySwitcher = () => {
  const { societies, activeSociety, switchSociety, isSocietiesLoading } =
    useSocietyContext();

  if (isSocietiesLoading || societies.length === 0) {
    return (
      <>
        <h1 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Join or Create Society
        </h1>
        <Loader className="w-5 h-5 text-emerald-500 animate-spin" />;
      </>
    );
  }

  if (societies.length === 1) {
    return (
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Building2 className="w-5 h-5 text-emerald-600" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-100">
          {activeSociety?.societyName || "CivilCare"}
        </span>
        <span className="text-xs text-emerald-500 ml-1">
          ({activeSociety?.role?.toUpperCase()})
        </span>
      </div>
    );
  }

  return (
    <div className="dropdown w-full">
      {/* Dropdown Toggle */}
      <div
        tabIndex={0}
        role="button"
        className="flex items-center justify-between w-full gap-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer transition-all"
      >
        <div className="flex items-center min-w-0 flex-1">
          <Building2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-medium text-gray-800 dark:text-gray-200 truncate ml-2">
            {activeSociety?.societyName}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
      </div>

      {/* Dropdown Menu */}
      <ul
        tabIndex={0}
        // Using Tailwind/DaisyUI utility for dropdown. Added dropdown class to parent.
        className="dropdown-content menu absolute right-0 mt-2 z-50 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl w-72 p-2 animate-fadeIn"
      >
        <li className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 mb-1">
          Active Role:{" "}
          <span className="font-semibold text-emerald-600">
            {activeSociety?.role?.toUpperCase()}
          </span>
        </li>

        {societies.map((society) => {
          const isActive = society.societyId === activeSociety?.societyId;
          return (
            <li key={society.societyId} className="w-full">
              <button
                onClick={() => switchSociety(society.societyId)}
                className={`flex items-start gap-2 w-full text-left px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                }`}
              >
                <div className="mt-0.5">
                  {isActive && <Check className="w-4 h-4 text-emerald-600" />}
                  {!isActive && <div className="w-4 h-4"></div>}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="font-medium truncate">
                    {society.societyName}
                  </span>
                  <span className="block text-xs opacity-70 text-gray-500 dark:text-gray-400">
                    ({society.role}) • {society.details.city}
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

export default SocietySwitcher;
