import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <FileQuestion className="h-10 w-10" />
      </div>
      <h1 className="mb-3 text-5xl font-bold text-primary">۴۰۴</h1>
      <h2 className="mb-3 text-xl font-semibold text-foreground">
        صفحه‌ای که دنبالش بودید پیدا نشد
      </h2>
      <p className="mb-8 max-w-md text-sm text-muted-foreground">
        ممکن است آدرس اشتباه وارد شده باشد یا این صفحه حذف شده باشد.
      </p>
      <Link href="/" className={buttonVariants()}>
        بازگشت به خانه
      </Link>
    </div>
  );
}