"use client"
import React, { useMemo, useState } from "react";

// Dynamic Prompt Builder — SEO Content Spec Form
// Single-file React component. Uses Tailwind classes for a clean UI.
// Exports: JSON payload (inputs + requirements + notes) and a ready-to-paste prompt block.

export default function PromptBuilder() {
  // ---- Basic fields ----
  const [brandName, setBrandName] = useState("");
  const [topic, setTopic] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [url, setUrl] = useState("");
  const [pageType, setPageType] = useState("");
  const [audienceLocale, setAudienceLocale] = useState("");
  const [currentSummary, setCurrentSummary] = useState("");
  const [usp, setUsp] = useState("");
  const [tone, setTone] = useState("Informative, Authoritative, Actionable, Slightly Conversational");

  // ---- Arrays ----
  const [secondaryKeywords, setSecondaryKeywords] = useState([""]);
  const [longtailKeywords, setLongtailKeywords] = useState([""]);
  const [competingIntents, setCompetingIntents] = useState([""]);

  // Persona
  const [personaName, setPersonaName] = useState("Digital Marketing Manager");
  const [painPoints, setPainPoints] = useState(["Low organic traffic", "Difficulty ranking", "Understanding Google updates"]);
  const [goals, setGoals] = useState(["Improve SEO performance", "Increase brand visibility", "Stay compliant with search guidelines"]);

  // Internal links: array of { url, preferred_anchors: string[], context_hint }
  const [internalLinks, setInternalLinks] = useState([
    { url: "", preferred_anchors: [""], context_hint: "conversion-focused link" },
  ]);

  // External resources: array of { name, url }
  const [externalResources, setExternalResources] = useState([
    { name: "Google Search Central", url: "https://developers.google.com/search/docs" },
    { name: "FTC Privacy & Security Guide", url: "https://consumer.ftc.gov/articles/online-privacy-and-security" },
  ]);

  // Requirements (pre-filled; editable toggles for common bits)
  const [includeProsCons, setIncludeProsCons] = useState(true);
  const [minWordCount, setMinWordCount] = useState(1000);
  const [targetWordCount, setTargetWordCount] = useState(1500);
  const [faq, setFaq] = useState(true);
  const [tlDr, setTlDr] = useState(true);
  const [facts, setFacts] = useState(true);

  // ---- Helpers for dynamic lists ----
  const updateList = (list, setList, idx, val) => {
    const next = [...list];
    next[idx] = val;
    setList(next);
  };
  const addListItem = (list, setList) => setList([...list, ""]);
  const removeListItem = (list, setList, idx) => {
    const next = list.filter((_, i) => i !== idx);
    setList(next.length ? next : [""]);
  };

  // Internal link handlers
  const updateInternalLink = (idx, field, val) => {
    const next = [...internalLinks];
    next[idx][field] = val;
    setInternalLinks(next);
  };
  const addInternalLink = () => setInternalLinks([...internalLinks, { url: "", preferred_anchors: [""], context_hint: "educational/SEO-related link" }]);
  const removeInternalLink = (idx) => {
    const next = internalLinks.filter((_, i) => i !== idx);
    setInternalLinks(next.length ? next : [{ url: "", preferred_anchors: [""], context_hint: "related feature or support content" }]);
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
    next[linkIdx].preferred_anchors = next[linkIdx].preferred_anchors.filter((_, i) => i !== anchorIdx);
    if (next[linkIdx].preferred_anchors.length === 0) next[linkIdx].preferred_anchors = [""];
    setInternalLinks(next);
  };

  // External resource handlers
  const updateExternal = (idx, field, val) => {
    const next = [...externalResources];
    next[idx][field] = val;
    setExternalResources(next);
  };
  const addExternal = () => setExternalResources([...externalResources, { name: "", url: "" }]);
  const removeExternal = (idx) => {
    const next = externalResources.filter((_, i) => i !== idx);
    setExternalResources(next.length ? next : [{ name: "", url: "" }]);
  };

  // ---- Build the payload ----
  const payload = useMemo(() => {
    return {
      role: "system",
      instruction:
        "You are an expert SEO Head and Senior Content Writer for a leading digital marketing agency. Your job is to create a single, highly optimized web page that strictly follows Google Search Essentials, Helpful Content Guidelines, Spam Policies, and E-E-A-T principles. The content must be optimized both for traditional search engines and for large language models (LLMs)/AI Overviews. It should be structured, genuinely helpful, concise yet comprehensive, and directly usable for publication. The final result must demonstrate clear topical authority, improve organic visibility, and provide tangible value to the target audience.",
      inputs: {
        brand_name: brandName,
        topic,
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords.filter(Boolean),
        longtail_keywords: longtailKeywords.filter(Boolean),
        url,
        page_type: pageType,
        audience_locale: audienceLocale,
        current_content_summary: currentSummary || undefined,
        internal_link_map: internalLinks.map((l) => ({
          url: l.url,
          preferred_anchors: l.preferred_anchors.filter(Boolean),
          context_hint: l.context_hint,
        })),
        external_resources_to_cite: externalResources.filter(r => r.name || r.url),
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
          title_chars_min: 50,
          title_chars_max: 60,
          meta_chars_min: 140,
          meta_chars_max: 155,
          h1_chars_min: 40,
          h1_chars_max: 60,
        },
        content: {
          include_pros_cons: includeProsCons,
          min_word_count: minWordCount,
          target_word_count: targetWordCount,
          primary_keyword_density_range: [0.8, 1.2],
          secondary_keyword_density_range: [0.3, 0.7],
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
          external_links_min: 2,
          external_links_max: 4,
          external_link_dofollow_attribute: "rel='nofollow' for competitive/affiliate, otherwise dofollow",
        },
        ctas: {
          count: 3,
          style: "short, verb-led, benefit-driven, contextually placed (after intro, mid-content, and conclusion)",
        },
        schema: {
          type: "auto-select-from",
          options: ["FAQPage", "HowTo", "Article", "WebPage", "SoftwareApplication", "Product", "Organization"],
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
          readability_score_target: "Flesch-Kincaid Grade Level 7-9 (score 65–75)",
          avoid_jargon_unless_explained: true,
          question_based_headings: true,
          bulleted_lists_for_skimmability: true,
        },
      },
      deliverables_format: [
        "A. Meta Title",
        "B. Meta Description",
        "C. H1",
        "D. Updated Outline (H2/H3/H4, including some in question format)",
        "E. Final Content (plain text, 1000–1500+ words, includes TL;DR, fact blocks, headings, lists, disclosures, FAQs, pros/cons, CTAs)",
        "F. Internal Link Placements (sentence + anchor → URL)",
        "G. External Link Placements (sentence + anchor → URL + rel attribute)",
        "H. CTAs (including suggested placement)",
        "I. Schema (JSON-LD)",
        "J. Quality Checklist (detailed points covering all requirements, readability, AI Overview readiness)",
        "K. Metrics (word count, title chars, meta chars, H1 chars, primary keyword density %, secondary keyword density %, avg sentence words, avg paragraph words, readability score)",
      ],
      notes: [
        "**Crucial:** Content must be genuinely helpful, human-first, and AI Overview–friendly.",
        "Always add a TL;DR style answer card near the top (50–90 words, 1 citation).",
        "Include 1–2 fact blocks with outbound authoritative citations (FTC, Google, industry).",
        "Use clear question-based H2/H3 headings to match search queries and LLM extraction.",
        "Break down long paragraphs with bulleted lists or shorter sentences.",
        "No keyword stuffing—use keywords naturally.",
        "Provide transparent pros/cons and note limitations honestly.",
        "Add disclosures if comparing competitors or linking to commercial resources.",
        "Ensure content meets both SEO best practices and readability targets for web publishing.",
        "Always deliver a strong opening hook and a conclusive summary with a final CTA.",
      ],
    };
  }, [
    brandName, topic, primaryKeyword, url, pageType, audienceLocale, currentSummary,
    secondaryKeywords, longtailKeywords, internalLinks, externalResources,
    competingIntents, personaName, painPoints, goals, usp, tone,
    includeProsCons, minWordCount, targetWordCount, faq, tlDr, facts,
  ]);

  const payloadJSON = useMemo(() => JSON.stringify(payload, null, 2), [payload]);

  const promptBlock = useMemo(() => {
    return `{"role":"system","instruction":"You are an expert SEO Head and Senior Content Writer for a leading digital marketing agency. Your job is to create a single, highly optimized web page that strictly follows Google Search Essentials, Helpful Content Guidelines, Spam Policies, and E-E-A-T principles. The content must be optimized both for traditional search engines and for large language models (LLMs)/AI Overviews. It should be structured, genuinely helpful, concise yet comprehensive, and directly usable for publication.","inputs":${JSON.stringify(payload.inputs)},"requirements":${JSON.stringify(payload.requirements)},"deliverables_format":${JSON.stringify(payload.deliverables_format)},"notes":${JSON.stringify(payload.notes)}}`;
  }, [payload]);

  // ---- Clipboard & Download helpers ----
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard.");
    } catch (e) {
      alert("Copy failed.");
    }
  };

  const download = (filename, text) => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- UI ----
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dynamic Prompt Builder — SEO Content Spec</h1>
          <p className="text-sm text-gray-600 mt-2">Fill the form, then copy or download the generated JSON or the ready-to-paste prompt block.</p>
        </header>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button className="px-4 py-2 rounded-2xl shadow bg-black text-white" onClick={() => copyToClipboard(payloadJSON)}>Copy JSON</button>
          <button className="px-4 py-2 rounded-2xl shadow bg-white border" onClick={() => download("seo-content-spec.json", payloadJSON)}>Download JSON</button>
          <button className="px-4 py-2 rounded-2xl shadow bg-indigo-600 text-white" onClick={() => copyToClipboard(promptBlock)}>Copy Prompt Block</button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Basics</h2>
            <div className="space-y-3">
              <Input label="Brand Name" value={brandName} setValue={setBrandName} placeholder="ChatUSA.club" />
              <Input label="Topic" value={topic} setValue={setTopic} placeholder="Tinychat Guide & Alternatives" />
              <Input label="Primary Keyword" value={primaryKeyword} setValue={setPrimaryKeyword} placeholder="tinychat" />
              <Input label="Canonical URL" value={url} setValue={setUrl} placeholder="https://www.example.com/your-page" />
              <Input label="Page Type" value={pageType} setValue={setPageType} placeholder="Landing / Informational Comparison" />
              <Input label="Audience Locale" value={audienceLocale} setValue={setAudienceLocale} placeholder="United States" />
              <TextArea label="Current Content Summary (optional)" value={currentSummary} setValue={setCurrentSummary} placeholder="Summarize existing content for context." />
              <TextArea label="Unique Selling Proposition (USP)" value={usp} setValue={setUsp} placeholder="What makes your brand unique on this topic?" />
              <Input label="Tone of Voice" value={tone} setValue={setTone} />
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Keywords</h2>
            <ListEditor title="Secondary Keywords" items={secondaryKeywords} setItems={setSecondaryKeywords} placeholder="e.g., tinychat website" />
            <div className="h-4" />
            <ListEditor title="Long-tail Keywords" items={longtailKeywords} setItems={setLongtailKeywords} placeholder="e.g., tinychat random video call" />
          </section>

          <section className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Persona</h2>
            <Input label="Persona Name" value={personaName} setValue={setPersonaName} />
            <ListEditor title="Pain Points" items={painPoints} setItems={setPainPoints} placeholder="e.g., Low organic traffic" />
            <div className="h-4" />
            <ListEditor title="Goals" items={goals} setItems={setGoals} placeholder="e.g., Improve SEO performance" />
          </section>

          <section className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Competing Intents</h2>
            <ListEditor title="Intents" items={competingIntents} setItems={setCompetingIntents} placeholder="e.g., Compare Tinychat with alternatives" />
          </section>

          <section className="bg-white rounded-2xl shadow p-5 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Internal Link Map</h2>
            <div className="space-y-6">
              {internalLinks.map((l, i) => (
                <div key={i} className="border rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Internal Link #{i + 1}</h3>
                    <button className="text-sm text-red-600" onClick={() => removeInternalLink(i)}>Remove</button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="URL" value={l.url} setValue={(v) => updateInternalLink(i, "url", v)} placeholder="/video-chat/" />
                    <Input label="Context Hint" value={l.context_hint} setValue={(v) => updateInternalLink(i, "context_hint", v)} placeholder="conversion-focused link" />
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-semibold mb-2">Preferred Anchors (use phrases that appear in copy)</h4>
                    <div className="space-y-2">
                      {l.preferred_anchors.map((a, j) => (
                        <div key={j} className="flex gap-2">
                          <input className="flex-1 border rounded-lg px-3 py-2" value={a} onChange={(e) => updateAnchor(i, j, e.target.value)} placeholder="e.g., one-on-one video chat" />
                          <button className="px-3 py-2 border rounded-lg" onClick={() => removeAnchor(i, j)}>Remove</button>
                        </div>
                      ))}
                    </div>
                    <button className="mt-2 px-3 py-2 rounded-lg bg-gray-100" onClick={() => addAnchor(i)}>+ Add Anchor</button>
                  </div>
                </div>
              ))}
              <button className="px-4 py-2 rounded-2xl bg-gray-100" onClick={addInternalLink}>+ Add Internal Link</button>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">External Resources to Cite</h2>
            <div className="space-y-4">
              {externalResources.map((r, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label={`Name #${i + 1}`} value={r.name} setValue={(v) => updateExternal(i, "name", v)} placeholder="Google Search Central" />
                  <Input label="URL" value={r.url} setValue={(v) => updateExternal(i, "url", v)} placeholder="https://…" />
                  <div className="md:col-span-2">
                    <button className="text-sm text-red-600" onClick={() => removeExternal(i)}>Remove</button>
                  </div>
                </div>
              ))}
              <button className="px-4 py-2 rounded-2xl bg-gray-100" onClick={addExternal}>+ Add External Resource</button>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">Content Requirements (common settings)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Toggle label="Include Pros & Cons" checked={includeProsCons} setChecked={setIncludeProsCons} />
              <Toggle label="Include FAQs" checked={faq} setChecked={setFaq} />
              <Toggle label="TL;DR Answer Card" checked={tlDr} setChecked={setTlDr} />
              <Toggle label="Fact Blocks with Citations" checked={facts} setChecked={setFacts} />
              <NumberInput label="Min Word Count" value={minWordCount} setValue={setMinWordCount} />
              <NumberInput label="Target Word Count" value={targetWordCount} setValue={setTargetWordCount} />
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow p-5 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Generated JSON</h2>
            <pre className="whitespace-pre-wrap text-xs bg-gray-900 text-green-200 p-4 rounded-xl overflow-auto max-h-96">{payloadJSON}</pre>
          </section>

          <section className="bg-white rounded-2xl shadow p-5 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Ready-to-Paste Prompt Block</h2>
            <pre className="whitespace-pre-wrap text-xs bg-gray-900 text-indigo-200 p-4 rounded-xl overflow-auto max-h-96">{promptBlock}</pre>
          </section>
        </div>

        <footer className="mt-10 text-xs text-gray-500">
          <p>Tip: Use unique anchors for internal links and ensure the phrases appear in the final copy to meet the “use existing phrases only” requirement.</p>
        </footer>
      </div>
    </div>
  );
}

// ---- UI subcomponents ----
function Input({ label, value, setValue, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        className="mt-1 w-full border rounded-lg px-3 py-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function TextArea({ label, value, setValue, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <textarea
        className="mt-1 w-full border rounded-lg px-3 py-2"
        rows={4}
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
        <button className="text-sm" onClick={() => setItems([...items, ""]) }>+ Add</button>
      </div>
      <div className="space-y-2">
        {items.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input className="flex-1 border rounded-lg px-3 py-2" value={v} onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              setItems(next);
            }} placeholder={placeholder} />
            <button className="px-3 py-2 border rounded-lg" onClick={() => {
              const next = items.filter((_, idx) => idx !== i);
              setItems(next.length ? next : [""]);
            }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, checked, setChecked }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function NumberInput({ label, value, setValue }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input type="number" className="mt-1 w-full border rounded-lg px-3 py-2" value={value} onChange={(e) => setValue(parseInt(e.target.value || "0", 10))} />
    </label>
  );
}