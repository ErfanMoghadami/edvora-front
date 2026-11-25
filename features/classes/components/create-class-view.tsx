"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useCreateClass } from "../hooks/use-classes";
import { ClassForm } from "./class-form";

export function CreateClassView() {
  const createClass = useCreateClass();

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <Link
        href={ROUTES.CLASSES}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به کلاس‌ها
      </Link>

      <ClassForm onSubmit={createClass} />
    </div>
  );
}
