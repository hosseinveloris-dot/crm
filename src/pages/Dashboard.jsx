import { useMemo } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { BarChart, ChannelBreakdown, StatCard, StatusBadge } from "@/components/shared/Widgets";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { useToast } from "@/components/ui/Toast";
import { COL_HIDE_MD, TD, TBody, TH, THead, TR, Table } from "@/components/ui/Table";
import { activities, channelMix, kpis, salesTrend } from "@/data";
import { downloadCsv } from "@/lib/csv";
import { toFaDigits } from "@/lib/format";
import { useData } from "@/store/DataProvider";
import { cn } from "@/lib/utils";
const TONE_DOT = {
  brand: "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};
export function Dashboard() {
  const { followUps } = useData();
  const toast = useToast();
  const topFollowUps = useMemo(
    () => [...followUps].sort((a, b) => b.progress - a.progress).slice(0, 5),
    [followUps],
  );
  const handleExport = () => {
    downloadCsv(
      "dashboard-summary",
      ["شاخص", "مقدار", "تغییر (درصد)", "توضیح"],
      kpis.map((kpi) => [kpi.title, kpi.value, kpi.change, kpi.hint]),
    );
    toast.push("خلاصه شاخص‌های داشبورد دانلود شد.", "info");
  };
  return (
    <>
      <PageHeader
        title="داشبورد مدیریتی"
        description="نمای کلی عملکرد فروش، پیگیری و عملیات"
        actions={
          <>
            <Button variant="outline" size="md" onClick={handleExport}>
              خروجی گزارش
            </Button>
            <Link to="/customers/new" className={buttonClasses("primary", "md")}>
              <Plus className="size-4" />
              ثبت مشتری جدید
            </Link>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            hint={kpi.hint}
            change={kpi.change}
            icon={kpi.icon}
            tone={kpi.tone}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>روند فروش و سرنخ‌ها</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">شش ماه گذشته (میلیارد تومان)</p>
            </div>
            <Link
              to="/reports"
              className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              جزئیات
              <ArrowUpRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardBody>
            <BarChart data={salesTrend.map((p) => ({ label: p.month, value: p.sales }))} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>سهم کانال‌های بازاریابی</CardTitle>
          </CardHeader>
          <CardBody className="space-y-6">
            <ChannelBreakdown items={channelMix} />
            <div className="rounded-lg bg-brand-soft p-4">
              <p className="text-xs font-semibold text-brand">بیشترین بازدهی</p>
              <p className="mt-1 text-sm text-muted-foreground">
                کانال «کوره» با ۴۲٪ سهم، بیشترین فرصت فروش را ایجاد کرده است.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>آخرین روندهای پیگیری</CardTitle>
            <Link to="/follow-ups" className="text-xs font-medium text-brand hover:underline">
              مشاهده همه
            </Link>
          </CardHeader>
          <Table>
            <THead>
              <TR>
                <TH>مشتری</TH>
                <TH className={COL_HIDE_MD}>موضوع</TH>
                <TH>مرحله</TH>
                <TH className="w-32 sm:w-40">پیشرفت</TH>
              </TR>
            </THead>
            <TBody>
              {topFollowUps.map((item) => (
                <TR key={item.id}>
                  <TD className="font-medium text-foreground">{item.customer}</TD>
                  <TD className={`text-muted-foreground ${COL_HIDE_MD}`}>{item.subject}</TD>
                  <TD>
                    <StatusBadge status={item.stage} />
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Progress value={item.progress} className="w-24" />
                      <span className="text-xs text-faint">{toFaDigits(item.progress)}٪</span>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>فعالیت‌های اخیر</CardTitle>
          </CardHeader>
          <CardBody>
            <ol className="space-y-5">
              {activities.map((activity) => (
                <li key={activity.id} className="flex gap-3">
                  <span
                    className={cn("mt-1.5 size-2 shrink-0 rounded-full", TONE_DOT[activity.tone])}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="truncate text-xs text-faint">{activity.description}</p>
                    <p className="mt-0.5 text-[11px] text-faint">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
