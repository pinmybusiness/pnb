import { 
  Phone, 
  RotateCcw, 
  BarChart3, 
  GitBranch, 
  Shield,
  Check,
  Zap,
} from "lucide-react";
import CtaButton from "@/components/CtaButton";

export default function ProductLanding() {
 const features = [
    {
      icon: Phone,
      title: "Real-Time Alerts",
      description: "Instant notifications for every missed call so you never lose a lead."
    },
    {
      icon: RotateCcw,
      title: "Smart Callbacks",
      description: "One-tap callback with auto-logging and CRM integration."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Beautiful charts that track call trends, ROI, and conversion rates."
    },
    {
      icon: GitBranch,
      title: "Multi-Branch Support",
      description: "Easily manage calls across multiple branches in one place."
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "End-to-end encryption with GDPR compliance built in."
    },
    {
      icon: Zap,
      title: "Boost Conversions",
      description: "Increase sales by responding 30% faster with automated workflows."
    }
  ];

  const pricingFeatures = [
    "Unlimited Projects",
    "Advanced Analytics",
    "Custom Integrations",
    "Priority Support",
    "Unlimited Storage", 
    "AI-Powered Suggestions",
    "Team Collaboration",
    "Cloud Backup",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[80vh] bg-[#FFF5EC] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pt-16 pb-20 sm:pt-24 sm:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Image */}
            <div className="order-2 lg:order-1 flex justify-center">
              <img 
                src="/images/hero-phone.png"
                alt="Restaurant Missed Call Tracker interface" 
                width={400}
                height={500}
                className="drop-shadow-xl"
              />
            </div>
            
            {/* Hero Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h1 className="!text-4xl lg:!text-6xl font-bold leading-tight mb-6">
                No Missed Calls, Only{" "}
                <span className="text-primary">Happy Customers</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                From{" "}
                <span className="font-semibold text-primary">biryani orders</span> to{" "}
                <span className="font-semibold text-primary">family dinner reservations</span>, 
                ensure every call is answered or called back.  
                <br />
                <span className="font-semibold text-primary">First 4 months FREE!</span>
              </p>
              
              <div className="space-y-4">
                <CtaButton 
                  href="#pricing" 
                  text="Start Free Trial" 
                  size="lg"
                  className="mx-auto lg:mx-0 hover:shadow-xl"
                />
                <p className="text-sm text-gray-500">After 4 months: ₹300/month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

 {/* Features Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features, Simple to Use
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              FasterQ makes call tracking effortless, so you can focus on growing your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl p-8 text-center hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-[#FF5211]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Pricing Section */}
 <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFF5EC]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-16">
          Simple Pricing, Big Savings
        </h2>

        <div className="relative bg-white border border-gray-100 shadow-2xl rounded-3xl p-8 sm:p-12 lg:p-16 transition duration-300 hover:shadow-3xl">
          {/* Savings Badge */}
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-red-500 shadow-md">
              Save ₹1200
            </span>
          </div>

          <div className="mb-10">
            <h3 className={`text-3xl font-extrabold primary-color mb-2`}>
              Pro Plan
            </h3>

            <div className="mb-6">
              {/* Main Price Hook - Bigger and Bolder */}
              <div className="text-5xl sm:text-7xl font-extrabold text-gray-900 mb-2 leading-tight">
                ₹0
              </div>
              <div className="text-xl font-semibold text-gray-700">
                for the first <span className="text-2xl text-primary font-bold">4 months</span>
              </div>
              <div className="text-md text-gray-500 mt-2">
                Then just <span className="font-bold">₹300/month</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-y-5 gap-x-8 mb-12 text-left justify-center mx-auto max-w-md md:max-w-xl">
            {pricingFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 mt-0.5 bg-green-50 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600 font-bold" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
          <CtaButton
            href="/contact"
            text="Get Started Free"
            size="xl" // Increased size for better emphasis
            className={`w-full font-bold py-3.5 transition duration-300 hover:shadow-3xl hover:bg-primary-dark`}
          />

          <p className="text-sm text-gray-500 mt-6">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </section>

     {/* CTA Footer Section */}
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
  <div className="max-w-3xl mx-auto text-center relative">
    
    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 leading-snug">
      Ready to <span className="text-primary">serve more customers</span> and <span className="text-primary">never miss a call</span>?
    </h2>
    
    <CtaButton 
      href="#pricing" 
      text="Start Free Trial"
      size="lg"
    />

    <p className="text-gray-500 mt-4 text-sm">
      No credit card required. Cancel anytime.
    </p>
  </div>
</section>

    </div>
  );
}
