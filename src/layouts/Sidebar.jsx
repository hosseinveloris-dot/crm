import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, LifeBuoy, X } from "lucide-react";
import { NAV_ITEMS } from "@/config/nav";
import { cn } from "@/lib/utils";
/* -------------------------------------------------------------------------- */
/*                                Single item                                 */
/* -------------------------------------------------------------------------- */
function ItemLink({ item, onNavigate }) {
  const { pathname } = useLocation();
  const { title, path, icon: Icon, badge, children } = item;
  const isActive = useMemo(() => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  }, [path, pathname]);
  const [open, setOpen] = useState(isActive && Boolean(children));
  const baseClass = cn(
    "group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-sidebar-active text-white shadow-sm"
      : "text-sidebar-muted hover:bg-white/5 hover:text-white",
  );
  if (children) {
    return (
      <li>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={baseClass}
          aria-expanded={open}
        >
          <Icon className="size-[18px] shrink-0" />
          <span className="flex-1 text-right">{title}</span>
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <ul className="mt-1 space-y-1 pr-9">
            {children.map((child) => (
              <li key={child.path}>
                <NavLink
                  to={child.path}
                  onClick={onNavigate}
                  className={({ isActive: active }) =>
                    cn(
                      "block rounded-md px-3 py-2 text-[13px] transition",
                      active
                        ? "bg-white/10 font-semibold text-white"
                        : "text-sidebar-muted hover:bg-white/5 hover:text-white",
                    )
                  }
                >
                  {child.title}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }
  return (
    <li>
      <NavLink to={path} onClick={onNavigate} className={baseClass}>
        <Icon className="size-[18px] shrink-0" />
        <span className="flex-1 text-right">{title}</span>
        {badge && (
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white">
            {badge}
          </span>
        )}
      </NavLink>
    </li>
  );
}
/* -------------------------------------------------------------------------- */
/*                                  Sidebar                                   */
/* -------------------------------------------------------------------------- */
export function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex w-72 max-w-[82vw] shrink-0 flex-col bg-sidebar text-sidebar-foreground shadow-pop transition-transform duration-200",
          "lg:static lg:w-64 lg:max-w-none lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-brand text-sm font-black text-white">
              CRM
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-white">سامانه CRM</p>
              <p className="text-[11px] text-sidebar-muted">مدیریت ارتباط با مشتری</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sidebar-muted hover:text-white lg:hidden"
            aria-label="بستن منو"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <ItemLink key={item.path} item={item} onNavigate={onClose} />
            ))}
          </ul>
        </nav>
        <div className="m-3 flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <span className="grid size-9 place-items-center rounded-md bg-white/10">
            <LifeBuoy className="size-4 text-white" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-semibold text-white">پشتیبانی فنی</p>
            <p className="truncate text-[11px] text-sidebar-muted">۰۲۱-۹۱۰۰۲۰۳۰</p>
          </div>
        </div>
      </aside>
    </>
  );
}
