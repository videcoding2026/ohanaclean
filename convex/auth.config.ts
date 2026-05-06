export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL || process.env.VITE_CONVEX_SITE_URL || "https://steady-owl-944.convex.cloud",
      applicationID: "convex",
    },
  ],
}
