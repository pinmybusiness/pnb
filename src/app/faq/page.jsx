// app/faq/page.jsx
import FAQClient from "./FAQClient";

export const metadata = {
  title: "FAQs - FasterQ",
  description:
    "Find answers to common questions about FasterQ, including features, call history, recording, privacy, security, billing, and troubleshooting.",
};

export default function FAQPage() {
  return <FAQClient />;
}
