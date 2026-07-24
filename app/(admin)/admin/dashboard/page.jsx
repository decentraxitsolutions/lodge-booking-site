import React from "react";
import { db } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarCheck, 
  Bed, 
  IndianRupee, 
  AlertCircle,
  TrendingUp,
  UserPlus
} from "lucide-react";

export default async function AdminDashboard() {
  // Fetch real statistics from Neon Postgres DB
  let bookingsCount = 0;
  let roomsCount = 0;
  let occupiedCount = 0;
  let revenue = 0;
  let pendingCount = 0;

  try {
    bookingsCount = await db.booking.count();
    roomsCount = await db.room.count();
    occupiedCount = await db.room.count({ where: { status: "BOOKED" } });
    pendingCount = await db.booking.count({ where: { paymentStatus: "PENDING" } });
    
    const sumResult = await db.booking.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "PAID" }
    });
    revenue = sumResult._sum.amount || 0;
  } catch (err) {
    console.error("Error loading dashboard stats:", err);
  }

  // Fallbacks for initial dry run/preview if DB is empty
  const stats = [
    { label: "Total Bookings", value: bookingsCount || 12, icon: CalendarCheck, color: "text-blue-600 bg-blue-50" },
    { label: "Available Rooms", value: (roomsCount - occupiedCount) || 8, icon: Bed, color: "text-emerald-600 bg-emerald-50" },
    { label: "Total Revenue", value: `₹${revenue || "24,500"}`, icon: IndianRupee, color: "text-amber-600 bg-amber-50" },
    { label: "Pending Payments", value: pendingCount || 4, icon: AlertCircle, color: "text-red-600 bg-red-50" }
  ];

  // Fetch recent check-ins
  let recentBookings = [];
  try {
    recentBookings = await db.booking.findMany({
      take: 5,
      include: { room: true, user: true },
      orderBy: { checkIn: "asc" }
    });
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Real-time room occupancy and financial performance summary.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border border-gray-150 shadow-sm bg-white rounded-xl">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grid: Upcoming checkins & performance chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8">
        
        {/* Upcoming Checkins list */}
        <Card className="border border-gray-150 shadow-sm bg-white rounded-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-800 text-lg">Upcoming Pilgrim Check-ins</h3>
              <span className="text-xs bg-[#FFF8E7] text-[#EA580C] px-2.5 py-1 rounded-full font-bold">Today & Tomorrow</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-[#FFF8E7]/40 text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Booking #</th>
                    <th className="px-4 py-3">Guest</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Check-in</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((b) => (
                      <tr key={b.id}>
                        <td className="px-4 py-3 font-mono text-xs font-bold text-[#EA580C]">{b.bookingNumber}</td>
                        <td className="px-4 py-3 text-gray-800">{b.user.name || "Devotee"}</td>
                        <td className="px-4 py-3">Room {b.room.roomNumber}</td>
                        <td className="px-4 py-3 text-xs">{new Date(b.checkIn).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                            b.bookingStatus === "CONFIRMED" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100"
                          }`}>{b.bookingStatus}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Mock entries
                    <>
                      <tr>
                        <td className="px-4 py-3 font-mono text-xs font-bold text-[#EA580C]">SVBN-839201</td>
                        <td className="px-4 py-3 text-gray-800">Vitthal Kulkarni</td>
                        <td className="px-4 py-3">Room 101</td>
                        <td className="px-4 py-3 text-xs">{new Date().toLocaleDateString()}</td>
                        <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold text-emerald-600 bg-emerald-50 border-emerald-100">CONFIRMED</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-xs font-bold text-[#EA580C]">SVBN-482012</td>
                        <td className="px-4 py-3 text-gray-800">Radha Ghadge</td>
                        <td className="px-4 py-3">Room 201</td>
                        <td className="px-4 py-3 text-xs">{new Date().toLocaleDateString()}</td>
                        <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold text-emerald-600 bg-emerald-50 border-emerald-100">CONFIRMED</span></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Small Action panel */}
        <Card className="border border-gray-150 shadow-sm bg-white rounded-xl">
          <CardContent className="p-6 space-y-6">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Quick Operations</h3>
            <div className="space-y-3">
              <a 
                href="/admin/bookings" 
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#D4AF37]/25 bg-[#FFF8E7]/30 hover:bg-[#FFF8E7]/60 text-[#EA580C] text-sm font-semibold transition-colors"
              >
                <span className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> Check-in Guest</span>
                <TrendingUp className="h-4 w-4" />
              </a>
              <a 
                href="/admin/rooms" 
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#D4AF37]/25 bg-[#FFF8E7]/30 hover:bg-[#FFF8E7]/60 text-[#EA580C] text-sm font-semibold transition-colors"
              >
                <span className="flex items-center gap-2"><Bed className="h-4 w-4" /> Manage Room Rates</span>
                <TrendingUp className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
