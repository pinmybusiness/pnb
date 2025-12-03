import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Sales Director, TechFlow India",
    image: "/images/trackly/avatars/user1.webp",
    quote: "Trackly transformed our sales process. We now track every lead from SIM calls without any manual entry. The WhatsApp reports are a game-changer for my morning reviews.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Founder, EstatePro",
    image: "/images/trackly/avatars/user2.webp",
    quote: "Finally, a solution that works with our existing mobile numbers! No more VOIP quality issues. My team loves that they don't have to learn a new app.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    role: "VP Sales, GrowthX",
    image: "/images/trackly/avatars/user3.webp",
    quote: "The integration with Salesforce is seamless. We've seen a 30% increase in lead retention since we started using Trackly. Highly recommended for Indian sales teams.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[#FFF5EC] via-white to-orange-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16" data-animate="fade-up">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#FF5211]/10 to-orange-100 text-[#FF5211] rounded-full text-sm font-semibold mb-4 border border-[#FF5211]/20">
            ❤️ Loved by Sales Teams
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Trusted by <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">India's Best</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            See why fast-growing companies choose Trackly to power their sales operations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8" data-stagger-parent data-stagger="0.1" data-stagger-duration="0.6" data-stagger-offset="24">
          {testimonials.map((testimonial, i) => (
            <div 
              key={i} 
              data-stagger-item
              className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-2 flex flex-col h-full"
            >
              <div className="absolute top-6 right-8 text-[#FF5211]/10 group-hover:text-[#FF5211]/20 transition-colors">
                <Quote size={48} fill="currentColor" />
              </div>
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-8 flex-grow italic relative z-10">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md relative z-10"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-[#FF5211] transition-colors">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
