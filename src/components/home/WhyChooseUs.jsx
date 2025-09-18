import Image from "next/image";
import { CheckCircle, Zap, ShieldCheck, Smartphone } from "lucide-react";
import CtaButton from "../CtaButton";

// Note: The icons in the image are custom SVGs, not directly from lucide-react.
// For this code, I'm using lucide-react as a placeholder.
// To perfectly match the image, you would need to use those specific SVG assets.
const features = [
  { title: "Verified Jobs", icon: <ShieldCheck className="w-8 h-8 text-orange-500" /> }, // Shield icon from lucide-react
  { title: "Fast Hiring", icon: <Zap className="w-8 h-8 text-orange-500" /> }, // Zap icon for speed, best match
  { title: "Trusted Employers", icon: <CheckCircle className="w-8 h-8 text-orange-500" /> }, // CheckCircle for trusted, as a placeholder for people icon
  { title: "Easy Apply", icon: <Smartphone className="w-8 h-8 text-orange-500" /> }, // Smartphone for easy apply, as a placeholder for document icon
];

export default function WhyChooseUs() {
  return (
    <section className="relative bg-white  py-20 overflow-hidden">
      {/* Orange wave/shape in the bottom right */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-tl-full" style={{ transform: 'translateX(50%) translateY(50%)' }}></div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="p-8 md:p-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
             Why Students & Restaurants Choose <span className="text-orange-600">FasterQ</span>
            </h2>
            {/* <p className="mt-3 text-lg text-gray-600">
              We connect talent with opportunities in the hospitality industry
            </p> */}
          </div>

          <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {/* Features surrounding the handshake */}
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center w-36 sm:w-40">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-orange-300 flex items-center justify-center mb-4">
                  {/* The image uses distinct icons, for this code, I'm just showing the Lucide icons.
                      You'd replace this with your specific SVG/Image components. */}
                  {feature.icon}
                </div>
                <p className="text-lg font-semibold text-gray-800">{feature.title}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-16">
            <CtaButton href="/jobs" text="Get Started Today" />
          </div>
        </div>
      </div>
    </section>
  );
}