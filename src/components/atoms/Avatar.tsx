import React from 'react';
import { UserRole } from '../../types/crm';

interface AvatarProps {
  name?: string;
  role?: UserRole;
  imageUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  role,
  imageUrl,
  size = 'md',
  className = '',
}) => {
  const getInitials = (str: string) => {
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base font-bold',
  };

  const roleRing =
    role === 'admin'
      ? 'ring-2 ring-[#E50914]'
      : role === 'vendedor'
      ? 'ring-2 ring-blue-500'
      : 'ring-1 ring-[#1F2B3E]';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full font-semibold select-none shrink-0 overflow-hidden bg-[#1A2337] text-[#F9FAFB] border border-[#1F2B3E] ${roleRing} ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
