import React from "react";
import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/AdminLayoutClient";

export default async function AdminLayout({ children }) {
  const user = await checkUser();

  // Route protection
  if (!user || (user.role !== "ADMIN" && user.role !== "RECEPTION_STAFF")) {
    redirect("/");
  }

  return (
    <AdminLayoutClient user={user}>
      {children}
    </AdminLayoutClient>
  );
}
