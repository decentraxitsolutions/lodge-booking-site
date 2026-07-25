import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req) {
  try {
    const settingsList = await db.setting.findMany();
    const settingsMap = {};
    settingsList.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    // Provide default UPI ID if none is set yet
    if (!settingsMap.upi_id) {
      settingsMap.upi_id = "saivitthalbhaktniwas@okaxis"; // Default fallback
    }

    return NextResponse.json(settingsMap);
  } catch (err) {
    console.error("Error reading settings:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Iterate keys and save them
    for (const key of Object.keys(body)) {
      await db.setting.upsert({
        where: { key },
        update: { value: String(body[key]) },
        create: { key, value: String(body[key]) },
      });
    }

    return NextResponse.json({ message: "Settings saved successfully" });
  } catch (err) {
    console.error("Error saving settings:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
