import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/contact",
  "/gallery",
  "/nearby",
  "/facilities",
  "/faq",
  "/policies",
  "/blog(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/contact",
  "/api/gallery",
  "/api/blogs(.*)",
  "/api/reviews(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  const isPublic = isPublicRoute(request);
  const isWriteApi = ["POST", "PUT", "DELETE", "PATCH"].includes(request.method) && request.nextUrl.pathname.startsWith("/api/");
  
  if (!isPublic || isWriteApi) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
