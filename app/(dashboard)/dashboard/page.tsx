import { Greeting } from "@/features/dashboard/components/greeting";
import { StatsCards } from "@/features/dashboard/components/stats-cards";

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Greeting />
      <StatsCards />
    </div>
  );
}