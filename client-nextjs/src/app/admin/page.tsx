import AdminLayout from "@/components/layouts/AdminLayout";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  // Redirect to courses page as default
  redirect("/admin/courses");
}
