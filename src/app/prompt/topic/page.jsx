"use client";
import { useState } from "react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TopTopicFinder() {

  const [form, setForm] = useState({
    websiteName: "FasterQ",
    websiteUrl: "https://fasterq.com",
    industry: "SaaS",
    productType: "Call Tracking & AI Dialer Software",
    targetAudience: "Small business owners, sales teams, agencies",
    targetCountry: "United States",
    businessGoal: "Increase organic traffic and demo signups",
    monetizationModel: "Subscription (Monthly/Yearly)",
    competitors: "runo.ai, salestrail.io",
    contentTypePreference: "Blog",
    funnelStage: "Top of Funnel",
    brandTone: "Professional but simple and conversion-focused",
    domainAuthorityLevel: "New Website"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateTopics = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/content/top-topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          competitors: form.competitors
            ? form.competitors.split(",").map((c) => c.trim())
            : [],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        toast.success("Top 10 Topics Generated 🚀");
      } else {
        toast.error(data.error || "Something went wrong");
      }

    } catch (err) {
      toast.error("Failed to generate topics");
    } finally {
      setLoading(false);
    }
  };

  const loadVideoChatDemo = () => {
    setForm({
      websiteName: "ChatUSA.club",
      websiteUrl: "https://www.chatusa.club",
      industry: "Online Video Chat Platform",
      productType: "Random Video Chat Website",
      targetAudience: "Young adults looking for safe online chatting",
      targetCountry: "United States",
      businessGoal: "Increase SEO traffic and user registrations",
      monetizationModel: "Freemium + Premium Subscription",
      competitors: "ome.tv, chatroulette.com",
      contentTypePreference: "Blog",
      funnelStage: "Top of Funnel",
      brandTone: "Friendly, trustworthy, safety-focused",
      domainAuthorityLevel: "Medium Authority"
    });

    toast.success("Video Chat Demo Loaded");
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">
        🚀 Top 10 SEO Topic Finder
      </h1>

      <div className="flex gap-3 mb-6">
        <button
          onClick={loadVideoChatDemo}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
        >
          Load Video Chat Demo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>
        ))}
      </div>

      <button
        onClick={generateTopics}
        disabled={loading}
        className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold"
      >
        {loading ? "Generating Topics..." : "Generate Top 10 Topics"}
      </button>

      {result && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            📈 Strategy Summary:
          </h2>
          <p className="mb-6">{result.strategy_summary}</p>

          {result.top_topics.map((topic, index) => (
            <div
              key={index}
              className="border rounded-xl p-5 mb-5 bg-gray-50"
            >
              <h3 className="text-lg font-bold mb-2">
                {index + 1}. {topic.title}
              </h3>
              <p><strong>Primary Keyword:</strong> {topic.primary_keyword}</p>
              <p><strong>Intent:</strong> {topic.search_intent}</p>
              <p><strong>Difficulty:</strong> {topic.difficulty_level}</p>
              <p><strong>Funnel Stage:</strong> {topic.funnel_stage}</p>
              <p><strong>Why This Topic:</strong> {topic.why_this_topic}</p>
              <p><strong>Suggested Type:</strong> {topic.suggested_content_type}</p>
              <p><strong>Estimated Words:</strong> {topic.estimated_word_count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}