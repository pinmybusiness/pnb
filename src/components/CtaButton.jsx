// components/CtaButton.jsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Size variants
const SIZE_VARIANTS = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-lg',
  lg: 'px-8 py-4 text-lg rounded-xl',
  xl: 'px-10 py-5 text-xl rounded-2xl',
};

// Icon sizes
const ICON_SIZES = {
  sm: 'w-3 h-3 ml-1',
  md: 'w-4 h-4 ml-2',
  lg: 'w-5 h-5 ml-2',
  xl: 'w-6 h-6 ml-3',
};

const CtaButton = ({
  href,
  text,
  showIcon = true,
  icon: Icon = ArrowRight,
  size = 'lg',
  variant = 'filled',
  className = '',
  onClick,
  asButton = false, // new prop: render as button
}) => {
  const sizeClasses = SIZE_VARIANTS[size] || SIZE_VARIANTS.md;
  const iconClasses = ICON_SIZES[size] || ICON_SIZES.md;

  const variantClasses =
    variant === 'outline'
      ? `bg-transparent text-primary border border-primary hover:bg-primary/10`
      : `bg-primary text-white hover:bg-primary/90`;

  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold shadow-lg
    transition-all duration-300 transform hover:scale-105
    focus:outline-none focus:ring-4 focus:ring-primary/30
    ${sizeClasses} ${variantClasses} ${className}
  `;

  if (asButton) {
    return (
      <button type="button" onClick={onClick} className={baseClasses}>
        {text}
        {showIcon && <Icon className={iconClasses} />}
      </button>
    );
  }

  return (
    <Link href={href} className={baseClasses}>
      {text}
      {showIcon && <Icon className={iconClasses} />}
    </Link>
  );
};

export default CtaButton;