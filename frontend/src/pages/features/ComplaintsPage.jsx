// frontend/src/pages/features/ComplaintsPage.jsx

import React, { useState } from "react";
import { useSocietyContext } from "../../context/SocietyContext";
import {
  useAdminComplaints,
  useUpdateComplaint,
} from "../../hooks/useComplaints";
import { Loader2, AlertCircle, Search, Filter } from "lucide-react";
import Container from "../../components/layout/Container";
import toast from "react-hot-toast";

const ComplaintCard = ({
  complaint,
  societyId,
  updateMutation,
  isUpdating,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600 font-bold";
      default:
        return "text-gray-600";
    }
  };

  const handleUpdate = (field, value) => {
    if (isUpdating) return;

    updateMutation.mutate({
      complaintId: complaint._id,
      societyId,
      payload: { [field]: value },
    });
  };

  const isCurrentUpdating =
    isUpdating && updateMutation.variables?.complaintId === complaint._id;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        {/* Title and Creator */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {complaint.title}
          </h3>
          <p className="text-sm text-gray-500">
            Raised by:
            <span className="font-medium text-gray-700 ml-1">
              {complaint.createdBy?.name || "Unknown User"}
            </span>
            <span className="text-xs ml-2">({complaint.createdBy?.email})</span>
          </p>
        </div>

        {/* Priority Badge */}
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityColor(
            complaint.priority
          )} border border-current`}
        >
          {complaint.priority?.toUpperCase()}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">
        {complaint.description || "No description provided."}
      </p>

      {/* Status & Actions */}
      <div className="flex flex-wrap items-center gap-4 border-t pt-3 mt-3">
        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={complaint.status}
            onChange={(e) => handleUpdate("status", e.target.value)}
            disabled={isCurrentUpdating}
            className={`select select-sm border ${getStatusColor(
              complaint.status
            )} rounded-lg py-1 px-2 text-xs font-semibold`}
          >
            <option value="pending">PENDING</option>
            <option value="in_progress">IN PROGRESS</option>
            <option value="resolved">RESOLVED</option>
            <option value="rejected">REJECTED</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Priority:</label>
          <select
            value={complaint.priority}
            onChange={(e) => handleUpdate("priority", e.target.value)}
            disabled={isCurrentUpdating}
            className={`select select-sm border rounded-lg py-1 px-2 text-xs font-semibold ${getPriorityColor(
              complaint.priority
            )} border-current`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {isCurrentUpdating && (
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        )}
      </div>

      <div className="text-xs text-gray-500 mt-2">
        Created: {new Date(complaint.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

const ComplaintsPage = () => {
  const { activeSocietyId, activeRole } = useSocietyContext();

  // Local state for filters
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    q: "", // search query
    page: 1,
    limit: 10,
  });

  const [tempSearch, setTempSearch] = useState("");

  // Fetch complaints
  const { data, isLoading, isError, error } = useAdminComplaints(
    activeSocietyId,
    filters
  );
  const updateMutation = useUpdateComplaint(activeSocietyId);

  // Data extraction and defaults
  const complaints = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };

  const isUpdating = updateMutation.isPending;

  // Enforce Admin Access
  if (activeRole !== "admin") {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You must be an admin of this society to view complaints.
          </p>
        </div>
      </Container>
    );
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 })); // Reset page on filter change
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, q: tempSearch, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <Container>
      <div className="py-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Complaint Management ({pagination.total})
        </h1>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <Filter className="w-6 h-6 text-gray-500 flex-shrink-0" />

          {/* Status Filter */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="select select-bordered select-sm border border-gray-300 rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Priority Filter */}
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="select select-bordered select-sm border border-gray-300 rounded-lg"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 min-w-[200px]"
          >
            <input
              type="text"
              placeholder="Search title or description..."
              value={tempSearch}
              onChange={(e) => setTempSearch(e.target.value)}
              className="input input-bordered input-sm flex-1 rounded-r-none"
            />
            <button
              type="submit"
              className="btn btn-sm btn-info rounded-l-none"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-10">
            <Loader2 className="animate-spin mx-auto w-10 h-10 text-blue-600" />
            <p className="mt-4 text-gray-600">Fetching complaints...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-800">
              Failed to load complaints: {error.message || "Server Error"}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && complaints.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">
              No complaints found matching the criteria.
            </p>
          </div>
        )}

        {/* Complaints List */}
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              societyId={activeSocietyId}
              updateMutation={updateMutation}
              isUpdating={isUpdating}
            />
          ))}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="join">
              <button
                className="join-item btn btn-sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                «
              </button>
              <button className="join-item btn btn-sm">
                Page {pagination.page} of {pagination.pages}
              </button>
              <button
                className="join-item btn btn-sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ComplaintsPage;
