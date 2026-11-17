import * as yup from "yup";
import { calcDuration } from "./weekdays";

export const classSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "نام کلاس باید حداقل ۲ کاراکتر باشد")
    .required("نام کلاس الزامی است"),

  termId: yup.string().required("ترم را انتخاب کنید"),

  weekdays: yup
    .array()
    .of(yup.number().required())
    .min(1, "حداقل یک روز هفته انتخاب کنید")
    .required("حداقل یک روز هفته انتخاب کنید"),

  startTime: yup.string().required("ساعت شروع را وارد کنید"),

  endTime: yup
    .string()
    .required("ساعت پایان را وارد کنید")
    .test(
      "after-start",
      "ساعت پایان باید بعد از ساعت شروع باشد",
      function (value) {
        const { startTime } = this.parent as { startTime?: string };
        if (!value || !startTime) return true;
        return calcDuration(startTime, value) !== null;
      }
    ),
});

export type ClassFormValues = {
  name: string;
  termId: string;
  weekdays: number[];
  startTime: string;
  endTime: string;
};

export const quickStudentSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "نام باید حداقل ۳ کاراکتر باشد")
    .required("نام و نام خانوادگی الزامی است"),
  phone: yup
    .string()
    .trim()
    .matches(/^09\d{9}$/, "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد")
    .required("شماره موبایل الزامی است"),
});

export type QuickStudentFormValues = {
  name: string;
  phone: string;
};

export const termSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "نام ترم باید حداقل ۲ کاراکتر باشد")
    .required("نام ترم الزامی است"),
});

export type TermFormValues = { name: string };