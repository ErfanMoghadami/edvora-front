"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Pencil, Share2, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ROUTES } from "@/lib/constants";
import { useDeleteStudent } from "../hooks/use-students";
import type { Student } from "@/types/student";
import { toast } from "sonner";

interface StudentHeaderProps {
  student: Student;
}

export function StudentHeader({ student }: StudentHeaderProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const remove = useDeleteStudent();

  async function handleShare() {
    const url = `${window.location.origin}/share/${student.shareToken}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast.success("لینک اشتراک‌گذاری کپی شد");
    } catch {
      toast.error("خطا در کپی لینک");
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href={ROUTES.STUDENTS}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="h-3 w-3" />
            بازگشت به شاگردها
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {student.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            type="button"
          >
            <Share2 className="h-4 w-4" />
            اشتراک‌گذاری
          </Button>

          <Link
            href={`${ROUTES.STUDENTS}/${student.id}/edit`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Pencil className="h-4 w-4" />
            ویرایش
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            type="button"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            حذف
          </Button>
        </div>
      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="حذف شاگرد"
        description={`آیا مطمئنید که می‌خواهید «${student.name}» را حذف کنید؟ این عمل قابل بازگشت نیست.`}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              type="button"
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={() => remove(student.id, student.name)}
              type="button"
            >
              حذف کن
            </Button>
          </>
        }
      />
    </>
  );
}
