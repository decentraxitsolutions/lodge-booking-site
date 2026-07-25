import pkgClient from "@prisma/client";
const { PrismaClient } = pkgClient;

import { PrismaPg } from "@prisma/adapter-pg";

import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

async function main() {
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Seeding database...");

  // 1. Clean existing data
  await prisma.fAQ.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.room.deleteMany();
  await prisma.gallery.deleteMany();
  console.log("Cleared old database records.");

  // 2. Seed rooms
  const rooms = [
    {
      roomNumber: "101",
      roomType: "Standard Non-AC Room",
      description: "स्वच्छ आणि बजेट-फ्रेंडली नॉन-एसी खोली. गरम पाणी, मोफत वाय-फाय आणि संलग्न स्नानगृह समाविष्ट. / Clean and budget-friendly standard room with fans, free Wi-Fi, and attachment bathroom.",
      capacity: 2,
      price: 1000,
      amenities: ["WiFi", "24/7 Hot Water", "CCTV Security", "RO Drinking Water"],
      images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600"],
      status: "AVAILABLE"
    },
    {
      roomNumber: "102",
      roomType: "Standard AC Room",
      description: "आरामदायी डबल बेड असलेली सुसज्ज एसी खोली. वारीच्या दिवसात विसाव्यासाठी उत्तम पर्याय. / Comfortable standard air-conditioned room with double bed and cozy environment.",
      capacity: 2,
      price: 1500,
      amenities: ["Air Conditioning", "WiFi", "24/7 Hot Water", "CCTV Security"],
      images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600"],
      status: "AVAILABLE"
    },
    {
      roomNumber: "201",
      roomType: "Deluxe AC Room",
      description: "मोठी जागा, बालकनी, एलइडी टीव्ही आणि आरामदायी सोफा असलेली डिलक्स एसी खोली. कुटुंबासाठी उत्तम सोय. / Spacious deluxe AC room featuring balcony, television, and high-quality setup.",
      capacity: 3,
      price: 2000,
      amenities: ["Air Conditioning", "WiFi", "LED TV", "Hot Water", "CCTV Security", "Balcony"],
      images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600"],
      status: "AVAILABLE"
    },
    {
      roomNumber: "301",
      roomType: "Family AC Room",
      description: "५ व्यक्तींसाठी ५ स्वतंत्र बेड्स आणि दोन स्नानगृहे असलेली प्रशस्त फॅमिली खोली. मोठ्या कुटुंबासाठी हक्काची जागा. / Large family AC suite designed to comfortably fit 5 members with extra beds and storage.",
      capacity: 5,
      price: 3500,
      amenities: ["Air Conditioning", "WiFi", "LED TV", "Lift Access", "Hot Water", "CCTV Security"],
      images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600"],
      status: "AVAILABLE"
    }
  ];

  for (const r of rooms) {
    await prisma.room.create({ data: r });
  }
  console.log("Successfully seeded 4 rooms.");

  // 3. Seed FAQs
  const faqs = [
    {
      question: "भक्त निवासाचे विठ्ठल मंदिरापासूनचे अंतर किती आहे? / What is the distance to the Vitthal Temple?",
      answer: "श्री साई विठ्ठल भक्त निवास हे विठ्ठल रुक्मिणी मुख्य मंदिरापासून चालत अवघ्या ५ मिनिटांच्या अंतरावर (सुमारे ३०० मीटर) स्थित आहे. / Shri Sai Vitthal Bhakt Niwas is located just a 5-minute walk (approx. 300 meters) from the main Vitthal Rukmini Temple."
    },
    {
      question: "चेक-इन आणि चेक-आउट वेळ काय आहे? / What is the check-in and check-out timing?",
      answer: "आमची चेक-इन वेळ दुपारी १२:०० वाजता आहे आणि चेक-आउट वेळ सकाळी ११:०० वाजता आहे. उपलब्धता असल्यास लवकर चेक-इन करण्याची सोय केली जाऊ शकते. / Our check-in time is 12:00 PM and check-out time is 11:00 AM. Early check-in can be accommodated subject to availability."
    },
    {
      question: "पार्किंगची सोय उपलब्ध आहे का? / Is parking facility available?",
      answer: "होय, भक्त निवासात यात्रेकरूंच्या गाड्यांसाठी आणि बसेससाठी मोफत आणि सुरक्षित पार्किंग व्यवस्था उपलब्ध आहे. / Yes, we offer free and secure parking space for all guest cars and pilgrim buses."
    }
  ];

  for (const f of faqs) {
    await prisma.fAQ.create({ data: f });
  }
  console.log("Successfully seeded FAQs.");

  // 4. Seed Blogs
  const blogs = [
    {
      title: "आषाढी वारी २०२६: दर्शन आणि प्रवासाची संपूर्ण मार्गदर्शिका / Ashadhi Wari 2026 Guide",
      slug: "ashadhi-wari-2026-guide",
      content: `
        <p>पंढरपूर आषाढी वारी जवळ येत आहे. लाखो वारकरी माऊलींच्या दर्शनासाठी पंढरपूरकडे मार्गस्थ होतात. या काळात राहण्याची सोय, दर्शन पास बुकिंग आणि विठ्ठल मंदिर परिसरात असणाऱ्या विविध सुविधांची सविस्तर माहिती या लेखात दिली आहे.</p>
        <h3>१. दर्शन पासेस आणि ऑनलाइन बुकिंग (Darshan Pass Booking)</h3>
        <p>गर्दी टाळण्यासाठी मंदिर समितीने ऑनलाइन पास बुकिंगची व्यवस्था केली आहे. भाविक अधिकृत वेबसाईटवरून मोफत बायोमेट्रिक पास किंवा व्हीआयपी दर्शन पासेस मिळवू शकतात. वारीच्या मुख्य दिवसात दर्शन रांगेत उभे राहण्यासाठी ५ ते १० तास लागू शकतात.</p>
        <h3>२. भक्त निवासातील राहण्याची सोय (Accommodation)</h3>
        <p>श्री साई विठ्ठल भक्त निवास हे मुख्य मंदिराच्या अगदी जवळ (५ मिनिटांवर) आहे. आषाढी वारीच्या काळात खोल्यांचे बुकिंग आधीच करणे आवश्यक आहे, कारण या काळात पंढरपूरमध्ये भाविकांची प्रचंड गर्दी असते.</p>
      `,
      image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?q=80&w=600",
      published: true
    },
    {
      title: "पंढरपूर यात्रा: कुटुंबासोबत प्रवासाचे नियोजन कसे करावे? / Planning family pilgrim trip to Pandharpur",
      slug: "pandharpur-family-trip-planning",
      content: `
        <p>कुटुंबासोबत देवदर्शनाला येताना प्रवासाचे आणि निवासाचे नियोजन आधीच करणे गरजेचे असते. खासकरून वृद्ध आणि लहान मुलांसोबत प्रवास करताना कोणत्या गोष्टींची काळजी घ्यावी, श्री विठ्ठलाच्या दर्शनासाठी कोणते पासेस उपलब्ध असतात, याबद्दलच्या काही खास टिप्स.</p>
        <h3>१. योग्य निवासाची निवड</h3>
        <p>लहान मुले किंवा ज्येष्ठ नागरिकांसोबत प्रवास करताना मंदिराजवळ राहणे अतिशय सोयीचे पडते. चालण्याचे श्रम वाचल्याने दर्शनाचा आनंद द्विगुणित होतो. श्री साई विठ्ठल भक्त निवास एलआयसी रोडवर, मंदिर समितीच्या भक्त निवासाच्या अगदी समोर असल्याने, येथे सुरक्षित आणि शांततामय वातावरण लाभते.</p>
      `,
      image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=600",
      published: true
    }
  ];

  for (const b of blogs) {
    await prisma.blog.create({ data: b });
  }
  console.log("Successfully seeded blogs.");

  // 5. Seed gallery
  const galleryItems = [
    { category: "ROOMS", title: "Standard Room", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600" },
    { category: "ROOMS", title: "Deluxe AC Room", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600" },
    { category: "ROOMS", title: "Family Room", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600" },
    { category: "BUILDING", title: "Bhakt Niwas Building", image: "/hero-bhakt-niwas.jpg" },
    { category: "RECEPTION", title: "Lobby & Reception Desk", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600" },
    { category: "PARKING", title: "Spacious Parking Lot", image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600" },
    { category: "TEMPLE_VIEW", title: "Vitthal Temple Gopuram", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=600" }
  ];
  for (const item of galleryItems) {
    await prisma.gallery.create({ data: item });
  }
  console.log("Successfully seeded gallery items.");

  console.log("Database seeding completed!");
  await pool.end(); // Gracefully close the connection pool
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
