interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'disabled';
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  disabled,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "w-full h-[70px] text-[18px] font-medium text-white leading-normal flex items-center justify-center";
  
  const getBackgroundColor = () => {
    if (disabled) return 'bg-[#bbbbbb]';
    if (variant === 'primary') return 'bg-[#00a0d2]';
    return 'bg-[#bbbbbb]';
  };

  return (
    <button
      className={`${baseStyles} ${getBackgroundColor()} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
