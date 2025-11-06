import React from "react";
import { Building, ChevronDown, Check } from "lucide-react";
import { useSocietyContext } from "../context/SocietyContext";

const SocietySwitcher = () => {
  const { societies, activeSociety, switchSociety, isSocietiesLoading } =
    useSocietyContext();

  if (isSocietiesLoading || societies.length === 0) {
    return null;
  }

  if (societies.length <= 1) {
    return (
      <div className="flex items-center gap-2 text-primary p-2">
        <Building className="w-5 h-5" />
        <span className="text-sm font-semibold">
          {activeSociety?.societyName || "CivilCare"}
        </span>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      {/* Dropdown Toggle Button */}
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-sm px-3 rounded-xl flex items-center gap-2"
      >
        <Building className="w-5 h-5 text-emerald-600" />
        <span className="font-semibold text-slate-700">
          {activeSociety?.societyName}
        </span>
        <ChevronDown className="w-4 h-4 ml-1 text-slate-500" />
      </div>

      {/* Dropdown Content - Societies ની યાદી */}
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow-2xl bg-white rounded-box w-64 border border-slate-100"
      >
        <li className="menu-title text-sm text-slate-500">
          Active Role: {activeSociety?.role.toUpperCase()}
        </li>
        <div className="divider my-0"></div>
        {societies.map((society) => (
          <li key={society.societyId}>
            <a
              onClick={() => switchSociety(society.societyId)}
              // સક્રિય (Active) society ને અલગ રીતે બતાવો
              className={
                society.societyId === activeSociety?.societyId
                  ? "active bg-emerald-50 text-emerald-600"
                  : "hover:bg-slate-50"
              }
            >
              {society.societyId === activeSociety?.societyId && (
                <Check className="w-4 h-4 text-emerald-600 mr-2" />
              )}
              <div>
                <span className="font-medium">{society.societyName}</span>
                <span className="opacity-70 text-xs block text-slate-500">
                  ({society.role}) - {society.details.city}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocietySwitcher;
