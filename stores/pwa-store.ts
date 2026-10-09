import { create } from "zustand";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PwaState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
  isIos: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  setDeferredPrompt: (event: BeforeInstallPromptEvent | null) => void;
  clearPrompt: () => void;
  setIsInstalled: (v: boolean) => void;
}

export const usePwaStore = create<PwaState>()((set) => ({
  deferredPrompt: null,
  isInstalled: false,
  isIos:
    typeof window !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as unknown as { MSStream?: unknown }).MSStream,
  isAndroid:
    typeof window !== "undefined" && /Android/.test(navigator.userAgent),
  isDesktop:
    typeof window !== "undefined" && !/Mobi|Android/i.test(navigator.userAgent),

  setDeferredPrompt: (event) => set({ deferredPrompt: event }),
  clearPrompt: () => set({ deferredPrompt: null }),
  setIsInstalled: (v) => set({ isInstalled: v }),
}));
