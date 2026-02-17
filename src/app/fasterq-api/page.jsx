export const metadata = {
  title: "Fasterq API Documentation",
  description:
    "Official Fasterq API integration guide for developers. Incremental sync using createdAt.",
};

export default function FasterqApiDocs() {
  return (
    <div className="min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Fasterq API Integration Guide
          </h1>
          <p className="text-lg text-gray-600">
            Incremental sync using <span className="font-semibold">createdAt</span>.  
            Minimal, production-ready documentation.
          </p>
        </div>

        {/* Section */}
        <Section title="1️⃣ Base URL">
          <Code>https://api.fasterq.in</Code>
        </Section>

        <Section title="2️⃣ Authentication">
          <p className="mb-4">
            All requests must include the following header:
          </p>
          <Code>Authorization: Bearer YOUR_API_KEY</Code>
          <p className="mt-3 text-sm text-red-600">
            ⚠ Keep your API key secure. Never commit it to version control.
          </p>
        </Section>

        <Section title="3️⃣ Fetch Calls Endpoint">
          <Code>GET /api/integrations/calls</Code>

          <h3 className="text-lg font-semibold mt-6 mb-3">
            Query Parameters
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Parameter</th>
                  <th className="p-3 border">Type</th>
                  <th className="p-3 border">Required</th>
                  <th className="p-3 border">Description</th>
                </tr>
              </thead>
              <tbody>
                <Row param="from" type="ISO UTC" req="Yes" desc="Start date/time" />
                <Row param="to" type="ISO UTC" req="Yes" desc="End date/time" />
                <Row param="page" type="Number" req="No" desc="Pagination page" />
                <Row param="limit" type="Number" req="No" desc="Default 20" />
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="4️⃣ Date Format (UTC Required)">
          <Code>YYYY-MM-DDTHH:MM:SSZ</Code>
          <Code>2026-02-17T05:00:00Z</Code>
        </Section>

        <Section title="5️⃣ Response Structure">
          <CodeBlock>
{`{
  "success": true,
  "data": [
    {
      "answered": true,
      "callId": "call_123456",
      "createdAt": "2026-01-15T10:30:00Z",
      "duration": 180,
      "formattedNumber": "+1 (234) 567-890",
      "inbound": true,
      "number": "+1234567890",
      "phonebookName": "John Doe",
      "recUrl": "https:///call_123456.mp3",
      "startTime": "2026-01-15T10:30:00Z",
      "userId": "user_789",
      "userName": "Agent Smith",
      "userPhone": "+1987654321",
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}`}
          </CodeBlock>
        </Section>

        <Section title="6️⃣ Incremental Sync Logic (IMPORTANT)">
          <p className="mb-4">
            Store the latest <strong>createdAt</strong> in your database.
          </p>

          <Code>lastFetchedCreatedAt = latest createdAt from DB</Code>

          <p className="mt-4 mb-2">Next API call:</p>

          <Code>
            GET /api/integrations/calls?from=lastFetchedCreatedAt&to=currentUTC
          </Code>
        </Section>

        <Section title="7️⃣ Production Safe Sync Algorithm">
          <CodeBlock>
{`lastSync = getLastFetchedCreatedAt()

if lastSync is null:
    lastSync = nowUTC - 1 day

currentUTC = nowUTC
page = 1

do:
    fetch calls (from=lastSync, to=currentUTC, page)

    for each call:
        if callId not in DB:
            insert

    page++

while page <= totalPages

update lastFetchedCreatedAt = highest createdAt`}
          </CodeBlock>
        </Section>

        <Section title="8️⃣ Duplicate Prevention">
          <ul className="list-disc ml-6 space-y-2">
            <li>Always use <strong>callId</strong> as unique key</li>
            <li>Never depend on phone number</li>
            <li>Never depend on duration or time</li>
          </ul>
        </Section>

        <Section title="9️⃣ First Time Sync">
          <Code>from = currentUTC - 24 hours</Code>
          <p className="mt-3">
            After first sync, store the latest <strong>createdAt</strong>.
          </p>
        </Section>

        <Section title="🔟 Recommended Sync Frequency">
          <div className="grid md:grid-cols-3 gap-4">
            <Card title="CRM" value="Every 5–15 minutes" />
            <Card title="ERP" value="Every 30 minutes" />
            <Card title="Basic Systems" value="Every 1–2 hours" />
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t text-sm text-gray-500">
          Fasterq API © {new Date().getFullYear()}  
          <br />
          Secure your API key. Use UTC time. Store createdAt.
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function Section({ title, children }) {
  return (
    <section className="mb-14">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      {children}
    </section>
  );
}

function Code({ children }) {
  return (
    <div className="bg-gray-900 mb-2 text-green-400 px-4 py-3 rounded-lg text-sm font-mono overflow-x-auto">
      {children}
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="bg-gray-900 text-green-400 p-5 rounded-lg text-sm overflow-x-auto">
      <code>{children}</code>
    </pre>
  );
}

function Row({ param, type, req, desc }) {
  return (
    <tr>
      <td className="p-3 border font-medium">{param}</td>
      <td className="p-3 border">{type}</td>
      <td className="p-3 border">{req}</td>
      <td className="p-3 border">{desc}</td>
    </tr>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}
