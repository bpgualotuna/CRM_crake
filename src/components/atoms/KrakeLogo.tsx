import React from 'react';

interface KrakeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const KrakeLogo: React.FC<KrakeLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Imagotype Icon */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0B0F19] to-[#161F30] p-1.5 border border-[#1F2B3E] shadow-sm shrink-0 ${
          isSm ? 'w-8 h-8' : isLg ? 'w-12 h-12' : 'w-10 h-10'
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Octopus head */}
          <path
            d="M50 12C38 12 30 22 30 36C30 46 36 54 42 58C36 60 22 62 16 50C14 46 10 48 10 52C10 66 26 74 36 70C30 76 22 84 26 90C28 93 33 91 35 88C38 82 43 74 50 74C57 74 62 82 65 88C67 91 72 93 74 90C78 84 70 76 64 70C74 74 90 66 90 52C90 48 86 46 84 50C78 62 64 60 58 58C64 54 70 46 70 36C70 22 62 12 50 12Z"
            fill="currentColor"
            className="text-white dark:text-white"
          />
          {/* Glowing Red Eyes */}
          <ellipse cx="43" cy="36" rx="4.5" ry="3.2" transform="rotate(-15 43 36)" fill="#E50914" />
          <ellipse cx="57" cy="36" rx="4.5" ry="3.2" transform="rotate(15 57 36)" fill="#E50914" />
          {/* Eye inner glint */}
          <circle cx="43.5" cy="35" r="1.2" fill="#FFA5A5" />
          <circle cx="56.5" cy="35" r="1.2" fill="#FFA5A5" />
          {/* Laptop & Phone symbol */}
          <rect x="36" y="55" width="28" height="18" rx="2" fill="#E50914" />
          <rect x="39" y="58" width="22" height="12" rx="1" fill="#0B0F19" />
          <circle cx="50" cy="64" r="2.5" fill="#E50914" />
          <path d="M33 73H67L69 76H31L33 73Z" fill="#94A3B8" />
        </svg>
      </div>

      {/* Typography: KRAKE DEV */}
      <div className="flex flex-col">
        <div className="flex items-baseline tracking-tight font-extrabold leading-none">
          <span
            className={`font-black tracking-tight text-[#0F172A] dark:text-[#F9FAFB] ${
              isSm ? 'text-base' : isLg ? 'text-2xl' : 'text-lg'
            }`}
          >
            KRAKE
          </span>
          <span
            className={`font-black tracking-tight text-[#E50914] ml-0.5 ${
              isSm ? 'text-base' : isLg ? 'text-2xl' : 'text-lg'
            }`}
          >
            DEV
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[#64748B] dark:text-[#94A3B8] font-medium tracking-wide mt-0.5 ${
              isSm ? 'text-[9px]' : 'text-[10px]'
            }`}
          >
            Escuela de Programación
          </span>
        )}
      </div>
    </div>
  );
};
