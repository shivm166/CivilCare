// src/hooks/useAdminStats.js
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function useAdminStats() {
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(null);
  const [complaints, setComplaints] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([api.getTotalUsers(), api.getTotalComplaints()])
      .then(([usersRes, complaintsRes]) => {
        if (!mounted) return;
        setUsersCount(usersRes.total ?? null);
        setComplaints(complaintsRes ?? null);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load stats");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return {
    loading,
    usersCount,
    complaints,
    error,
    refresh: () => {
      // simple refresh caller
      setLoading(true);
      api
        .getTotalUsers()
        .then((r) => setUsersCount(r.total))
        .catch(() => {})
        .finally(() => setLoading(false));
      api
        .getTotalComplaints()
        .then((r) => setComplaints(r))
        .catch(() => {});
    },
  };
}
