interface HeaderProps {
  title: string;
  onClose?: () => void;
}

export default function Header({ title, onClose }: HeaderProps) {
  return (
    <header className="relative h-[60px] w-full bg-white border-b border-gray-100">
      {/* Title - centered */}
      <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center">
        <h1 className="text-[18px] font-medium text-black leading-normal">
          {title}
        </h1>
      </div>
      
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-[18px] top-1/2 -translate-y-1/2 w-[30px] h-[30px] flex items-center justify-center"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </header>
  );
}
