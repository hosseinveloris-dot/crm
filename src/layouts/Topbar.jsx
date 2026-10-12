import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, ChevronLeft, Menu, Moon, Search, Sun } from "lucide-react";
import { NAV_ITEMS } from "@/config/nav";
import { useTheme } from "@/hooks/useTheme";
import { Avatar } from "@/components/ui/Avatar";
import { toFaDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
const TITLES = {
  "/": "داشبورد",
  "/follow-ups": "روند پیگیری",
  "/reports": "گزارش‌ها",
  "/deliveries": "تحویل کالا",
  "/repairs": "تعمیرات",
  "/marketing": "بازاریابی",
  "/marketing/kiln": "بازاریابی — کوره",
  "/marketing/collection": "بازاریابی — سیستم جمع‌آوری",
  "/marketing/bascul": "بازاریابی — باسکول",
  "/support": "پشتیبانی",
  "/customers": "مشتریان",
  "/customers/new": "ثبت مشتری",
};
function breadcrumb(pathname) {
  const crumbs = [{ label: "خانه", to: "/" }];
  const parent = NAV_ITEMS.find((item) => item.children && pathname.startsWith(`${item.path}/`));
  if (parent) {
    crumbs.push({ label: parent.title, to: parent.path });
    const child = parent.children?.find((c) => c.path === pathname);
    if (child) crumbs.push({ label: child.title });
  } else if (pathname !== "/") {
    crumbs.push({ label: TITLES[pathname] ?? "صفحه" });
  }
  return crumbs;
}
export function Topbar({ onOpenSidebar }) {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const [notifications] = useState(3);
  const crumbs = breadcrumb(pathname);
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-surface/85 px-3 backdrop-blur sm:h-16 sm:gap-3 sm:px-4 lg:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-muted lg:hidden"
        aria-label="باز کردن منو"
      >
        <Menu className="size-5" />
      </button>
      <span className="truncate text-sm font-semibold text-foreground md:hidden">
        {TITLES[pathname] ?? "سامانه CRM"}
      </span>
      <nav className="hidden items-center gap-1.5 text-xs text-faint md:flex">
        {crumbs.map((crumb, index) => (
          <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <ChevronLeft className="size-3.5" />}
            <span className={cn(index === crumbs.length - 1 && "font-medium text-foreground")}>
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>
      <div className="relative mr-auto hidden w-72 md:block">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
        <input className="input-base pr-9" placeholder="جستجوی مشتری، سفارش یا تیکت..." />
      </div>
      <div className="mr-auto flex items-center gap-0.5 sm:gap-1 md:mr-0">
        <button
          type="button"
          onClick={toggle}
          className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-muted"
          aria-label="تغییر تم"
          title={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
        >
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
        <button
          type="button"
          className="relative grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-muted"
          aria-label="اعلان‌ها"
        >
          <Bell className="size-5" />
          {notifications > 0 && (
            <span className="absolute left-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-danger text-[10px] font-bold text-white">
              {toFaDigits(notifications)}
            </span>
          )}
        </button>
        <div className="mr-1 hidden items-center gap-2 rounded-md px-1.5 py-1 sm:flex">
          <Avatar name="مریم احمدی" className="size-8" />
          <div className="leading-tight">
            <p className="text-xs font-semibold text-foreground">مریم احمدی</p>
            <p className="text-[11px] text-faint">کارشناس فروش</p>
          </div>
        </div>
      </div>
    </header>
  );
}
