// frontend/src/pages/home/HomePage.jsx
import React from "react";
import { useSocietyContext } from "../../context/SocietyContext";
import { Navigate, useOutletContext } from "react-router-dom";
import SocietySwitcher from "../../components/SocietySwitcher";

const HomePage = () => {
  const { activeSociety, isSocietiesLoading } = useSocietyContext();
  const { DashboardComponent } = useOutletContext(); // Get the component from DashboardLayout Outlet Context

  if (isSocietiesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!activeSociety) {
    // If user has societies but no active one is set (should be rare due to context logic), redirect to onboarding
    return <Navigate to="/onboarding" replace />;
  }

  // Render the determined DashboardComponent (AdminDashboard or ResidentDashboard)
  return (
    <>
      <DashboardComponent />
    </>
  );
};

export default HomePage;
