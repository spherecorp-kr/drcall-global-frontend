interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
}

export default function InputField({ 
  label, 
  error,
  rightElement,
  className = '',
  ...props 
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      {/* Label */}
      <label className="text-[14px] text-[#8a8a8a] font-normal leading-normal">
        {label}
      </label>
      
      {/* Input container */}
      <div className="relative flex items-center">
        <input
          className={`flex-1 text-[16px] font-normal leading-normal outline-none bg-transparent border-none p-0 ${
            props.value 
              ? 'text-[#41444b]' 
              : 'text-[#bbbbbb]'
          } placeholder:text-[#bbbbbb] ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="ml-2 flex-shrink-0">
            {rightElement}
          </div>
        )}
      </div>
      
      {/* Bottom line */}
      <div className={`h-[1px] w-full ${error ? 'bg-[#fc0606]' : 'bg-[#d9d9d9]'}`} />
      
      {/* Error message */}
      {error && (
        <p className="text-[14px] text-[#fc0606] font-normal leading-normal">
          {error}
        </p>
      )}
    </div>
  );
}
