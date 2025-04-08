'use client';

import { useState, useEffect } from 'react';
import { getIsTestMode, setIsTestMode } from '../lib/mockData';

/**
 * TestModeToggle component provides a UI toggle for switching between test and production modes.
 * The component manages its own state and syncs with the global test mode setting.
 * It includes a visual indicator and hover state for better UX.
 * 
 * @returns {JSX.Element | null} A toggle button for test mode, or null if not mounted
 */
export default function TestModeToggle() {
  // Local state for test mode status
  const [isTestMode, setIsTestModeState] = useState(false);
  // Mount state to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  // Initialize test mode state on mount
  useEffect(() => {
    setIsTestModeState(getIsTestMode());
    setIsMounted(true);
  }, []);

  // Prevent rendering until after hydration
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