import React from "react";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

// Static mock posts for fallbacks in case DB is empty
const mockBlogs = [
  {
    title: "आषाढी वारी २०२६: दर्शन आणि प्रवासाची संपूर्ण मार्गदर्शिका / Ashadhi Wari 2026 Guide",
    slug: "ashadhi-wari-2026-guide",
    content: `
      <p>पंढरपूर आषाढी वारी जवळ येत आहे. लाखो वारकरी माऊलींच्या दर्शनासाठी पंढरपूरकडे मार्गस्थ होतात. या काळात राहण्याची सोय, दर्शन पास बुकिंग आणि विठ्ठल मंदिर परिसरात असणाऱ्या विविध सुविधांची सविस्तर माहिती या लेखात दिली आहे.</p>
      
      <h3>१. दर्शन पासेस आणि ऑनलाइन बुकिंग (Darshan Pass Booking)</h3>
      <p>गर्दी टाळण्यासाठी मंदिर समितीने ऑनलाइन पास बुकिंगची व्यवस्था केली आहे. भाविक अधिकृत वेबसाईटवरून मोफत बायोमेट्रिक पास किंवा व्हीआयपी दर्शन पासेस मिळवू शकतात. वारीच्या मुख्य दिवसात दर्शन रांगेत उभे राहण्यासाठी ५ ते १० तास लागू शकतात.</p>

      <h3>२. भक्त निवासातील राहण्याची सोय (Accommodation)</h3>
      <p>श्री साई विठ्ठल भक्त निवास हे मुख्य मंदिराच्या अगदी जवळ (५ मिनिटांवर) आहे. आषाढी वारीच्या काळात खोल्यांचे बुकिंग आधीच करणे आवश्यक आहे, कारण या काळात पंढरपूरमध्ये भाविकांची प्रचंड गर्दी असते. आमच्याकडे स्वच्छ कौटुंबिक खोल्या आणि २४ तास गरम पाण्याची व लिफ्टची सोय आहे.</p>

      <h3>३. प्रवासाचे नियोजन आणि आरोग्य सेवा</h3>
      <p>वारी दरम्यान एसटी महामंडळ विशेष गाड्या चालवते. तसेच मंदिर परिसरात विविध ठिकाणी २४ तास वैद्यकीय शिबिरे असतात. मुक्कामादरम्यान शुद्ध पाण्याचा वापर करावा आणि स्वतःची काळजी घ्यावी.</p>
    `,
    image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=1200",
    createdAt: new Date().toISOString()
  },
  {
    title: "पंढरपूर यात्रा: कुटुंबासोबत प्रवासाचे नियोजन कसे करावे? / Planning family pilgrim trip to Pandharpur",
    slug: "pandharpur-family-trip-planning",
    content: `
      <p>कुटुंबासोबत देवदर्शनाला येताना प्रवासाचे आणि निवासाचे नियोजन आधीच करणे गरजेचे असते. खासकरून वृद्ध आणि लहान मुलांसोबत प्रवास करताना कोणत्या गोष्टींची काळजी घ्यावी, श्री विठ्ठलाच्या दर्शनासाठी कोणते पासेस उपलब्ध असतात, याबद्दलच्या काही खास टिप्स.</p>

      <h3>१. योग्य निवासाची निवड</h3>
      <p>लहान मुले किंवा ज्येष्ठ नागरिकांसोबत प्रवास करताना मंदिराजवळ राहणे अतिशय सोयीचे पडते. चालण्याचे श्रम वाचल्याने दर्शनाचा आनंद द्विगुणित होतो. श्री साई विठ्ठल भक्त निवास एलआयसी रोडवर, मंदिर समितीच्या भक्त निवासाच्या अगदी समोर असल्याने, येथे सुरक्षित आणि शांततामय वातावरण लाभते.</p>

      <h3>२. गर्दीच्या वेळेचे नियोजन</h3>
      <p>मुख्य सणांऐवजी नेहमीच्या वीकएंडला किंवा चालू आठवड्यात दर्शन घेतल्यास शांततेत दर्शन होते. सकाळी लवकर किंवा रात्री उशिरा दर्शनाची रांग लहान असते.</p>
    `,
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1200",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default async function BlogDetailPage({ params }) {
  // Await params to adhere to Next.js 16 Async Request APIs breaking change
  const { slug } = await params;

  let blog = null;
  try {
    blog = await db.blog.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.error("Error loading blog from database:", err);
  }

  // Fallback to static mock blogs if database is not seeded
  if (!blog) {
    blog = mockBlogs.find((post) => post.slug === slug);
  }

  if (!blog) {
    notFound();
  }

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <article className="mx-auto max-w-3xl px-6 bg-white p-6 sm:p-10 rounded-xl border border-[#D4AF37]/15 shadow-sm">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#EA580C] hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to updates
        </Link>

        {/* Featured Image */}
        <div className="aspect-video w-full overflow-hidden bg-gray-100 rounded-lg mb-8 border border-[#D4AF37]/10">
          <img
            src={blog.image || "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=1200"}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold mb-4">
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-800 leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Rich HTML Content */}
        <div 
          className="prose prose-orange max-w-none text-gray-650 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

      </article>
    </div>
  );
}
