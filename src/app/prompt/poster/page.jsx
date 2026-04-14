"use client";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function SmartPosterPromptBuilder() {
  const [brand, setBrand] = useState("");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [style, setStyle] = useState("modern & minimal");
  const [colors, setColors] = useState("orange and white");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("friendly and confident");
  const [cta, setCta] = useState("Start Free Trial");
  const [size, setSize] = useState("Instagram Post (1080x1080)");

  const sizes = [
    "Instagram Post (1080x1080)",
    "Instagram Story (1080x1920)",
    "Facebook Post (1200x628)",
    "LinkedIn Post (1200x627)",
    "YouTube Thumbnail (1280x720)",
    "Twitter Post (1600x900)",
  ];

  const styles = [
    "modern & minimal",
    "luxury & premium",
    "vibrant & colorful",
    "corporate & clean",
    "romantic & soft tone",
    "fun & youthful",
  ];

  const tones = [
    "friendly and confident",
    "professional and trustworthy",
    "bold and energetic",
    "emotional and inspiring",
  ];

  const goals = [
    "promote Diwali sale",
    "launch new product",
    "announce offer",
    "build brand awareness",
    "recruit new members",
  ];

  const defaultExample = () => {
    setBrand("FasterQ");
    setGoal("promote call tracking automation for small businesses");
    setAudience("Indian business owners and sales teams");
    setStyle("modern & minimal");
    setColors("orange and white");
    setPlatform("Instagram");
    setSize("Instagram Post (1080x1080)");
    setTone("friendly and confident");
    setCta("Start Free Trial");
    toast.success("Example data loaded!");
  };

  const generatePrompt = () => {
    if (!brand || !goal || !audience) {
      toast.error("Please fill brand, goal, and audience!");
      return;
    }

    const prompt = `
Design a highly engaging AI-generated poster for "${brand}".
Purpose: ${goal}.
Target audience: ${audience}.
Visual style: ${style}.
Color palette: ${colors}.
Platform: ${platform}.
Poster size: ${size}.
Tone: ${tone}.
Include CTA: "${cta}".
Use a placeholder for the logo (do not generate the logo via AI) — the logo will be added manually later.
Make it clean, balanced, and visually attractive with strong composition, brand visibility, and marketing-focused design.
`.trim();

    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const livePrompt = `
🎨 AI Poster Prompt Preview

Brand: ${brand || "[Your Brand]"}
Goal: ${goal || "[Promotion Objective]"}
Audience: ${audience || "[Target Audience]"}
Style: ${style}
Colors: ${colors}
Platform: ${platform}
Size: ${size}
Tone: ${tone}
CTA: ${cta}
Logo: [PLACEHOLDER - manually add logo]
`;

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center p-8">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-2 text-orange-600">AI Poster Prompt Builder 🚀</h1>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Generate perfect AI poster prompts in seconds — just fill or choose options. Logo placeholder included for manual addition.
      </p>

      <div className="w-full max-w-2xl bg-gray-50 shadow-md rounded-2xl p-6 space-y-4">
        <input
          className="w-full p-3 border rounded-lg"
          placeholder="Brand Name / Product Name"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <select
          className="w-full p-3 border rounded-lg"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        >
          <option value="">Select Goal</option>
          {goals.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <input
          className="w-full p-3 border rounded-lg"
          placeholder="Target Audience (e.g. young professionals, small business owners)"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            className="p-3 border rounded-lg"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            {styles.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            className="p-3 border rounded-lg"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            {tones.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            className="p-3 border rounded-lg"
            placeholder="Color Theme"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
          />
          <input
            className="p-3 border rounded-lg"
            placeholder="Platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />
        </div>

        <select
          className="w-full p-3 border rounded-lg"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          {sizes.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <input
          className="w-full p-3 border rounded-lg"
          placeholder="Call to Action (e.g. Book Now, Try Free)"
          value={cta}
          onChange={(e) => setCta(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={generatePrompt}
            className="flex-1 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition"
          >
            Copy AI Prompt
          </button>
          <button
            onClick={defaultExample}
            className="flex-1 py-3 bg-gray-200 font-semibold rounded-xl hover:bg-gray-300 transition"
          >
            Use Example
          </button>
        </div>

        <div className="mt-5 p-4 border rounded-xl bg-white text-sm text-gray-700 whitespace-pre-line">
          {livePrompt}
        </div>
      </div>
    </div>
  );
}
