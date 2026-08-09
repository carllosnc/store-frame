import React from 'react';
import { Star, ShieldCheck, Zap, Award } from 'lucide-react';

export default function SocialBadges({
  badgeType = 'none',
  badgeText = ''
}) {
  if (!badgeType || badgeType === 'none') return null;

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-sm transition-all">
      {badgeType === 'rating' && (
        <div className="flex items-center gap-1.5 text-amber-400">
          <div className="flex -space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-white text-[11px] font-semibold ml-1">{badgeText || '4.9 na App Store'}</span>
        </div>
      )}

      {badgeType === 'pill-tag' && (
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
          <span className="text-white text-[11px] font-semibold">{badgeText || '✦ App do Mês'}</span>
        </div>
      )}

      {badgeType === 'security' && (
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-300 text-[11px] font-semibold">{badgeText || '🔒 100% Criptografado'}</span>
        </div>
      )}

      {badgeType === 'award' && (
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-200 text-[11px] font-bold">{badgeText || '🏆 #1 na Categoria'}</span>
        </div>
      )}
    </div>
  );
}
