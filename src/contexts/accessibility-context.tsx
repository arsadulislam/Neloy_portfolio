"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// ─── Types ───────────────────────────────────────────────────
interface AccessibilityState {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
}

interface AccessibilityContextValue extends AccessibilityState {
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
}

const STORAGE_KEY = "a11y-settings";

const defaults: AccessibilityState = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
};

// ─── Context ─────────────────────────────────────────────────
const AccessibilityContext = createContext<AccessibilityContextValue>({
  ...defaults,
  toggleReducedMotion: () => {},
  toggleHighContrast: () => {},
  toggleLargeText: () => {},
});

// ─── Hook ────────────────────────────────────────────────────
export function useAccessibility() {
  return useContext(AccessibilityContext);
}

// ─── Provider ────────────────────────────────────────────────
export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AccessibilityState>(defaults);
  const [mounted, setMounted] = useState(false);

  // Read localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AccessibilityState>;
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, mounted]);

  // Apply CSS classes to <html> element
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    root.classList.toggle("a11y-reduced-motion", state.reducedMotion);
    root.classList.toggle("a11y-high-contrast", state.highContrast);
    root.classList.toggle("a11y-large-text", state.largeText);
  }, [state, mounted]);

  const toggleReducedMotion = useCallback(
    () => setState((s) => ({ ...s, reducedMotion: !s.reducedMotion })),
    []
  );
  const toggleHighContrast = useCallback(
    () => setState((s) => ({ ...s, highContrast: !s.highContrast })),
    []
  );
  const toggleLargeText = useCallback(
    () => setState((s) => ({ ...s, largeText: !s.largeText })),
    []
  );

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        toggleReducedMotion,
        toggleHighContrast,
        toggleLargeText,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}
