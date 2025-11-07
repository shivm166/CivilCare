// frontend/src/config/nav.config.js
import {
  Home,
  Users,
  CreditCard,
  Wrench,
  Megaphone,
  DoorOpen,
  Shield,
} from "lucide-react";

export const navItems = {
  // Admin role sees all management features
  admin: [
    { name: "Dashboard", href: "/app/dashboard", icon: Home, exact: true },
    { name: "Residents", href: "/app/residents", icon: Users },
    { name: "Billing & Payments", href: "/app/billing", icon: CreditCard },
    { name: "Maintenance", href: "/app/maintenance", icon: Wrench },
    { name: "Notice Board", href: "/app/notice-board", icon: Megaphone },
    {
      name: "Visitor Management",
      href: "/app/visitor-management",
      icon: DoorOpen,
    },
    { name: "Admin Settings", href: "/app/settings", icon: Shield },
  ],
  // Resident roles (member, owner, tenant) see community and personal features
  member: [
    { name: "Dashboard", href: "/app/dashboard", icon: Home, exact: true },
    { name: "My Bills", href: "/app/billing", icon: CreditCard },
    { name: "Raise Complaint", href: "/app/maintenance", icon: Wrench },
    { name: "Notice Board", href: "/app/notice-board", icon: Megaphone },
    {
      name: "Pre-Approve Visitor",
      href: "/app/visitor-management",
      icon: DoorOpen,
    },
    { name: "Profile", href: "/app/profile", icon: Users },
  ],
  owner: [
    { name: "Dashboard", href: "/app/dashboard", icon: Home, exact: true },
    { name: "My Bills", href: "/app/billing", icon: CreditCard },
    { name: "Raise Complaint", href: "/app/maintenance", icon: Wrench },
    { name: "Notice Board", href: "/app/notice-board", icon: Megaphone },
    {
      name: "Pre-Approve Visitor",
      href: "/app/visitor-management",
      icon: DoorOpen,
    },
    { name: "Profile", href: "/app/profile", icon: Users },
  ],
  tenant: [
    { name: "Dashboard", href: "/app/dashboard", icon: Home, exact: true },
    { name: "My Bills", href: "/app/billing", icon: CreditCard },
    { name: "Raise Complaint", href: "/app/maintenance", icon: Wrench },
    { name: "Notice Board", href: "/app/notice-board", icon: Megaphone },
    {
      name: "Pre-Approve Visitor",
      href: "/app/visitor-management",
      icon: DoorOpen,
    },
    { name: "Profile", href: "/app/profile", icon: Users },
  ],
};
