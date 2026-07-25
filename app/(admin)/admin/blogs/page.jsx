"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit3, Save, X, Upload, FileText, CheckCircle, Eye } from "lucide-react";

export default function BlogsManagerPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Helper to auto-generate slug from title
  const generateSlugFromTitle = (titleText) => {
    return titleText
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars
      .replace(/[\s_]+/g, "-") // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ""); // Remove trailing hyphens
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!editingId) {
      setSlug(generateSlugFromTitle(val));
    }
  };

  const fetchBlogs = async () => {
    try {
      // Fetch all blogs (including unpublished drafts)
      const res = await fetch("/api/blogs?all=true");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImage(data.url);
      } else {
        alert("Image upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      alert("Title, Slug and Content are required.");
      return;
    }

    try {
      const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content, image, published }),
      });

      if (res.ok) {
        alert(editingId ? "Blog updated successfully!" : "Blog created successfully!");
        setIsAdding(false);
        resetForm();
        fetchBlogs();
      } else {
        const err = await res.json();
        alert(err.error || "Could not save blog.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving blog.");
    }
  };

  const handleEditClick = (b) => {
    setEditingId(b.id);
    setTitle(b.title);
    setSlug(b.slug);
    setContent(b.content);
    setImage(b.image || "");
    setPublished(b.published || false);
    setIsAdding(false);
  };

  const handleDeleteClick = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Blog deleted successfully!");
        fetchBlogs();
      } else {
        alert("Failed to delete blog.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting blog.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setImage("");
    setPublished(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Blog Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Post updates, wari announcements, and travel guides for devotees.</p>
        </div>
        {!isAdding && !editingId && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-[#EA580C] text-white hover:bg-[#C2410C] font-semibold flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add Blog Post
          </Button>
        )}
      </div>

      {/* Add / Edit Form Panel */}
      {(isAdding || editingId) && (
        <Card className="border border-[#D4AF37]/35 bg-white shadow-md rounded-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                <h3 className="font-bold text-gray-800 text-lg">
                  {isAdding ? "Write New Blog Post" : "Edit Blog Post"}
                </h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => { setIsAdding(false); resetForm(); }}
                  className="h-8 w-8 text-gray-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Blog Title</label>
                  <Input 
                    required 
                    placeholder="e.g. Ashadhi Wari 2026 Guidelines" 
                    value={title} 
                    onChange={handleTitleChange}
                    className="border-[#D4AF37]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Slug (URL identifier)</label>
                  <Input 
                    required 
                    placeholder="e.g. ashadhi-wari-2026-guidelines" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)}
                    className="border-[#D4AF37]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 block">Cover Image Source</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="https://images.unsplash.com/..." 
                      value={image} 
                      onChange={(e) => setImage(e.target.value)}
                      className="border-[#D4AF37]/30 flex-1 h-9 text-xs"
                    />
                    
                    {/* Direct Upload button */}
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="blog-file-input" 
                        onChange={handleFileUpload}
                        className="hidden" 
                      />
                      <label 
                        htmlFor="blog-file-input" 
                        className="flex items-center gap-1 px-3 border border-dashed border-[#EA580C]/40 bg-white hover:bg-orange-50 text-[#EA580C] text-xs font-semibold rounded-lg h-9 cursor-pointer transition-colors"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {uploading ? "..." : "Upload"}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 block">Publish Status</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="published-checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="h-4 w-4 text-[#EA580C] border-gray-300 rounded focus:ring-[#EA580C]"
                    />
                    <label htmlFor="published-checkbox" className="text-xs font-semibold text-gray-700">
                      Publish immediately (devotees will see this post)
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Blog Body Content (HTML supported)</label>
                <Textarea 
                  required 
                  placeholder="<p>Write your detailed guidelines or news updates here...</p>" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  className="border-[#D4AF37]/30 min-h-60 font-mono text-sm leading-relaxed"
                />
              </div>

              {image && (
                <div className="w-40 aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-150">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setIsAdding(false); resetForm(); }}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#EA580C] hover:bg-[#C2410C] text-white h-9 text-xs font-bold shadow"
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> Save Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Grid listing */}
      {loading ? (
        <div>Loading blog posts...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <Card key={b.id} className="overflow-hidden border border-gray-200 bg-white shadow-sm rounded-xl hover:shadow-md transition-shadow group flex flex-col justify-between">
              
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <img
                  src={b.image || "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=600"}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Publish draft status badge */}
                <span className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  b.published 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                }`}>
                  {b.published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="p-5 flex-1 space-y-2">
                <h3 className="font-serif text-base font-bold text-gray-800 line-clamp-2 leading-snug">{b.title}</h3>
                <span className="text-[10px] text-gray-400 font-semibold block font-mono">Slug: {b.slug}</span>
                <span className="text-[10px] text-gray-400 font-semibold block font-mono">Date: {new Date(b.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-1.5 text-xs">
                  <FileText className="h-4 w-4" /> News/Alert
                </span>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditClick(b)}
                    className="h-8 w-8 text-gray-500 hover:text-[#EA580C] hover:bg-orange-50 border border-gray-200"
                    title="Edit Post"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteClick(b.id)}
                    className="h-8 w-8 text-red-500 hover:text-white hover:bg-red-600 border border-red-200"
                    title="Delete Post"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
