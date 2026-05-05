export default {
  providers: [
    {
      domain: process.env.VITE_CONVEX_SITE_URL || "http://localhost:5173",
      applicationID: "convex",
    },
  ],
}
