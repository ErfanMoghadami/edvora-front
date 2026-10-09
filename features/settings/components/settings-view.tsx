"use client";

import { useState } from "react";
import { User, Lock, LogOut, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "./profile-form";
import { ChangePasswordForm } from "./change-password-form";
import { DangerZone } from "./danger-zone";

type TabId = "profile" | "security" | "danger";

interface Tab {
  id: TabId;
  label: string;
  description: string;
  icon: LucideIcon;
}

const TABS: Tab[] = [
  {
    id: "profile",
    label: "پروفایل",
    description: "نام و شماره موبایل",
    icon: User,
  },
  {
    id: "security",
    label: "امنیت",
    description: "تغییر رمز عبور",
    icon: Lock,
  },
  {
    id: "danger",
    label: "خروج از حساب",
    description: "خروج از حساب",
    icon: LogOut,
  },
];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="تنظیمات"
        description="پروفایل و امنیت حساب خود را مدیریت کنید"
      />

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
        <nav className="lg:sticky lg:top-20">
          <div className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "group flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-right transition-all lg:w-full",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span className="text-sm font-medium whitespace-nowrap lg:whitespace-normal">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="min-w-0 animate-fade-in" key={activeTab}>
          {activeTab === "profile" && <ProfileForm />}
          {activeTab === "security" && <ChangePasswordForm />}
          {activeTab === "danger" && <DangerZone />}
        </div>
      </div>
    </div>
  );
}