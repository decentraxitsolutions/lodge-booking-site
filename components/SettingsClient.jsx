"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, UserPlus, Trash2, Mail, Key } from "lucide-react";

export default function SettingsClient() {
  // UPI ID state
  const [upiId, setUpiId] = useState("");
  const [savingUpi, setSavingUpi] = useState(false);

  // Receptionist states
  const [receptionists, setReceptionists] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(true);

  // Load configuration
  useEffect(() => {
    // 1. Fetch general settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.upi_id) {
          setUpiId(data.upi_id);
        }
      })
      .catch((err) => console.error("Error loading settings:", err));

    // 2. Fetch receptionist list
    fetchReceptionists();
  }, []);

  const fetchReceptionists = async () => {
    try {
      const res = await fetch("/api/settings/receptionists");
      if (res.ok) {
        const data = await res.json();
        setReceptionists(data);
      }
    } catch (err) {
      console.error("Error fetching receptionists:", err);
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleSaveUpi = async (e) => {
    e.preventDefault();
    if (!upiId.trim()) return;

    setSavingUpi(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upi_id: upiId.trim() }),
      });

      if (res.ok) {
        alert("UPI configuration saved successfully!");
      } else {
        alert("Failed to save UPI ID.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving UPI ID.");
    } finally {
      setSavingUpi(false);
    }
  };

  const handleInviteReceptionist = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setInviting(true);
    try {
      const res = await fetch("/api/settings/receptionists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim() }),
      });

      if (res.ok) {
        alert("Receptionist added/invited successfully!");
        setNewEmail("");
        fetchReceptionists();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add receptionist.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding receptionist.");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveReceptionist = async (userId) => {
    if (!window.confirm("Are you sure you want to remove receptionist privileges from this user?")) return;

    try {
      const res = await fetch(`/api/settings/receptionists?id=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Receptionist removed successfully!");
        fetchReceptionists();
      } else {
        alert("Failed to remove receptionist.");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing receptionist.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* UPI QR Payment Configuration */}
      <Card className="border border-[#D4AF37]/35 bg-white shadow-md rounded-xl">
        <CardHeader className="border-b border-gray-100 pb-3 flex flex-row items-center gap-2">
          <Key className="h-5 w-5 text-[#EA580C]" />
          <CardTitle className="font-serif text-lg font-bold text-gray-800">UPI Payment Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            Enter the UPI address where customer payments should be routed. A dynamic QR code containing the exact room charges and booking reference number will be auto-generated for customers at checkout.
          </p>

          <form onSubmit={handleSaveUpi} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 block">UPI ID / VPA Address</label>
              <Input
                required
                placeholder="e.g. saivitthal@okaxis"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="border-[#D4AF37]/30 h-10"
              />
            </div>

            <Button
              type="submit"
              disabled={savingUpi}
              className="bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold shadow text-xs h-9 px-4"
            >
              {savingUpi ? "Saving..." : "Save UPI Settings"}
            </Button>
          </form>

          {upiId && (
            <div className="pt-4 border-t border-gray-100 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Example Generated QR Code (₹1,500)</span>
              <div className="bg-white p-2 rounded border border-gray-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    `upi://pay?pa=${upiId}&pn=Shri%20Sai%20Vitthal%20Bhakt%20Niwas&am=1500&cu=INR&tn=Booking-Test`
                  )}`}
                  alt="UPI QR Code Preview"
                  className="w-36 h-36 object-contain"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reception Staff Management */}
      <Card className="border border-[#D4AF37]/35 bg-white shadow-md rounded-xl">
        <CardHeader className="border-b border-gray-100 pb-3 flex flex-row items-center gap-2">
          <UserPlus className="h-5 w-5 text-[#EA580C]" />
          <CardTitle className="font-serif text-lg font-bold text-gray-800">Manage Receptionists</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Add Receptionist Form */}
          <form onSubmit={handleInviteReceptionist} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 block">Add Receptionist by Email</label>
              <div className="flex gap-2">
                <Input
                  required
                  type="email"
                  placeholder="receptionist@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="border-[#D4AF37]/30 h-10 flex-1"
                />
                <Button
                  type="submit"
                  disabled={inviting}
                  className="bg-gray-800 hover:bg-gray-900 text-white font-semibold text-xs h-10 px-4 shrink-0"
                >
                  {inviting ? "Adding..." : "Add Staff"}
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-normal">
              Note: If the email address doesn't belong to a registered user yet, we will pre-authorize it. The receptionist will automatically receive staff dashboard permissions upon logging in with this email.
            </p>
          </form>

          {/* List of current receptionists */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-1.5">Active Staff Members</span>
            
            {loadingStaff ? (
              <p className="text-xs text-gray-400">Loading receptionist records...</p>
            ) : receptionists.length > 0 ? (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {receptionists.map((staff) => (
                  <div key={staff.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-150 text-sm">
                    <div className="flex items-center gap-2.5">
                      {staff.imageUrl ? (
                        <img src={staff.imageUrl} alt={staff.name} className="w-8 h-8 rounded-full border border-gray-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs uppercase">
                          {staff.name?.slice(0, 2) || "ST"}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 leading-tight">{staff.name || "Invited Staff"}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1"><Mail className="h-3 w-3" /> {staff.email}</p>
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveReceptionist(staff.id)}
                      className="h-8 w-8 text-red-500 hover:text-white hover:bg-red-600 border border-red-200 shrink-0"
                      title="Remove Staff Permissions"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No receptionists added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
