import React from "react";
import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await checkUser();

  // Enforce ADMIN role strictly (RECEPTION_STAFF is not allowed)
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Admin Control Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Configure UPI payment gateway and manage reception staff access.</p>
      </div>

      <SettingsClient />
    </div>
  );
}
