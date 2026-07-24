import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const checkUser = async () => {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return null;

        const loggedInUser = await db.user.findUnique({
            where: { clerkId: clerkUser.id }
        });

        if (loggedInUser) return loggedInUser

        const name = `${clerkUser.firstName} ${clerkUser.lastName}`;

        const newUser = await db.user.create({
            data: {
                clerkId: clerkUser.id,
                email: clerkUser.emailAddresses[0].emailAddress,
                name,
                imageUrl: clerkUser.imageUrl
            }
        });

        if (newUser) return newUser;

    } catch (error) {
        console.error(error, "...", error.message);
        return null;
    }
}