import { useMemo, useState } from "react";
import { BarChart3, Download, FileSpreadsheet, FileText, LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { reportCategories, reports } from "@/data/reports";
import { BarChart } from "@/components/shared/Widgets";
import { salesTrend } from "@/data/dashboard";
import { downloadCsv } from "@/lib/csv";
import { formatFaDate, formatFaNumber, toFaDigits } from "@/lib/format";
const FORMAT_ICON = {
  PDF: FileText,
  Excel: FileSpreadsheet,
  داشبورد: LayoutDashboard,
};
export function Reports() {
  const [category, setCategory] = useState("همه");
  const toast = useToast();
  const rows = useMemo(
    () => (category === "همه" ? reports : reports.filter((r) => r.category === category)),
    [category],
  );
  const handleDownloadAll = () => {
    downloadCsv(
      "reports",
      ["عنوان", "دسته‌بندی", "قالب", "آخرین به‌روزرسانی"],
      rows.map((report) => [report.title, report.category, report.format, report.updatedAt]),
    );
    toast.push(`فهرست ${formatFaNumber(rows.length)} گزارش دانلود شد.`, "info");
  };
  return (
    <>
      <PageHeader
        title="گزارش‌ها"
        description="خروجی‌های تحلیلی از فروش، مشتریان، عملیات و پشتیبانی"
        actions={
          <Button variant="outline" onClick={handleDownloadAll}>
            <Download className="size-4" />
            دانلود همه
          </Button>
        }
      />
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList>
              <TabsTrigger value="همه">همه</TabsTrigger>
              {reportCategories.map((item) => (
                <TabsTrigger key={item} value={item}>
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <span className="text-xs text-faint">{toFaDigits(rows.length)} گزارش در دسترس</span>
        </div>
      </Card>
      <Card>
        <CardBody>
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="size-4 text-brand" />
            <h3 className="text-sm font-semibold text-foreground">روند فروش — نمای کلی</h3>
          </div>
          <BarChart
            data={salesTrend.map((point) => ({ label: point.month, value: point.sales }))}
          />
        </CardBody>
      </Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((report) => {
          const Icon = FORMAT_ICON[report.format];
          return (
            <Card key={report.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{report.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Badge tone="brand">{report.category}</Badge>
                  <Badge tone="neutral">{report.format}</Badge>
                </div>
                <span className="text-[11px] text-faint">{formatFaDate(report.updatedAt)}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
