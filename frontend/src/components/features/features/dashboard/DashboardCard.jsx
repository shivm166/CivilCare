// frontend/src/components/features/dashboard/DashboardCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Megaphone,
  Wrench,
  CheckCircle2,
  Phone,
  User,
  Mail,
} from "lucide-react";
import Card from "../../../common/Card/Card";
import StatusBadge from "../../../common/StatusBadge/StatusBadge";

// --- Helper Layouts ---

const StatCardLayout = ({ data }) => {
  const Icon = data.icon;
  return (
    <Link
      to={data.link}
      className={`block rounded-3xl p-6 shadow-xl ${data.gradient} relative overflow-hidden transition-transform duration-300 hover:scale-[1.03]`}
    >
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
      <div className="relative z-10">
        <Icon className="w-10 h-10 text-white mb-3" />
        <p className="text-white/90 text-sm font-semibold mb-1">{data.title}</p>
        <p className="text-5xl font-black text-white">{data.value}</p>
      </div>
    </Link>
  );
};

const MiniStatLayout = ({ data }) => {
  const Icon = data.icon;
  return (
    <div
      className={`${data.color} rounded-2xl p-5 shadow-md transition-transform duration-300 hover:scale-[1.05]`}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-white" />
        <span className="text-xs font-bold text-white">{data.label}</span>
      </div>
      <p className="text-3xl font-black text-white">{data.value}</p>
    </div>
  );
};

const ActionCardLayout = ({ data }) => {
  const Icon = data.icon;
  return (
    <Link to={data.link} className="block">
      <Card className="hover:border-blue-200 hover:shadow-xl group">
        <div className="flex items-center gap-4 p-0">
          <div
            className={`p-3 ${data.color} rounded-xl shadow-md group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base">{data.title}</h3>
            <p className="text-xs text-gray-500">{data.desc}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
        </div>
      </Card>
    </Link>
  );
};

const RecentItemCardLayout = ({ title, items, itemType, link }) => (
  <Card
    className={`h-full border-2 ${
      itemType === "complaint" ? "border-orange-100" : "border-purple-100"
    } p-0`}
  >
    <div className="p-6">
      <div className="flex justify-between mb-5">
        <div className="flex gap-3 items-center">
          <div
            className={`p-2 rounded-xl ${
              itemType === "complaint" ? "bg-orange-100" : "bg-purple-100"
            }`}
          >
            {itemType === "complaint" ? (
              <Wrench className="text-orange-600 w-5 h-5" />
            ) : (
              <Megaphone className="text-purple-600 w-5 h-5" />
            )}
          </div>
          <h3 className="font-black text-xl">{title}</h3>
        </div>
        <Link
          to={link}
          className="text-sm font-bold text-indigo-600 flex items-center gap-1"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      {items?.length > 0 ? (
        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll pr-2">
          {items.map((item) => (
            <Link
              key={item._id}
              to={link}
              className={`block p-4 rounded-2xl transition-colors ${
                itemType === "complaint"
                  ? "bg-orange-50 border-orange-100 hover:bg-orange-100"
                  : "bg-purple-50 border-purple-100 hover:bg-purple-100"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {itemType === "complaint"
                      ? `By: ${item.createdBy?.name || "Unknown"}`
                      : item.description}
                  </p>
                </div>
                {itemType === "complaint" && (
                  <StatusBadge type={item.status} compact />
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          {itemType === "complaint" ? (
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-3" />
          ) : (
            <Megaphone className="w-16 h-16 text-purple-300 mx-auto mb-3" />
          )}
          <p className="text-sm text-gray-600 font-semibold">
            {itemType === "complaint"
              ? "All clear! No pending issues"
              : "No recent news."}
          </p>
        </div>
      )}
    </div>
    <style>{`
            .custom-scroll::-webkit-scrollbar { width: 6px; }
            .custom-scroll::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #8b5cf6, #6366f1); border-radius: 10px; }
        `}</style>
  </Card>
);

const HelpdeskCardLayout = ({ admins, societyName }) => (
  <Card className="p-0 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-2 border-white">
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Phone className="w-7 h-7 text-indigo-600" />
        <h3 className="text-2xl font-black">Society Helpdesk</h3>
      </div>
      <p className="text-gray-700 mb-5">
        Contact your society administrators or view the resident directory.
      </p>

      {admins.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-sm text-gray-600">
            No administrators found for {societyName}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="flex flex-col items-center gap-2 p-4 bg-white/50 rounded-xl border border-indigo-200 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {admin.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <h4 className="font-bold text-gray-900 line-clamp-1">
                  {admin.user?.name}
                </h4>
                <span className="text-xs font-semibold text-purple-600">
                  ADMIN
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Phone className="w-3 h-3" />
                <span>{admin.user?.phone || "N/A"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </Card>
);

const DashboardCard = ({ type, data, children }) => {
  switch (type) {
    case "stat":
      return <StatCardLayout data={data} />;
    case "mini":
      return <MiniStatLayout data={data} />;
    case "action":
      return <ActionCardLayout data={data} />;
    case "recent-items":
      return <RecentItemCardLayout {...data} />;
    case "helpdesk":
      return <HelpdeskCardLayout {...data} />;
    default:
      return <Card>{children}</Card>;
  }
};

export default DashboardCard;
