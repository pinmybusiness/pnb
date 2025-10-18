// "use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CtaButton = ({ href, text, size = "lg", className = "", variant = "primary" }) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl";
  const sizeClasses = {
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };
  const variantClasses = {
    primary: "bg-[#FF5211] text-white hover:bg-[#FF8C00]",
    secondary: "bg-transparent text-[#FF5211] border-2 border-[#FF5211] hover:bg-[#FF5211] hover:text-white",
  };

  return (
    <Link
      href={href}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {text}
      {variant === "primary" && <ArrowRight className="ml-2 h-4 w-4" />}
    </Link>
  );
};

export default CtaButton;