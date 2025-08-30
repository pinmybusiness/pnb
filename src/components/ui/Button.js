// components/ui/Button.jsx
const Button = ({ 
  children, 
  variant = "primary", 
  className = "", 
  ...props 
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "px-4 py-2 bg-primary text-white hover:bg-primary/90",
    gradient:
      "px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 shadow-md",
    outline:
      "px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
