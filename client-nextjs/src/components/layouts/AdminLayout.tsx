"use client";

import AdminHeader from "@/components/common/Header/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Box } from "@mui/material";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <AdminHeader />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
