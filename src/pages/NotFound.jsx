import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
        <Compass className="size-6" />
      </span>
      <div>
        <p className="text-2xl font-bold text-foreground">۴۰۴</p>
        <p className="mt-1 text-sm text-muted-foreground">صفحه‌ای که دنبالش هستید پیدا نشد.</p>
      </div>
      <Link to="/" className={buttonClasses()}>
        بازگشت به داشبورد
      </Link>
    </div>
  );
}
