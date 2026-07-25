import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const checkUser = async () => {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return null;

        let loggedInUser = await db.user.findUnique({
            where: { clerkId: clerkUser.id }
        });

        const phone = clerkUser.phoneNumbers?.[0]?.phoneNumber || null;
        const email = clerkUser.emailAddresses[0].emailAddress;

        if (!loggedInUser) {
            // Find by email (pre-invited receptionist support)
            const preInvitedUser = await db.user.findUnique({
                where: { email }
            });

            if (preInvitedUser) {
                // Link the Clerk ID to the pre-invited record
                loggedInUser = await db.user.update({
                    where: { id: preInvitedUser.id },
                    data: {
                        clerkId: clerkUser.id,
                        imageUrl: clerkUser.imageUrl,
                        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || preInvitedUser.name,
                        phone: phone || preInvitedUser.phone
                    }
                });
            }
        }

        if (loggedInUser) {
            // Update phone if missing in DB but exists in Clerk
            if (!loggedInUser.phone && phone) {
                const updated = await db.user.update({
                    where: { id: loggedInUser.id },
                    data: { phone }
                });
                return updated;
            }
            return loggedInUser;
        }

        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Devotee";

        const newUser = await db.user.create({
            data: {
                clerkId: clerkUser.id,
                email: clerkUser.emailAddresses[0].emailAddress,
                name,
                phone,
                imageUrl: clerkUser.imageUrl
            }
        });

        if (newUser) return newUser;

    } catch (error) {
        if (error.message?.includes("Dynamic server usage") || error.digest === "DYNAMIC_SERVER_USAGE") {
            throw error;
        }
        console.error("checkUser sync error:", error, error.message);
        return null;
    }
}