import * as yup from "yup";
import type {
  ProgramType,
  RateType,
  PaymentType,
} from "@/types/student";

export const studentSchema = yup.object({
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

  notes: yup.string().trim().default(""),

  programType: yup
    .string()
    .oneOf(["weekly", "monthly"], "نوع برنامه را انتخاب کنید")
    .required("نوع برنامه را انتخاب کنید"),

  sessionsCount: yup
    .number()
    .typeError("تعداد جلسات را وارد کنید")
    .min(1, "حداقل ۱ جلسه")
    .max(31, "حداکثر ۳۱ جلسه")
    .required("تعداد جلسات را وارد کنید"),

  sessionDuration: yup
    .number()
    .typeError("مدت جلسه را انتخاب کنید")
    .min(15, "حداقل ۱۵ دقیقه")
    .max(300, "حداکثر ۳۰۰ دقیقه")
    .required("مدت جلسه را انتخاب کنید"),

  rateType: yup
    .string()
    .oneOf(["hourly", "per_session"], "نوع نرخ را انتخاب کنید")
    .required("نوع نرخ را انتخاب کنید"),

  rateAmount: yup
    .number()
    .typeError("مبلغ را وارد کنید")
    .min(1000, "مبلغ باید حداقل ۱٬۰۰۰ تومان باشد")
    .required("مبلغ را وارد کنید"),

  paymentType: yup
    .string()
    .oneOf(["per_session", "lump_sum"], "نوع تسویه را انتخاب کنید")
    .required("نوع تسویه را انتخاب کنید"),

  startDate: yup.string().required("تاریخ شروع الزامی است"),
});

export type StudentFormValues = {
  name: string;
  phone: string;
  notes?: string;
  programType: ProgramType | undefined;
  sessionsCount: number | undefined;
  sessionDuration: number | undefined;
  rateType: RateType | undefined;
  rateAmount: number | undefined;
  paymentType: PaymentType | undefined;
  startDate: string;
};