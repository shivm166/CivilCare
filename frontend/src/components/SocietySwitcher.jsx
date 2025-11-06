import React from "react";
import { Building2, ChevronDown, Check, Loader } from "lucide-react";
import { useSocietyContext } from "../context/SocietyContext";

const SocietySwitcher = () => {
  const { societies, activeSociety, switchSociety, isSocietiesLoading } =
    useSocietyContext();

  if (isSocietiesLoading || societies.length === 0) {
    return (
      <>
        <h1>join or create </h1>
        <Loader className="w-6 h-6 text-gray-500 animate-spin" />;
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
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Dropdown Toggle */}
      <div
        tabIndex={0}
        role="button"
        className="flex items-center gap-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer transition-all"
      >
        <Building2 className="w-5 h-5 text-emerald-600" />
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {activeSociety?.societyName}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {/* Dropdown Menu */}
      <ul
        tabIndex={0}
        className="dropdown-content absolute right-0 mt-2 z-50 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl w-72 p-2 animate-fadeIn"
      >
        <li className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
          Active Role:{" "}
          <span className="font-semibold text-emerald-600">
            {activeSociety?.role?.toUpperCase()}
          </span>
        </li>
        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

        {societies.map((society) => {
          const isActive = society.societyId === activeSociety?.societyId;
          return (
            <li key={society.societyId}>
              <button
                onClick={() => switchSociety(society.societyId)}
                className={`flex items-start gap-2 w-full text-left px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                }`}
              >
                {isActive && (
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5" />
                )}
                <div>
                  <span className="font-medium">{society.societyName}</span>
                  <span className="block text-xs opacity-70 text-gray-500 dark:text-gray-400">
                    ({society.role}) • {society.details.city}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      {activeSociety && (
        <>
          {activeSociety.role === "admin" ? (
            <h1>You are admin</h1>
          ) : (
            <h1>You are user</h1>
          )}
        </>
      )}
    </div>
  );
};

export default SocietySwitcher;
