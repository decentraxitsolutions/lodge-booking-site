"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";

export default function BlogListPage() {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static fallback blogs for direct preview if db is empty
  const mockBlogs = [
    {
      id: "1",
      title: "आषाढी वारी २०२६: दर्शन आणि प्रवासाची संपूर्ण मार्गदर्शिका / Ashadhi Wari 2026 Guide",
      slug: "ashadhi-wari-2026-guide",
      content: "पंढरपूर आषाढी वारी जवळ येत आहे. लाखो वारकरी माऊलींच्या दर्शनासाठी पंढरपूरकडे मार्गस्थ होतात. या काळात राहण्याची सोय, दर्शन पास बुकिंग आणि विठ्ठल मंदिर परिसरात असणाऱ्या विविध सुविधांची सविस्तर माहिती या लेखात दिली आहे. ...",
      image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=600",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      title: "पंढरपूर यात्रा: कुटुंबासोबत प्रवासाचे नियोजन कसे करावे? / Planning family pilgrim trip to Pandharpur",
      slug: "pandharpur-family-trip-planning",
      content: "कुटुंबासोबत देवदर्शनाला येताना प्रवासाचे आणि निवासाचे नियोजन आधीच करणे गरजेचे असते. खासकरून वृद्ध आणि लहान मुलांसोबत प्रवास करताना कोणत्या गोष्टींची काळजी घ्यावी, श्री विठ्ठलाच्या दर्शनासाठी कोणते पासेस उपलब्ध असतात, याबद्दलच्या काही खास टिप्स. ...",
      image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=600",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setBlogs(data);
          } else {
            setBlogs(mockBlogs);
          }
        } else {
          setBlogs(mockBlogs);
        }
      } catch (err) {
        setBlogs(mockBlogs);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-serif text-4xl font-bold text-[#EA580C] sm:text-5xl">
            {t("nav.blog")}
          </h1>
          <p className="mt-4 text-gray-650 text-sm sm:text-base">
            पंढरपूर देवस्थान, वारी सोहळा आणि भक्त निवासाच्या महत्त्वाच्या घोषणा व माहिती / Travel updates and festival announcements.
          </p>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="text-center py-12">Loading updates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((post) => (
              <Card key={post.id} className="overflow-hidden border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-all flex flex-col h-full bg-white">
                <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={post.image || "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=600"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="font-serif text-xl font-bold text-gray-850 hover:text-[#EA580C] transition-colors leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {post.content.replace(/<[^>]*>/g, "")}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#D4AF37]/10">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#EA580C] hover:text-[#C2410C]"
                    >
                      Read full update
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
