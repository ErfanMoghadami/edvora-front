"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NavLinks } from "./nav-links";
import { InstallButton } from "../pwa/install-button";

const ANIMATION_DURATION = 250;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleClose() {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, ANIMATION_DURATION);
  }

  function handleOpen() {
    setOpen(true);
  }

  const isVisible = open || isClosing;

  const drawer =
    isVisible && mounted
      ? createPortal(
          <>
            <div
              className={cn(
                "fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden",
                isClosing ? "animate-fade-out" : "animate-fade-in",
              )}
              onClick={handleClose}
              aria-hidden="true"
            />

            <aside
              className={cn(
                "fixed right-0 top-0 z-[70] flex h-screen w-72 max-w-[85vw] flex-col border-l border-border bg-card shadow-2xl lg:hidden",
                isClosing
                  ? "animate-slide-out-right"
                  : "animate-slide-in-right",
              )}
              role="dialog"
              aria-modal="true"
              aria-label="منوی ناوبری"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                <Link
                  href={ROUTES.DASHBOARD}
                  onClick={handleClose}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <span className="text-base font-bold text-foreground">
                    {APP_NAME}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="بستن منو"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <NavLinks onItemClick={handleClose} />
              </div>

              <div className="border-t border-border p-4">
                <InstallButton variant="full" onAfterClick={handleClose} />
              </div>
            </aside>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        aria-label="باز کردن منو"
      >
        <Menu className="h-5 w-5" />
      </button>
      {drawer}
    </>
  );
}
