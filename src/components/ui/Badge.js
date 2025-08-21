const Badge = ({ children, variant = "secondary", className = "" }) => {
  const variantClasses = {
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-800",
  };
  
  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;