import React, { useState } from 'react';
import { ITRank } from '../utils/gamification';

interface RankAvatarProps {
  rank: ITRank;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBadgeBorder?: boolean;
  className?: string;
}

export const RankAvatar: React.FC<RankAvatarProps> = ({
  rank,
  size = 'md',
  showBadgeBorder = true,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Size styles lookup
  const sizeMap = {
    xs: 'w-6 h-6 text-xs rounded-lg',
    sm: 'w-8 h-8 text-sm rounded-xl',
    md: 'w-10 h-10 text-base rounded-xl',
    lg: 'w-14 h-14 text-2xl rounded-2xl',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 text-4xl rounded-3xl',
    '2xl': 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-5xl rounded-[2rem]',
  };

  const containerClasses = `${sizeMap[size]} shrink-0 relative overflow-hidden flex items-center justify-center bg-slate-800 border ${
    showBadgeBorder ? 'border-amber-500/40 shadow-sm' : 'border-slate-700/60'
  } ${className}`;

  return (
    <div 
      className={containerClasses}
      title={`${rank.title}: «${rank.subtitle}»`}
    >
      {!imageError && rank.memeImage ? (
        <img
          src={rank.memeImage}
          alt={rank.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-[inherit]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="select-none">{rank.icon}</span>
      )}
    </div>
  );
};

