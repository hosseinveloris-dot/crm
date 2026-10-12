import { ClipboardList, Headphones, PackageCheck, Users, Wallet, Wrench } from "lucide-react";
export const kpis = [
  {
    id: "k1",
    title: "مشتریان فعال",
    value: "۱٬۲۴۸",
    change: 8.4,
    hint: "نسبت به ماه گذشته",
    icon: Users,
    tone: "brand",
  },
  {
    id: "k2",
    title: "درآمد این ماه",
    value: "۴٫۲ میلیارد تومان",
    change: 12.1,
    hint: "نسبت به ماه گذشته",
    icon: Wallet,
    tone: "success",
  },
  {
    id: "k3",
    title: "در حال پیگیری",
    value: "۱۲",
    change: -3.2,
    hint: "پرونده باز",
    icon: ClipboardList,
    tone: "warning",
  },
  {
    id: "k4",
    title: "تحویل در مسیر",
    value: "۳",
    change: 2.0,
    hint: "سفارش امروز",
    icon: PackageCheck,
    tone: "info",
  },
];
export const miniStats = [
  { id: "s1", title: "پرونده‌های تعمیرات", value: "۲۴", icon: Wrench },
  { id: "s2", title: "تیکت‌های پشتیبانی باز", value: "۵", icon: Headphones },
];
export const salesTrend = [
  { month: "مهر", sales: 62, leads: 41 },
  { month: "آبان", sales: 74, leads: 48 },
  { month: "آذر", sales: 58, leads: 52 },
  { month: "دی", sales: 88, leads: 61 },
  { month: "بهمن", sales: 79, leads: 57 },
  { month: "اسفند", sales: 95, leads: 68 },
];
export const channelMix = [
  { label: "کوره", value: 42, tone: "#0E9AA7" },
  { label: "سیستم جمع‌آوری", value: 33, tone: "#06253A" },
  { label: "باسکول", value: 25, tone: "#4BADB8" },
];
export const activities = [
  {
    id: "a1",
    title: "قرارداد جدید ثبت شد",
    description: "قرارداد سالانه صنایع فولاد پارس",
    time: "۲۰ دقیقه پیش",
    tone: "success",
  },
  {
    id: "a2",
    title: "پرونده تعمیرات به‌روزرسانی شد",
    description: "REP-2002 — خطای سنسور باسکول",
    time: "۱ ساعت پیش",
    tone: "warning",
  },
  {
    id: "a3",
    title: "تیکت پشتیبانی جدید",
    description: "SUP-3003 — تاخیر در تحویل سفارش",
    time: "۳ ساعت پیش",
    tone: "danger",
  },
  {
    id: "a4",
    title: "مشتری جدید ثبت شد",
    description: "بهرام اسدی — پتروشیمی خلیج فارس",
    time: "دیروز",
    tone: "brand",
  },
];
