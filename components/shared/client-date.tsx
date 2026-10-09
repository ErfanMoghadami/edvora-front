"use client";

import { toJalaali } from "jalaali-js";

interface ClientDateProps {
  date: string | Date;
  fallback?: string;
}

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

function isoToJalaaliText(iso: string): string {
  if (!iso || iso.length < 10) return "";
  const datePart = iso.slice(0, 10);
  const [gy, gm, gd] = datePart.split("-").map(Number);
  if ([gy, gm, gd].some((n) => isNaN(n))) return "";

  const { jy, jm, jd } = toJalaali(gy, gm, gd);

  return `${toPersianDigits(jd)} ${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)}`;
}

export function ClientDate({ date, fallback = "—" }: ClientDateProps) {
  if (typeof date === "string") {
    const text = isoToJalaaliText(date);
    return <span>{text || fallback}</span>;
  }

  const iso = date.toISOString().slice(0, 10);
  const text = isoToJalaaliText(iso);
  return <span>{text || fallback}</span>;
}