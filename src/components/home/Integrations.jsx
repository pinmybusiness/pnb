import CtaButton from "./CtaButton";

const integrations = [
  { name: "Zoho", link: "#salesforce" },
  { name: "HubSpot", link: "#hubspot" },
  { name: "LeadSquared", link: "#leadsquared" },
  { name: "Microsoft Dynamics", link: "#dynamics" },
  { name: "API & Webhooks", link: "#api" },
];

export default function Integrations() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#FFF5EC] via-white to-orange-50/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16" data-animate="fade-up">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#FF5211]/10 to-orange-100 text-[#FF5211] rounded-full text-sm font-semibold mb-4 border border-[#FF5211]/20">
            🔗 Powerful Integrations
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Seamless CRM <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Integrations</span>
          </h2>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Connect FasterQ effortlessly with your favorite CRM platforms - from
            Salesforce to LeadSquared. No setup headaches, just smooth syncing.
          </p>
          <div className="hidden md:flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Auto Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Secure Connection</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6" data-stagger-parent data-stagger="0.08" data-stagger-duration="0.6" data-stagger-offset="24">
          {integrations.map((int, i) => (
            <div
              key={i}
              data-stagger-item
              className="group relative bg-white p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/5 group-hover:to-orange-500/5 rounded-3xl transition-all duration-500"></div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FF5211] to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                Ready
              </div>
              <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-gray-50 to-white p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <img
                    src={`/images/trackly/integrations/${int.name
                      .toLowerCase()
                      .replace(/\s/g, "-")}.png`}
                    alt={`${int.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-base text-center group-hover:text-[#FF5211] transition-colors duration-300">
                {int.name}
              </h3>
              <div className="mt-4 h-1 w-0 bg-gradient-to-r from-[#FF5211] to-orange-400 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center" data-animate="fade-up" data-delay="0.4">
          <p className="text-gray-600 mb-6">Don't see your CRM? We're adding more integrations every month.</p>
          <CtaButton
            href="/contact"
            text="Request Integration"
            className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white hover:shadow-2xl hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}