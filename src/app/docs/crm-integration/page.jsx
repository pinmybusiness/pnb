export const metadata = {
  title: "CRM Integration - FasterQ Developer Docs",
  description:
    "Integrate your CRM with FasterQ. FasterQ automatically pushes call logs to your CRM after every call.",
};

export default function CrmIntegrationDocs() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-14 pb-10 border-b">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#FF5211] mb-3">
            Developer Docs
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CRM Integration
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            FasterQ automatically pushes call data to your CRM after every call.
            You provide your CRM endpoint - FasterQ handles the rest.
          </p>
        </div>

        {/* How it works */}
        <Section title="How it works">
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <Step num="1" label="Agent makes / receives a call" />
            <Step num="2" label="FasterQ captures call data" />
            <Step num="3" label="FasterQ POSTs to your CRM URL" />
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Failed pushes are retried automatically up to <strong>5 times</strong> with exponential backoff.
            You can also trigger a manual retry from the dashboard.
          </p>
        </Section>

        {/* What you give FasterQ */}
        <Section title="What you provide">
          <p className="mb-4 text-gray-600">
            Configure your CRM credentials once from the FasterQ dashboard or via API.
            FasterQ stores them encrypted.
          </p>
          <Table
            heads={["Field", "Type", "Required", "Description"]}
            rows={[
              ["callLogUrl",    "URL",    "Yes", "The endpoint FasterQ will POST call data to"],
              ["accessKey",     "String", "Yes", "Your CRM API access key"],
              ["secretKey",     "String", "Yes", "Your CRM API secret key"],
              ["displayNumber", "String", "No",  "Caller ID to show inside your CRM (LeadSquared only)"],
            ]}
          />
        </Section>

        {/* What FasterQ sends */}
        <Section title="What FasterQ sends you">
          <p className="mb-4 text-gray-600">
            After every call, FasterQ sends a <strong>POST</strong> request to your <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">callLogUrl</code> with this JSON body:
          </p>
          <CodeBlock>{`POST {your callLogUrl}
Content-Type: application/json

{
  "callId":       "664abc123def456789000001",
  "fromNumber":   "9876543210",
  "userPhone":    "9123456789",
  "agentName":    "Rahul Sharma",
  "startTime":    "2026-04-15T08:30:00.000Z",
  "duration":     142,
  "answered":     true,
  "inbound":      true,
  "recordingUrl": "https://cdn.fasterq.in/recordings/call_001.mp3"
}`}</CodeBlock>

          <Table
            heads={["Field", "Type", "Description"]}
            rows={[
              ["callId",       "String",  "Unique call ID (ObjectId)"],
              ["fromNumber",   "String",  "Caller's 10-digit phone number"],
              ["userPhone",    "String",  "Agent's phone number"],
              ["agentName",    "String",  "Agent's display name"],
              ["startTime",    "ISO UTC", "When the call started"],
              ["duration",     "Number",  "Call duration in seconds"],
              ["answered",     "Boolean", "true = answered, false = missed"],
              ["inbound",      "Boolean", "true = incoming, false = outgoing"],
              ["recordingUrl", "String",  "S3 URL of recording (null if unavailable)"],
            ]}
          />
        </Section>

        {/* Expected response */}
        <Section title="Expected response from your CRM">
          <p className="mb-4 text-gray-600">
            FasterQ expects a <strong>2xx HTTP status</strong> to mark the sync as successful.
            Any non-2xx response will trigger a retry.
          </p>
          <CodeBlock>{`HTTP 200 OK
{
  "status": "success"
}`}</CodeBlock>
          <p className="mt-4 text-sm text-gray-500">
            The response body is not parsed - only the HTTP status code matters.
          </p>
        </Section>

        {/* Setup from dashboard */}
        <Section title="Setup">
          <p className="text-gray-600">
            CRM integration is configured directly from your <strong>FasterQ dashboard</strong> under{" "}
            <strong>Settings → CRM Integration</strong>. No API calls needed for setup.
            Enter your CRM credentials there and hit <strong>Test Connection</strong> to verify before enabling.
          </p>
        </Section>

      </div>
    </div>
  );
}

/* ─── Components ─── */

function Section({ title, children }) {
  return (
    <section className="mb-14">
      <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Step({ num, label }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
      <div className="w-8 h-8 rounded-full bg-[#FF5211] text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
        {num}
      </div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="bg-gray-900 text-green-400 p-5 rounded-lg text-sm font-mono overflow-x-auto mb-4 whitespace-pre">
      <code>{children}</code>
    </pre>
  );
}

function Table({ heads, rows }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            {heads.map((h) => (
              <th key={h} className="px-4 py-3 border-b border-gray-200 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-gray-600">
                  {j === 0
                    ? <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">{cell}</code>
                    : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
