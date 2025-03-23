'use client';

import { useState, useEffect } from 'react';
import { getIsTestMode, setIsTestMode } from '../lib/mockData';

export default function TestModeToggle() {
  const [isTestMode, setIsTestModeState] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsTestModeState(getIsTestMode());
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <button
      onClick={() => setIsTestMode(!isTestMode)}
      className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                 flex items-center gap-2 bg-white hover:bg-blue-50
                 border border-gray-200 text-gray-900
                 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
      title={isTestMode ? 'Disable Test Mode' : 'Enable Test Mode'}
    >
      <div className={`w-2 h-2 rounded-full ${isTestMode ? 'bg-blue-500' : 'bg-gray-400'}`} />
      {isTestMode ? 'Disable Test Mode' : 'Enable Test Mode'}
    </button>
  );
} 