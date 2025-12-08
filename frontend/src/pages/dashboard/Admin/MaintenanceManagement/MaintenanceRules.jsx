import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  X,
  FileText,
  TrendingUp,
  Power,
  AlertCircle,
} from "lucide-react";
import {
  useMaintenanceRules,
  useDeleteMaintenanceRule,
  useToggleMaintenanceRuleStatus,
} from "../../../../hooks/api/useMaintenance";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import CreateRuleModal from "../../../../components/features/maintenance/CreateRuleModal";
import EditRuleModal from "../../../../components/features/maintenance/EditRuleModal";
import RuleCard from "../../../../components/features/maintenance/RuleCard";

const MaintenanceRules = () => {
  const { currentSociety } = useSocietyContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState({});
  const [filters, setFilters] = useState({
    ruleType: "all",
    status: "all",
    penaltyEnabled: "all",
  });

  const { data, isLoading } = useMaintenanceRules();
  const { mutate: deleteRule } = useDeleteMaintenanceRule();
  const { mutate: toggleStatus } = useToggleMaintenanceRuleStatus();

  const rules = data?.rules || [];

  const toggleCard = (ruleId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [ruleId]: !prev[ruleId],
    }));
  };

  // Apply filters and search
  const filteredRules = useMemo(() => {
    let result = [...rules];

    if (filters.ruleType !== "all") {
      result = result.filter((r) => r.ruleType === filters.ruleType);
    }

    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      result = result.filter((r) => r.isActive === isActive);
    }

    if (filters.penaltyEnabled !== "all") {
      const hasPenalty = filters.penaltyEnabled === "enabled";
      result = result.filter((r) => r.penaltyEnabled === hasPenalty);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((rule) => {
        const ruleName = rule.ruleName?.toLowerCase() || "";
        const description = rule.description?.toLowerCase() || "";
        const buildingName = rule.building?.name?.toLowerCase() || "";
        return (
          ruleName.includes(query) ||
          description.includes(query) ||
          buildingName.includes(query)
        );
      });
    }

    return result;
  }, [rules, filters, searchQuery]);

  // Stats calculations
  const stats = useMemo(() => {
    return {
      total: rules.length,
      active: rules.filter((r) => r.isActive).length,
      inactive: rules.filter((r) => !r.isActive).length,
      withPenalty: rules.filter((r) => r.penaltyEnabled).length,
    };
  }, [rules]);

  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setShowEditModal(true);
  };

  const handleDelete = (ruleId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this maintenance rule? This action cannot be undone."
      )
    ) {
      deleteRule(ruleId);
    }
  };

  const handleToggleStatus = (ruleId) => {
    const rule = rules.find((r) => r._id === ruleId);
    const action = rule?.isActive ? "deactivate" : "activate";
    if (
      window.confirm(
        `Are you sure you want to ${action} this rule? ${
          action === "deactivate"
            ? "It will stop generating new bills."
            : "It will start generating bills again."
        }`
      )
    ) {
      toggleStatus(ruleId);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      ruleType: "all",
      status: "all",
      penaltyEnabled: "all",
    });
    setSearchQuery("");
  };

  const hasActiveFilters =
    filters.ruleType !== "all" ||
    filters.status !== "all" ||
    filters.penaltyEnabled !== "all" ||
    searchQuery.trim() !== "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-orange-500 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading maintenance rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Maintenance Rules
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">{currentSociety?.name}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm font-medium"
            >
              <Plus size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Create New Rule</span>
              <span className="xs:hidden">Create Rule</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-md border-l-4 border-blue-500">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <FileText className="text-blue-600" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500 text-[10px] sm:text-xs">Total Rules</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-md border-l-4 border-green-500">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <TrendingUp className="text-green-600" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500 text-[10px] sm:text-xs">Active</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-md border-l-4 border-gray-500">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <Power className="text-gray-600" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500 text-[10px] sm:text-xs">Inactive</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{stats.inactive}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-md border-l-4 border-red-500">
              <div className="flex items-center gap-2">
                <div className="bg-red-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                  <AlertCircle className="text-red-600" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-500 text-[10px] sm:text-xs">With Penalty</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                    {stats.withPenalty}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-2.5 sm:p-4 mb-3 sm:mb-5">
          <div className="flex flex-col gap-2 sm:gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Rule Type Filter */}
              <select
                value={filters.ruleType}
                onChange={(e) => handleFilterChange("ruleType", e.target.value)}
                className="flex-1 min-w-[100px] px-2.5 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="all">All Types</option>
                <option value="general">General</option>
                <option value="building_specific">Building</option>
              </select>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="flex-1 min-w-[100px] px-2.5 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Penalty Filter */}
              <select
                value={filters.penaltyEnabled}
                onChange={(e) =>
                  handleFilterChange("penaltyEnabled", e.target.value)
                }
                className="flex-1 min-w-[100px] px-2.5 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="all">All Penalties</option>
                <option value="enabled">With Penalty</option>
                <option value="disabled">No Penalty</option>
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm font-medium"
                >
                  <X size={14} />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Rules List */}
        {filteredRules.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-6 sm:p-10 text-center">
            <div className="bg-gradient-to-r from-orange-100 to-pink-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FileText className="text-orange-600" size={32} />
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-2">
              {hasActiveFilters ? "No Rules Found" : "No Maintenance Rules Yet"}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters or search query"
                : "Create your first maintenance rule to start managing society maintenance"}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all text-xs sm:text-sm font-medium"
              >
                <Plus size={16} />
                Create First Rule
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {filteredRules.map((rule) => (
              <RuleCard
                key={rule._id}
                rule={rule}
                isExpanded={expandedCards[rule._id]}
                onToggleExpand={() => toggleCard(rule._id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateRuleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <EditRuleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedRule(null);
        }}
        rule={selectedRule}
      />
    </div>
  );
};

export default MaintenanceRules;