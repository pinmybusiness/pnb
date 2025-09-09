import Image from "next/image";
import CtaButton from "../CtaButton";

const jobRoles = [
  { title: "Chef", image: "/images/jobs/chef.webp" },
  { title: "Manager", image: "/images/jobs/manager.webp" },
  { title: "Waiter/Waitress", image: "/images/jobs/waiter.webp" },
  { title: "Bartender", image: "/images/jobs/bartender.webp" },
  { title: "Host/Hostess", image: "/images/jobs/host.webp" },
  { title: "Dishwasher", image: "/images/jobs/dishwasher.webp" },
  { title: "Barista", image: "/images/jobs/barista.webp" },
  { title: "Sous Chef", image: "/images/jobs/souschef.webp" },
];

export default function PopularJobRoles() {
  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Heading */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
          Explore the Most In-Demand <span className="text-orange-600">Restaurant Jobs</span>
        </h2>
        {/* <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Explore the most in-demand jobs in India’s hospitality industry
        </p> */}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
        {jobRoles.map((role, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl hover:shadow-xl transition-all duration-500 flex items-center p-3 sm:p-4 md:p-5"
          >
            {/* Image */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 rounded-full bg-gradient-to-tr from-orange-50 to-amber-50 flex items-center justify-center overflow-hidden">
              <Image
                src={role.image}
                alt={role.title}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Title */}
            <div className="ml-3 sm:ml-4 md:ml-5">
              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                {role.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-14 sm:mt-20">
        <CtaButton href="/jobs" text="Explore Job Roles" />
      </div>
    </section>
  );
}
