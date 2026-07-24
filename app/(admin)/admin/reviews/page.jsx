"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Star, ShieldAlert } from "lucide-react";

export default function ReviewsModerationPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallbacks
  const mockReviews = [
    {
      id: "1",
      rating: 5,
      review: "अतिशय सुंदर जागा आणि विठ्ठल मंदिराच्या खूप जवळ. कुटुंबासोबत राहण्यासाठी उत्तम भक्त निवास. लिफ्ट आणि गरम पाणी वेळेत मिळते.",
      approved: false,
      user: { name: "ज्ञानेश्वर महाराज (Pune)" }
    },
    {
      id: "2",
      rating: 4,
      review: "Clean rooms and nice behavior of the reception staff. Highly recommended stay in Pandharpur.",
      approved: true,
      user: { name: "Sunita Deshmukh (Mumbai)" }
    }
  ];

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.length > 0 ? data : mockReviews);
      } else {
        setReviews(mockReviews);
      }
    } catch (e) {
      setReviews(mockReviews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });

      if (res.ok) {
        alert("Review approved successfully!");
        fetchReviews();
      } else {
        alert("Failed to approve review.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Review deleted successfully!");
        fetchReviews();
      } else {
        alert("Failed to delete review.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Review Moderation</h2>
        <p className="text-sm text-gray-500 mt-1">Approve or hide guest feedback before they appear on the homepage.</p>
      </div>

      {loading ? (
        <div>Loading reviews...</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <Card key={rev.id} className="border border-gray-200 bg-white shadow-sm rounded-xl overflow-hidden">
              <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800">{rev.user?.name || rev.userName || "Devotee"}</span>
                    <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{rev.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    “{rev.review}”
                  </p>
                </div>

                <div className="flex gap-2 shrink-0 self-end sm:self-center">
                  {!rev.approved && (
                    <Button 
                      onClick={() => handleApprove(rev.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-4 flex items-center gap-1.5 shadow"
                    >
                      <Check className="h-4 w-4" /> Approve
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleDelete(rev.id)}
                    variant="destructive"
                    className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold h-9 px-4 flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
