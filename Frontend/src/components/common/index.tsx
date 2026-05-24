import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 justify-center';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {children}
    </button>
  );
};

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const typeStyles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div className={clsx('border rounded-lg p-4 flex items-center gap-3', typeStyles[type])}>
      <span className="text-xl">{icons[type]}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-xl hover:opacity-70">
          ✕
        </button>
      )}
    </div>
  );
};

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-200 h-16 rounded-lg animate-pulse" />
      ))}
    </div>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={clsx('bg-white rounded-lg shadow-sm border border-gray-200 p-6', className)}>
      {children}
    </div>
  );
};

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children }) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  return <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', variants[variant])}>{children}</span>;
};
