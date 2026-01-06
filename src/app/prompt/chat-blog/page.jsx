"use client";
import React, { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";

const WEBSITES = [
  // {
  //   id: 1,
  //   label: "Pride Location",
  //   brand: "PrideLocation.com",
  //   baseUrl: "https://www.pridelocation.com",
  //   videoChatUrl: "https://www.pridelocation.com/video-chat-app",
  //   apiWebsiteParam: 1,
  // },
  {
    id: 2,
    label: "ChatUSA.club",
    brand: "ChatUSA.club",
    baseUrl: "https://www.chatusa.club",
    videoChatUrl: "https://app.chatusa.club",
    apiWebsiteParam: 2,
  },
];

const ARTICLES_API = "https://datacenter.randomstrangerchats.com/api/get-website-articles-slug?website=";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const RESEARCH_API = `${BASE_URL}/api/content/research`;
export const CONTENT_API = `${BASE_URL}/api/content/generate-content`;

export default function PromptBuilder() {
  // ---- Site context ----
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(2);
  const selectedWebsite = useMemo(
    () => WEBSITES.find((w) => w.id === selectedWebsiteId),
    [selectedWebsiteId]
  );

  // ---- Basic fields ----
  const [brandName, setBrandName] = useState("ChatUSA.club");
  const [topic, setTopic] = useState("Ome TV vs ChatUSA");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [url, setUrl] = useState("");
  const [pageType, setPageType] = useState("Blog");
  const [audienceLocale, setAudienceLocale] = useState("United States");
  const [currentSummary, setCurrentSummary] = useState("");
  const [usp, setUsp] = useState("");
  const [tone, setTone] = useState("Informative, Authoritative, Actionable, Slightly Conversational");

  // ---- Arrays ----
  const [secondaryKeywords, setSecondaryKeywords] = useState([""]);
  const [longtailKeywords, setLongtailKeywords] = useState([""]);
  const [competingIntents, setCompetingIntents] = useState([""]);

  // Persona
  const [personaName, setPersonaName] = useState("Digital Marketing Manager");
  const [painPoints, setPainPoints] = useState([
    "Low organic traffic",
    "Difficulty ranking",
    "Understanding Google updates",
  ]);
  const [goals, setGoals] = useState([
    "Improve SEO performance",
    "Increase brand visibility",
    "Stay compliant with search guidelines",
  ]);

  // Internal links
  const [internalLinks, setInternalLinks] = useState([
    { url: "", preferred_anchors: [""], context_hint: "conversion-focused link" },
  ]);

  // Requirements
  const [includeProsCons, setIncludeProsCons] = useState(true);
  const [minWordCount, setMinWordCount] = useState(1000);
  const [targetWordCount, setTargetWordCount] = useState(1500);
  const [faq, setFaq] = useState(true);
  const [tlDr, setTlDr] = useState(true);
  const [facts, setFacts] = useState(true);

  // ---- 2-Step Process States ----
  const [currentStep, setCurrentStep] = useState(1);
  const [researchData, setResearchData] = useState(null);
  const [finalContent, setFinalContent] = useState(null);
  const [isGeneratingResearch, setIsGeneratingResearch] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isFetchingArticles, setIsFetchingArticles] = useState(false);

  // ---- Prompt States ----
  const [researchPrompt, setResearchPrompt] = useState("");
  const [contentPrompt, setContentPrompt] = useState("");

  // Page Type Options
  const pageTypeOptions = [
    "Landing Page",
    "Blog",
    "FAQ",
    "Alternatives Hub",
    "State Page",
    "City Page",
    "Roundup",
    "Trust & Safety Hub",
    "Comparison",
    "Listicle",
    "Policy",
    "Product",
  ];

  // Update brand and helpful defaults when website changes
  useEffect(() => {
    if (!selectedWebsite) return;
    setBrandName(selectedWebsite.brand);
    if (topic.trim()) {
      const slug = toSlug(topic);
      setUrl(`${selectedWebsite.baseUrl}/${slug}`);
    } else {
      setUrl(selectedWebsite.baseUrl);
    }
  }, [selectedWebsiteId]);

  // Auto-generate Canonical URL when topic changes
  useEffect(() => {
    if (topic.trim() && selectedWebsite?.baseUrl) {
      const slug = toSlug(topic);
      setUrl(`${selectedWebsite.baseUrl}/${slug}`);
    }
  }, [topic, selectedWebsite]);

  // ---- Generate Research Prompt ----
  const generateResearchPrompt = () => {
    const prompt = `
STRICTLY PROVIDE ONLY RAW RESEARCH DATA IN JSON FORMAT. NO FINAL CONTENT.

Topic: "${topic}"
Website Context: ${selectedWebsite?.brand || "ChatUSA.club"}

Generate comprehensive research data for SEO content writing with following structure:

{
  "current_content_summary": "brief analysis of existing content landscape",
  "unique_selling_proposition": "2-3 unique angles for this topic",
  "tone_of_voice": "appropriate tone recommendations",
  "primary_keyword": "main target keyword",
  "secondary_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "competing_intents": ["intent1", "intent2", "intent3", "intent4"],
  "target_persona": {
    "name": "primary audience persona",
    "pain_points": ["point1", "point2", "point3"],
    "goals": ["goal1", "goal2", "goal3"]
  },
  "content_angles": ["angle1", "angle2", "angle3"],
  "faq_suggestions": ["question1", "question2", "question3", "question4", "question5"]
}

IMPORTANT: Return ONLY valid JSON, no additional text or explanations.
Focus on US-based video chat alternatives with safety features. Avoid external security content.
    `.trim();

    setResearchPrompt(prompt);
    return prompt;
  };

  // ---- Generate Content Prompt ----
  const generateContentPrompt = () => {
    if (!researchData) {
      toast.error("Please generate research data first");
      return "";
    }

    const payload = {
      role: "system",
      instruction: "You are an expert SEO Head and Senior Content Writer for a leading digital marketing agency. Your job is to create a single, highly optimized web page that strictly follows Google Search Essentials, Helpful Content Guidelines, Spam Policies, and E-E-A-T principles. The content must be optimized both for traditional search engines and for large language models (LLMs)/AI Overviews. It should be structured, genuinely helpful, concise yet comprehensive, and directly usable for publication.",
      inputs: {
        brand_name: brandName,
        topic: topic,
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords.filter(Boolean),
        longtail_keywords: longtailKeywords.filter(Boolean),
        url: url,
        page_type: pageType,
        audience_locale: audienceLocale,
        current_content_summary: currentSummary || undefined,
        internal_link_map: internalLinks.map((l) => ({
          url: l.url,
          preferred_anchors: l.preferred_anchors.filter(Boolean),
          context_hint: l.context_hint,
        })),
        competing_intents: competingIntents.filter(Boolean),
        target_user_persona: {
          name: personaName,
          pain_points: painPoints.filter(Boolean),
          goals: goals.filter(Boolean),
        },
        unique_selling_proposition: usp,
        tone_of_voice: tone,
      },
      requirements: {
        meta: {
          title_chars_min: 45,
          title_chars_max: 60,
          meta_chars_min: 145,
          meta_chars_max: 160,
          h1_chars_min: 40,
          h1_chars_max: 60,
        },
        content: {
          include_pros_cons: includeProsCons,
          min_word_count: minWordCount,
          target_word_count: targetWordCount,
          use_h2_h3_h4: true,
          avoid_unverifiable_claims: true,
          disclosure_if_third_party: true,
          call_for_comments_or_engagement: true,
          frequently_asked_questions_section: faq,
          tl_dr_answer_card: tlDr,
          fact_blocks_with_citations: facts,
        },
        links: {
          internal_links_min: 4,
          internal_links_max: 8,
          use_existing_phrases_only: true,
          unique_anchors: true,
          placement_note: "Place internal links naturally within the main content body, NOT in FAQ sections. Ensure anchors appear organically in sentences.",
        },
        ctas: {
          count: 3,
          style: "short, verb-led, benefit-driven, contextually placed (after intro, mid-content, and conclusion)",
        },
        schema: {
          type: "auto-select-from",
          options: [
            "FAQPage",
            "HowTo",
            "Article",
            "WebPage",
            "SoftwareApplication",
            "Product",
            "Organization",
          ],
          no_fake_ratings: true,
          include_author_details: true,
          include_publisher_details: true,
          include_image_url: true,
        },
        style: {
          avg_sentence_words_max: 16,
          paragraph_words_max: 70,
          active_voice: true,
          plain_language: true,
          readability_score_target: "Flesch-Kincaid Grade Level 7-9 (score 70-85)",
          avoid_jargon_unless_explained: true,
          question_based_headings: true,
          bulleted_lists_for_skimmability: true,
          avoid_ai_indicators: "STRICTLY avoid AI-written symbols like '-' or special glyphs. Use regular punctuation only.",
        },
      },
      deliverables_format: [
        "A. Meta Title",
        "B. Meta Description", 
        "C. H1",
        "D. Updated Outline (H2/H3/H4, including some in question format)",
        "E. Final Content (plain text, 1000-1500+ words, includes TL;DR, fact blocks, headings, lists, disclosures, FAQs, pros/cons, CTAs)",
        "F. Internal Link Placements (sentence + anchor - URL) - PLACE IN MAIN CONTENT ONLY",
        "G. CTAs (including suggested placement)",
        "H. Schema (JSON-LD)",
        "I. Quality Checklist (detailed points covering all requirements, readability, AI Overview readiness)",
        "J. Metrics (word count, title chars, meta chars, H1 chars, primary keyword, secondary keyword, avg sentence words, avg paragraph words, readability score)",
      ],
      notes: [
        "CRITICAL: All internal links must be placed within the main content body, NOT in FAQ sections.",
        "STRICTLY avoid AI-written symbols like em dashes, arrows, etc. Use regular punctuation only.",
        "Content must be genuinely helpful, human-first, and AI Overview-friendly.",
        "Always add a TL;DR style answer card near the top (50-90 words, 1 citation).",
        "Include 1-2 fact blocks with outbound authoritative citations (FTC, Google, industry).",
        "Use clear question-based H2/H3 headings to match search queries and LLM extraction.",
        "Break down long paragraphs with bulleted lists or shorter sentences.",
        "No keyword stuffing-use keywords naturally.",
        "Provide transparent pros/cons and note limitations honestly.",
        "Add disclosures if comparing competitors or linking to commercial resources.",
        "Ensure content meets both SEO best practices and readability targets for web publishing.",
        "Always deliver a strong opening hook and a conclusive summary with a final CTA.",
        "Use Tables to compare features, pros/cons, pricing, etc. where relevant. ",
        "Ensure all internal links use preferred anchors and fit contextually within main content.",
      ],
    };

    const promptText = JSON.stringify(payload, null, 2);
    setContentPrompt(promptText);
    return promptText;
  };

  // ---- Step 1: Research Generation ----
  const generateResearchData = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }

    setIsGeneratingResearch(true);
    try {
      const response = await fetch(RESEARCH_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          websiteContext: selectedWebsite?.brand || "ChatUSA.club"
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResearchData(data.data);
        
        // Auto-fill form fields with research data
        setCurrentSummary(data.data.current_content_summary || "");
        setUsp(data.data.unique_selling_proposition || "");
        setTone(data.data.tone_of_voice || "");
        setPrimaryKeyword(data.data.primary_keyword || "");
        setSecondaryKeywords(data.data.secondary_keywords || [""]);
        setCompetingIntents(data.data.competing_intents || [""]);
        
        if (data.data.target_persona) {
          setPersonaName(data.data.target_persona.name || "");
          setPainPoints(data.data.target_persona.pain_points || [""]);
          setGoals(data.data.target_persona.goals || [""]);
        }
        
        // Generate research prompt
        generateResearchPrompt();
        
        if (data.note) {
          toast.success("Research data generated (using fallback data)");
        } else {
          toast.success("Research data generated successfully!");
        }
        setCurrentStep(2);
      } else {
        throw new Error(data.error || "Research generation failed");
      }
    } catch (error) {
      console.error("Research error:", error);
      // Use fallback data directly
      setResearchData(fallbackData);
      setCurrentSummary(fallbackData.current_content_summary);
      setUsp(fallbackData.unique_selling_proposition);
      setTone(fallbackData.tone_of_voice);
      setPrimaryKeyword(fallbackData.primary_keyword);
      setSecondaryKeywords(fallbackData.secondary_keywords);
      setCompetingIntents(fallbackData.competing_intents);
      
      // Generate research prompt for fallback data
      generateResearchPrompt();
      
      toast.success("Research data generated (using fallback data)");
      setCurrentStep(2);
    } finally {
      setIsGeneratingResearch(false);
    }
  };

  // ---- Step 2: Final Content Generation ----
  const generateFinalContent = async () => {
    if (!researchData) {
      toast.error("Please generate research data first");
      return;
    }

    setIsGeneratingContent(true);
    try {
      const seoSettings = {
        brand_name: brandName,
        url: url,
        page_type: pageType,
        audience_locale: audienceLocale,
        min_word_count: minWordCount,
        target_word_count: targetWordCount,
        include_faq: faq,
        include_pros_cons: includeProsCons,
        include_tldr: tlDr,
        include_facts: facts
      };

      const response = await fetch(CONTENT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          researchData: researchData,
          seoSettings: seoSettings,
          internalLinks: internalLinks
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFinalContent(data.content);
        // Generate content prompt
        generateContentPrompt();
        toast.success("Final content generated successfully!");
      } else {
        throw new Error(data.error || "Content generation failed");
      }
    } catch (error) {
      console.error("Content generation error:", error);
      toast.error("Failed to generate final content");
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Internal link handlers
  const updateInternalLink = (idx, field, val) => {
    const next = [...internalLinks];
    next[idx][field] = val;
    setInternalLinks(next);
  };

  const addInternalLink = () =>
    setInternalLinks([
      ...internalLinks,
      { url: "", preferred_anchors: [""], context_hint: "educational/SEO-related link" },
    ]);

  const removeInternalLink = (idx) => {
    const next = internalLinks.filter((_, i) => i !== idx);
    setInternalLinks(
      next.length
        ? next
        : [{ url: "", preferred_anchors: [""], context_hint: "related feature or support content" }]
    );
  };

  const updateAnchor = (linkIdx, anchorIdx, val) => {
    const next = [...internalLinks];
    next[linkIdx].preferred_anchors[anchorIdx] = val;
    setInternalLinks(next);
  };

  const addAnchor = (linkIdx) => {
    const next = [...internalLinks];
    next[linkIdx].preferred_anchors.push("");
    setInternalLinks(next);
  };

  const removeAnchor = (linkIdx, anchorIdx) => {
    const next = [...internalLinks];
    next[linkIdx].preferred_anchors = next[linkIdx].preferred_anchors.filter(
      (_, i) => i !== anchorIdx
    );
    if (next[linkIdx].preferred_anchors.length === 0)
      next[linkIdx].preferred_anchors = [""];
    setInternalLinks(next);
  };

  // Auto-fill internal links
  const autoFillInternalLinks = async () => {
    if (!selectedWebsite) return;

    setIsFetchingArticles(true);
    try {
      const videoChatEntry = {
        url: selectedWebsite.videoChatUrl,
        preferred_anchors: [
          "start random video chat",
          "start free chat now",
          "one-on-one video chat",
        ],
        context_hint: "conversion-focused link",
      };

      const res = await fetch(`${ARTICLES_API}${selectedWebsite.apiWebsiteParam}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch latest articles");

      const data = await res.json();
      const posts = Array.isArray(data?.posts) ? data.posts : [];
      const latestTwo = [...posts].slice(0, 2);

      const articleEntries = latestTwo.map((p) => ({
        url: buildArticleUrl(selectedWebsite.baseUrl, p.slug),
        preferred_anchors: [
          readableAnchorFromSlug(p.slug),
          "read the full guide",
          "best tips for chat",
        ],
        context_hint: "related article link",
      }));

      const merged = [videoChatEntry, ...articleEntries, ...internalLinks].slice(0, Math.max(3, internalLinks.length + 3));
      setInternalLinks(merged);
      toast.success("Internal links updated with video chat + latest articles!");
    } catch (e) {
      console.error(e);
      toast.error("Could not fetch latest articles.");
    } finally {
      setIsFetchingArticles(false);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch (e) {
      toast.error("Copy failed");
    }
  };

  // Handle manual research prompt generation
  const handleManualResearchPrompt = () => {
    const prompt = generateResearchPrompt();
    copyToClipboard(prompt, "Research prompt copied! Paste this in ChatGPT manually.");
  };

  // Handle manual content prompt generation
  const handleManualContentPrompt = () => {
    const prompt = generateContentPrompt();
    if (prompt) {
      copyToClipboard(prompt, "Content prompt copied! Paste this in ChatGPT manually.");
    }
  };

  // Parse final content into structured format
  const parseFinalContent = (content) => {
    if (!content) return null;
    
    // If content is already structured (from API)
    if (typeof content === 'object') {
      return content;
    }
    
    // If content is string, try to parse it
    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch (e) {
        // If it's not JSON, return as simple content
        return {
          meta_title: "Generated Content",
          meta_description: "Content generated successfully",
          h1: topic,
          content: content,
          word_count: content.length / 5, // rough estimate
          readability_score: "8.0"
        };
      }
    }
    
    return content;
  };

  const structuredContent = parseFinalContent(finalContent);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 py-10">

      <div className="mx-auto max-w-7xl px-4">
        {/* Header with Step Indicator */}
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">2-Step AI Content Generator</h1>
              <p className="text-sm text-gray-600 mt-2">
                Step {currentStep}: {currentStep === 1 ? "AI Research" : "Content Generation"} 
                <span className="ml-2 text-blue-600">• API + Manual Options Available</span>
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-4 bg-white rounded-2xl shadow p-4 border">
              <div className={`px-4 py-2 rounded-lg ${currentStep === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                Step 1: Research
              </div>
              <div className={`px-4 py-2 rounded-lg ${currentStep === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                Step 2: Generate
              </div>
            </div>
          </div>

          {/* Website Selector */}
          <div className="bg-white rounded-2xl shadow p-4 border mb-4">
            <label className="block">
              <span className="text-sm text-gray-700">Website</span>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={selectedWebsiteId}
                onChange={(e) => setSelectedWebsiteId(parseInt(e.target.value, 10))}
              >
                {WEBSITES.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        {/* Step 1: Research */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow p-6 border">
              <h2 className="text-2xl font-bold mb-4">Step 1: AI Research & Planning</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input 
                  label="Main Topic" 
                  value={topic} 
                  setValue={setTopic} 
                  placeholder="Ome TV vs ChatUSA" 
                />
                <Input 
                  label="Brand Name" 
                  value={brandName} 
                  setValue={setBrandName} 
                  placeholder="ChatUSA.club" 
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Choose Your Method:</h3>
                <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
                  <li><strong>API Method:</strong> Automatic research generation via OpenAI API</li>
                  <li><strong>Manual Method:</strong> Copy prompt and use in ChatGPT manually</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={generateResearchData}
                  disabled={isGeneratingResearch || !topic.trim()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                >
                  {isGeneratingResearch ? "🔍 Researching with API..." : "🚀 Generate Research via API"}
                </button>

                <button
                  onClick={handleManualResearchPrompt}
                  disabled={!topic.trim()}
                  className="px-6 py-3 bg-green-600 text-white rounded-2xl font-semibold disabled:opacity-50 hover:bg-green-700 transition-colors"
                >
                  📋 Copy Research Prompt (Manual)
                </button>
              </div>
            </div>

            {/* Research Prompt Preview */}
            {researchPrompt && (
              <div className="bg-white rounded-2xl shadow p-5 border">
                <h2 className="text-xl font-semibold mb-4">Research Prompt (For Manual Use)</h2>
                <div className="bg-gray-900 text-green-200 p-4 rounded-xl overflow-auto max-h-80">
                  <pre className="whitespace-pre-wrap text-sm">{researchPrompt}</pre>
                </div>
                <button
                  onClick={() => copyToClipboard(researchPrompt, "Research prompt copied!")}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Copy Research Prompt
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Content Generation Form */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Research Summary */}
            {researchData && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <h3 className="text-lg font-semibold text-green-900 mb-3">✅ AI Research Complete</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Primary Keyword:</strong> {researchData.primary_keyword}</div>
                  <div><strong>Recommended Tone:</strong> {researchData.tone_of_voice}</div>
                  <div className="md:col-span-2"><strong>USP:</strong> {researchData.unique_selling_proposition}</div>
                </div>
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  ↻ Regenerate Research
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Form */}
              <div className="xl:col-span-2 space-y-6">
                <section className="bg-white rounded-2xl shadow p-5 border">
                  <h2 className="text-xl font-semibold mb-4">Content Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="Brand Name" value={brandName} setValue={setBrandName} />
                    <Input label="Audience Locale" value={audienceLocale} setValue={setAudienceLocale} />
                    <Input label="Topic" value={topic} setValue={setTopic} />
                    <Input label="Primary Keyword" value={primaryKeyword} setValue={setPrimaryKeyword} />
                    <Input label="Canonical URL" value={url} setValue={setUrl} />
                    <SelectInput label="Page Type" value={pageType} setValue={setPageType} options={pageTypeOptions} />
                  </div>
                  
                  <TextArea 
                    label="Current Content Summary" 
                    value={currentSummary} 
                    setValue={setCurrentSummary} 
                    placeholder="AI-generated content landscape analysis..."
                  />
                  <TextArea 
                    label="Unique Selling Proposition" 
                    value={usp} 
                    setValue={setUsp} 
                    placeholder="AI-suggested unique angles..."
                  />
                  <Input 
                    label="Tone of Voice" 
                    value={tone} 
                    setValue={setTone} 
                  />
                </section>

                {/* Keywords Section */}
                <section className="bg-white rounded-2xl shadow p-5 border">
                  <h2 className="text-xl font-semibold mb-4">Keywords & Intents</h2>
                  <ListEditor 
                    title="Secondary Keywords" 
                    items={secondaryKeywords} 
                    setItems={setSecondaryKeywords} 
                    placeholder="e.g., random video chat usa" 
                  />
                  <div className="h-4" />
                  <ListEditor 
                    title="Competing Intents" 
                    items={competingIntents} 
                    setItems={setCompetingIntents} 
                    placeholder="e.g., find safe alternatives to Ome TV" 
                  />
                </section>

                {/* Persona Section */}
                <section className="bg-white rounded-2xl shadow p-5 border">
                  <h2 className="text-xl font-semibold mb-4">Target Persona</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="Persona Name" value={personaName} setValue={setPersonaName} />
                  </div>
                  <ListEditor title="Pain Points" items={painPoints} setItems={setPainPoints} />
                  <div className="h-4" />
                  <ListEditor title="Goals" items={goals} setItems={setGoals} />
                </section>

                {/* Internal Links Section */}
                <section className="bg-white rounded-2xl shadow p-5 border">
                  <h2 className="text-xl font-semibold mb-4">Internal Link Map</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      className="px-4 py-2 rounded-2xl bg-emerald-600 text-white disabled:opacity-60"
                      onClick={autoFillInternalLinks}
                      disabled={isFetchingArticles || !selectedWebsite}
                    >
                      {isFetchingArticles ? "Fetching..." : "Auto-fill Internal Links"}
                    </button>
                    <span className="text-sm text-gray-600">Adds video chat + latest articles</span>
                  </div>
                  
                  <div className="space-y-6">
                    {internalLinks.map((l, i) => (
                      <div key={i} className="border rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Internal Link #{i + 1}</h3>
                          <button className="text-sm text-red-600" onClick={() => removeInternalLink(i)}>
                            Remove
                          </button>
                        </div>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input label="URL" value={l.url} setValue={(v) => updateInternalLink(i, "url", v)} />
                          <Input
                            label="Context Hint"
                            value={l.context_hint}
                            setValue={(v) => updateInternalLink(i, "context_hint", v)}
                          />
                        </div>
                        <div className="mt-3">
                          <h4 className="text-sm font-semibold mb-2">Preferred Anchors</h4>
                          <div className="space-y-2">
                            {l.preferred_anchors.map((a, j) => (
                              <div key={j} className="flex gap-2">
                                <input
                                  className="flex-1 border rounded-lg px-3 py-2"
                                  value={a}
                                  onChange={(e) => updateAnchor(i, j, e.target.value)}
                                  placeholder="e.g., one-on-one video chat"
                                />
                                <button className="px-3 py-2 border rounded-lg" onClick={() => removeAnchor(i, j)}>
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                          <button className="mt-2 px-3 py-2 rounded-lg bg-gray-100" onClick={() => addAnchor(i)}>
                            + Add Anchor
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="px-4 py-2 rounded-2xl bg-gray-100" onClick={addInternalLink}>
                      + Add Internal Link
                    </button>
                  </div>
                </section>

                {/* Requirements Section */}
                <section className="bg-white rounded-2xl shadow p-5 border">
                  <h2 className="text-xl font-semibold mb-4">Content Requirements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Toggle label="Include Pros & Cons" checked={includeProsCons} setChecked={setIncludeProsCons} />
                    <Toggle label="Include FAQs" checked={faq} setChecked={setFaq} />
                    <Toggle label="TL;DR Answer Card" checked={tlDr} setChecked={setTlDr} />
                    <Toggle label="Fact Blocks with Citations" checked={facts} setChecked={setFacts} />
                    <NumberInput label="Min Word Count" value={minWordCount} setValue={setMinWordCount} />
                    <NumberInput label="Target Word Count" value={targetWordCount} setValue={setTargetWordCount} />
                  </div>
                </section>
              </div>

              {/* Right Column - Actions & Results */}
              <div className="space-y-6">
                {/* Generate Final Content */}
                <section className="bg-white rounded-2xl shadow p-5 border">
                  <h2 className="text-xl font-semibold mb-4">Generate Final Content</h2>
                  
                  <div className="space-y-3">
                    <button
                      onClick={generateFinalContent}
                      disabled={isGeneratingContent}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-2xl font-semibold disabled:opacity-50 hover:bg-green-700 transition-colors"
                    >
                      {isGeneratingContent ? "🔄 Generating via API..." : "🚀 Generate Content via API"}
                    </button>

                    <button
                      onClick={handleManualContentPrompt}
                      disabled={!researchData}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-2xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    >
                      📋 Copy Content Prompt (Manual)
                    </button>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm mt-4">
                    <strong>Choose Your Method:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><strong>API Method:</strong> Automatic content generation</li>
                      <li><strong>Manual Method:</strong> Copy prompt and use in ChatGPT</li>
                    </ul>
                  </div>
                </section>

                {/* Content Prompt Preview */}
                {contentPrompt && (
                  <section className="bg-white rounded-2xl shadow p-5 border">
                    <h2 className="text-xl font-semibold mb-4">Content Prompt (For Manual Use)</h2>
                    <div className="bg-gray-900 text-blue-200 p-4 rounded-xl overflow-auto max-h-80">
                      <pre className="whitespace-pre-wrap text-sm">{contentPrompt}</pre>
                    </div>
                    <button
                      onClick={() => copyToClipboard(contentPrompt, "Content prompt copied!")}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Copy Content Prompt
                    </button>
                  </section>
                )}

                {/* Quick QA Checklist */}
                <section className="bg-white rounded-2xl shadow p-5 border">
                  <h2 className="text-xl font-semibold mb-2">Quick QA Checklist</h2>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    <li>Website picker set correctly?</li>
                    <li>Research data reviewed and adjusted?</li>
                    <li>Internal links auto-filled?</li>
                    <li>All required fields filled?</li>
                    <li>Target word count set appropriately?</li>
                  </ul>
                </section>
              </div>
            </div>

            {/* FINAL CONTENT DISPLAY - BOTTOM SECTION */}
            {structuredContent && (
              <section className="bg-white rounded-2xl shadow p-5 border mt-8">
                <h2 className="text-2xl font-bold mb-6 text-green-700">✅ Final Content Generated</h2>
                
                <div className="space-y-6">
                  {/* Meta Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">A. Meta Title</h3>
                      <p className="text-sm">{structuredContent.meta_title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Characters: {structuredContent.meta_title?.length || 0}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">B. Meta Description</h3>
                      <p className="text-sm">{structuredContent.meta_description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Characters: {structuredContent.meta_description?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* H1 Heading */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">C. H1 Heading</h3>
                    <p className="text-lg font-semibold">{structuredContent.h1}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Characters: {structuredContent.h1?.length || 0}
                    </p>
                  </div>

                  {/* Content Outline */}
                  {structuredContent.outline && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">D. Content Outline</h3>
                      <div className="text-sm whitespace-pre-wrap">{structuredContent.outline}</div>
                    </div>
                  )}

                  {/* Internal Links */}
                  {structuredContent.internal_links && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">F. Internal Link Placements</h3>
                      <div className="text-sm whitespace-pre-wrap">{structuredContent.internal_links}</div>
                    </div>
                  )}

                  {/* CTAs */}
                  {structuredContent.ctas && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">G. Call-to-Actions</h3>
                      <div className="text-sm whitespace-pre-wrap">{structuredContent.ctas}</div>
                    </div>
                  )}

                  {/* Schema */}
                  {structuredContent.schema && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">H. Schema Markup</h3>
                      <pre className="text-sm whitespace-pre-wrap bg-gray-800 text-green-200 p-3 rounded">
                        {typeof structuredContent.schema === 'string' 
                          ? structuredContent.schema 
                          : JSON.stringify(structuredContent.schema, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Quality Checklist */}
                  {structuredContent.quality_checklist && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">I. Quality Checklist</h3>
                      <div className="text-sm whitespace-pre-wrap">{structuredContent.quality_checklist}</div>
                    </div>
                  )}

                  {/* Metrics */}
                  {structuredContent.metrics && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">J. Content Metrics</h3>
                      <div className="text-sm whitespace-pre-wrap">{structuredContent.metrics}</div>
                    </div>
                  )}

                  {/* MAIN CONTENT - BOTTOM */}
                  <div className="bg-white border-2 border-green-200 p-6 rounded-lg">
                    <h3 className="font-semibold text-xl mb-4 text-green-700">E. Final Content</h3>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ 
                        __html: structuredContent.content 
                          ? (typeof structuredContent.content === 'string' 
                              ? structuredContent.content 
                              : JSON.stringify(structuredContent.content, null, 2))
                          : 'No content generated'
                      }} 
                    />
                    
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => copyToClipboard(
                          typeof structuredContent.content === 'string' 
                            ? structuredContent.content 
                            : JSON.stringify(structuredContent.content, null, 2), 
                          "Main content copied to clipboard!"
                        )}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                      >
                        Copy Main Content
                      </button>
                      
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(structuredContent, null, 2), "All content copied to clipboard!")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                      >
                        Copy All Content
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ... (UI Components और Utility functions वही रहेंगे जो आपके पास पहले से हैं)
// Input, SelectInput, TextArea, ListEditor, Toggle, NumberInput components
// toSlug, buildArticleUrl, readableAnchorFromSlug functions

// UI Components (same as before)
function Input({ label, value, setValue, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function SelectInput({ label, value, setValue, options }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <select
        className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({ label, value, setValue, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <textarea
        className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function ListEditor({ title, items, setItems, placeholder }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{title}</h3>
        <button className="text-sm" onClick={() => setItems([...items, ""])}>
          + Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2"
              value={v}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                setItems(next);
              }}
              placeholder={placeholder}
            />
            <button
              className="px-3 py-2 border rounded-lg"
              onClick={() => {
                const next = items.filter((_, idx) => idx !== i);
                setItems(next.length ? next : [""]);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, checked, setChecked }) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function NumberInput({ label, value, setValue }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type="number"
        className="mt-1 w-full border rounded-lg px-3 py-2"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value || "0", 10))}
      />
    </label>
  );
}

// Utility functions
function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildArticleUrl(baseUrl, slug) {
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanSlug = slug.startsWith("/") ? slug.slice(1) : slug;
  return `${base}/${cleanSlug}`;
}

function readableAnchorFromSlug(slug) {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}