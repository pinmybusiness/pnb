// config/companyInfo.js
const companyInfo = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "FasterQ.in",
  email: "info@fasterq.in",
  website_url: process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.fasterq.in",
  website_id: process.env.NEXT_PUBLIC_WEBSITE_ID || "8",
  title: "Call Tracking Software India | Track & Record All Sales Calls",
  description:
    "Automatically track and record all SIMs. Get real-time call logs, CRM sync, and insights for your sales team - no VoIP, no number change.",
  icons: {
    icon: "/favicon.png",
  },
  logoUrl: "/logo.png",
};

export default companyInfo;
