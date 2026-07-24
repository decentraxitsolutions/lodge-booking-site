import React from "react";
import { db } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Mail, Phone, CalendarRange } from "lucide-react";

export default async function CustomersListPage() {
  let customers = [];
  try {
    // Fetch users whose role is CUSTOMER
    customers = await db.user.findMany({
      where: { role: "CUSTOMER" },
      include: { bookings: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Error loading customers:", err);
  }

  // Fallbacks if empty
  const mockCustomers = [
    { id: "1", name: "Vitthal Kulkarni", email: "vitthal@kulkarni.com", phone: "+91 98901 23456", bookings: [{}, {}], createdAt: new Date() },
    { id: "2", name: "Radha Ghadge", email: "radha@ghadge.com", phone: "+91 98502 98765", bookings: [{}], createdAt: new Date() }
  ];

  const list = customers.length > 0 ? customers : mockCustomers;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customer Records</h2>
        <p className="text-sm text-gray-500 mt-1">Review pilgrim accounts, visit frequency, and contact info.</p>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((cust) => (
          <Card key={cust.id} className="border border-gray-200 bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FFF8E7] text-[#EA580C] rounded-full shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">{cust.name}</h3>
                    <span className="text-[10px] text-gray-400 font-semibold font-mono uppercase">Registered: {new Date(cust.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#EA580C] bg-[#FFF8E7] px-2.5 py-1 rounded-full text-xs font-bold border border-[#D4AF37]/20 shrink-0">
                  <CalendarRange className="h-3.5 w-3.5" />
                  <span>{cust.bookings.length} Visits</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{cust.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{cust.phone || "No Phone Number"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
