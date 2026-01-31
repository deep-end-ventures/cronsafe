'use client';

import { isPro } from '@/lib/subscription';
import { useEffect, useState } from 'react';

export function ProBadge() {
  const [pro, setPro] = useState(false);

  useEffect(() => {
    setPro(isPro());
  }, []);

  if (!pro) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-600/20 px-2.5 py-0.5 text-xs font-semibold text-brand-400 border border-brand-600/30">
      ⚡ PRO
    </span>
  );
}
