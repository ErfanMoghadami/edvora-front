import type { Metadata } from "next";
import { PaymentsView } from "@/features/payments/components/payments-view";

export const metadata: Metadata = {
  title: "پرداخت‌ها",
};

export default function PaymentsPage() {
  return <PaymentsView />;
}