import { WifiOff } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: "آفلاین",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <WifiOff className="h-10 w-10" />
      </div>
      <h1 className="mb-3 text-2xl font-bold text-foreground">
        اتصال به اینترنت قطع است
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        لطفاً اتصال خود را بررسی کنید. برخی صفحات {APP_NAME} به صورت آفلاین در
        دسترس هستند.
      </p>
    </div>
  );
}