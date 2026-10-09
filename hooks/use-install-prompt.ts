"use client";

import { useCallback } from "react";
import { usePwaStore } from "@/stores/pwa-store";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function useInstallPrompt() {
  const deferredPrompt = usePwaStore((s) => s.deferredPrompt);
  const isInstalled = usePwaStore((s) => s.isInstalled);
  const isIos = usePwaStore((s) => s.isIos);
  const clearPrompt = usePwaStore((s) => s.clearPrompt);
  const setIsInstalled = usePwaStore((s) => s.setIsInstalled);

  const canInstall = !isInstalled;

  const install = useCallback(async (): Promise<
    "accepted" | "dismissed" | "ios" | "unavailable"
  > => {
    if (isIos) {
      return "ios";
    }

    if (!deferredPrompt) {
      return "unavailable";
    }

    await (deferredPrompt as BeforeInstallPromptEvent).prompt();
    const { outcome } = await (
      deferredPrompt as BeforeInstallPromptEvent
    ).userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      clearPrompt();
    }

    return outcome;
  }, [deferredPrompt, isIos, clearPrompt, setIsInstalled]);

  return {
    canInstall,
    install,
    isIos,
    isInstalled,
    hasPrompt: !!deferredPrompt,
  };
}