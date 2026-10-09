import type { Metadata } from "next";
import { ShareView } from "@/features/share/components/share-view";

export const metadata: Metadata = {
  title: "گزارش شاگرد",
};

export default function SharePage() {
  return <ShareView />;
}