import {
  BarChart3,
  ClipboardList,
  Headphones,
  LayoutDashboard,
  PackageCheck,
  ShoppingCart,
  UserPlus,
  Wrench,
} from "lucide-react";
/** Source of truth for the sidebar navigation. */
export const NAV_ITEMS = [
  { title: "داشبورد", path: "/", icon: LayoutDashboard },
  { title: "روند پیگیری", path: "/follow-ups", icon: ClipboardList, badge: "۱۲" },
  { title: "گزارش‌ها", path: "/reports", icon: BarChart3 },
  { title: "تحویل کالا", path: "/deliveries", icon: PackageCheck, badge: "۳" },
  { title: "تعمیرات", path: "/repairs", icon: Wrench },
  {
    title: "بازاریابی",
    path: "/marketing",
    icon: ShoppingCart,
    children: [
      { title: "کوره", path: "/marketing/kiln" },
      { title: "سیستم جمع‌آوری", path: "/marketing/collection" },
      { title: "باسکول", path: "/marketing/bascul" },
    ],
  },
  { title: "پشتیبانی", path: "/support", icon: Headphones, badge: "۵" },
  { title: "ثبت مشتری", path: "/customers/new", icon: UserPlus },
];
