const BASE = import.meta.env.VITE_API_BASE;

export const api = {
  getTotalUsers: () =>
    fetch(`${BASE}/api/admin/stats/users`, {
      method: "GET",
      credentials: "include",
    }).then(res => res.json()),

  getTotalComplaints: () =>
    fetch(`${BASE}/api/admin/stats/complaints`, {
      method: "GET",
      credentials: "include",
    }).then(res => res.json()),
};
