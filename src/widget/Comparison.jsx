import CtaButton from "@/components/CtaButton";

export default function ComparisonWidget({
  badge = "See the Difference",
  title = "Fasterq vs The Rest",
  subtitle = "Built specifically for Indian sales teams — not adapted from expensive enterprise tools.",
  columns = [],
  rows = [],
  highlightIndex = 1, // Fasterq column
}) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/20 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#FF5211] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-xs font-bold tracking-wider text-[#F79533] uppercase mb-2">
            {badge}
          </div>

          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">
            {title}
          </h2>

          <p className="text-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white">

          <table className="min-w-full text-sm">

            {/* Head */}
            <thead>
              <tr className="bg-gray-900 text-white">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-5 py-4 text-left font-semibold ${
                      i === highlightIndex
                        ? "bg-gradient-to-r from-[#FF5211] to-orange-600 text-white"
                        : ""
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`px-5 py-4 ${
                        i === 0
                          ? "font-semibold text-gray-900 bg-gray-50"
                          : ""
                      } ${
                        i === highlightIndex
                          ? "bg-[#FF5211]/5 font-semibold text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            Still comparing? Try Fasterq risk-free.
          </p>

           <CtaButton
              href='/contact'
              text="Start Free Trial"
              className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-xl hover:scale-105"
            />
        </div>

      </div>
    </section>
  );
}