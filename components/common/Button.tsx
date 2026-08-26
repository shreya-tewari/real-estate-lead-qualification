'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const sizeStyles: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg',
  };

  const variantStyles: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-2',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-none rounded-full font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-2',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `.trim()}
    >
      {loading ? (
        <span
          style={{
            width: 16,
            height: 16,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.7s linear infinite',
          }}
        />
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
