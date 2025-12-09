import React from 'react';

interface GlowButtonProps {
  variant?: 'primary' | 'danger' | 'ghost';
  size?: 'lg' | 'md' | 'sm';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

export function GlowButton({
  variant = 'primary',
  size = 'lg',
  disabled = false,
  onClick,
  children,
}: GlowButtonProps) {
  const baseStyles = "font-mono font-bold rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 select-none";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-8 py-4 text-xl tracking-wider",
  };

  const variantStyles = {
    primary: "bg-[#FF1744] text-black shadow-[0_0_20px_rgba(255,23,68,0.6)] hover:shadow-[0_0_30px_rgba(255,23,68,0.8)] hover:bg-[#FF4569] border border-[#FF1744]",
    danger: "bg-[#7C3AED] text-white shadow-[0_0_20px_rgba(124,58,237,0.6)] hover:shadow-[0_0_30px_rgba(124,58,237,0.8)] hover:bg-[#8B5CF6] border border-[#7C3AED]",
    ghost: "bg-transparent text-[#9CA3AF] border border-[#374151] hover:border-[#FF1744] hover:text-[#F9F5FF] hover:shadow-[0_0_10px_rgba(255,23,68,0.3)]",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed shadow-none hover:shadow-none hover:bg-opacity-100";

  const className = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabled ? disabledStyles : ''}
  `;

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
