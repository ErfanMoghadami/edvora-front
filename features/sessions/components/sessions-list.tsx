"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ClientDate } from "@/components/shared/client-date";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getInitials } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useDeleteSession } from "@/features/students/hooks/use-student-sessions";
import { SessionStatusBadge } from "./session-status-badge";
import type { SessionWithStudent } from "@/types/session";

interface SessionsListProps {
  sessions: SessionWithStudent[];
  hasAny: boolean;
}

export function SessionsList({ sessions, hasAny }: SessionsListProps) {
  const deleteSession = useDeleteSession();
  const [toDelete, setToDelete] = useState<SessionWithStudent | null>(null);

  function handleConfirmDelete() {
    if (toDelete) {
      deleteSession(toDelete.id);
    }
  }

  if (!hasAny) {
    return (
      <EmptyState
        icon={<Calendar className="h-8 w-8" />}
        title="هنوز جلسه‌ای ثبت نشده"
        description="از صفحه شاگردها، اولین جلسه را ثبت کنید"
      />
    );
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-8 w-8" />}
        title="جلسه‌ای پیدا نشد"
        description="فیلترها را تغییر دهید"
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card lg:block">
        <div className="overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur">
              <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3 text-right font-medium">شاگرد</th>
                <th className="px-4 py-3 text-right font-medium">تاریخ</th>
                <th className="px-4 py-3 text-right font-medium">مدت</th>
                <th className="px-4 py-3 text-right font-medium">وضعیت</th>
                <th className="px-4 py-3 text-right font-medium">یادداشت</th>
                <th className="w-16 px-4 py-3 text-left font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="group transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`${ROUTES.STUDENTS}/${session.studentId}`}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                        {getInitials(session.studentName)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {session.studentName}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {session.studentPhone}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      <ClientDate date={session.date} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {session.duration} دقیقه
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <SessionStatusBadge status={session.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      {session.note || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => setToDelete(session)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="حذف جلسه"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`${ROUTES.STUDENTS}/${session.studentId}`}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {getInitials(session.studentName)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {session.studentName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <ClientDate date={session.date} /> — {session.duration}{" "}
                    دقیقه
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setToDelete(session)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label="حذف جلسه"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <SessionStatusBadge status={session.status} />
              {session.note && (
                <span className="max-w-[180px] truncate text-xs text-muted-foreground">
                  {session.note}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="حذف جلسه"
        description={
          toDelete
            ? `آیا مطمئنید که می‌خواهید جلسه «${toDelete.studentName}» را حذف کنید؟ این عمل قابل بازگشت نیست.`
            : ""
        }
        confirmLabel="حذف کن"
      />
    </>
  );
}