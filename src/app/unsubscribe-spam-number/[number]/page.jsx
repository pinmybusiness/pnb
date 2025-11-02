"use client";

import { useState } from "react";

export default function UnsubscribeSpamPage({ params }) {
  const phoneNumber = params.number;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error

const markSpam = async () => {
  setLoading(true);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/calls/mark-spam-public`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }), // ✅ send phone number
      }
    );

    const data = await res.json();
    if (data.success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  } catch (err) {
    setStatus("error");
  } finally {
    setLoading(false);
  }
};


  if (status === "success") {
    return (
      <div className="flex justify-center items-center h-screen text-center p-6">
        <h2 className="text-xl font-semibold text-green-600">
          Unsubscribed Successfully
        </h2>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex justify-center items-center h-screen text-center p-6">
        <p className="text-red-600 font-medium">
          Something went wrong. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen p-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4">
          Do you want to mark this number as spam?
        </h2>

        <button
          onClick={markSpam}
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold 
                     disabled:bg-gray-400 transition"
        >
          {loading ? "Processing..." : "Unsubscribe / Mark Spam"}
        </button>
      </div>
    </div>
  );
}
