import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { PageHeader, SearchInput } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/Widgets";
import { buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { COL_HIDE_LG, COL_HIDE_MD, TD, TBody, TH, THead, TR, Table } from "@/components/ui/Table";
import { Avatar } from "@/components/ui/Avatar";
import { useFilter } from "@/hooks/useFilter";
import { useData } from "@/store/DataProvider";
import { formatFaDate } from "@/lib/format";
const STATUSES = ["همه", "فعال", "غیرفعال", "در انتظار تایید"];
export function Customers() {
  const { customers } = useData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("همه");
  const byStatus = useMemo(
    () => (status === "همه" ? customers : customers.filter((c) => c.status === status)),
    [customers, status],
  );
  const toText = useCallback(
    (c) => `${c.fullName} ${c.code} ${c.company ?? ""} ${c.city} ${c.owner}`,
    [],
  );
  const rows = useFilter(byStatus, query, toText);
  return (
    <>
      <PageHeader
        title="مشتریان"
        description="فهرست مشتریان ثبت‌شده و وضعیت همکاری"
        actions={
          <Link to="/customers/new" className={buttonClasses()}>
            <UserPlus className="size-4" />
            ثبت مشتری جدید
          </Link>
        }
      />
      <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="جستجوی نام، کد یا شرکت..."
          className="min-w-64 flex-1 sm:max-w-sm"
        />
        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="w-44">
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Card>
      <Card>
        <Table>
          <THead>
            <TR>
              <TH className={COL_HIDE_MD}>کد مشتری</TH>
              <TH>نام</TH>
              <TH className={COL_HIDE_LG}>شرکت</TH>
              <TH>تلفن</TH>
              <TH className={COL_HIDE_MD}>شهر</TH>
              <TH className={COL_HIDE_LG}>نوع</TH>
              <TH>وضعیت</TH>
              <TH className={COL_HIDE_LG}>کارشناس</TH>
              <TH className={COL_HIDE_MD}>تاریخ ثبت</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((item) => (
              <TR key={item.id}>
                <TD className={`font-medium text-foreground ${COL_HIDE_MD}`}>{item.code}</TD>
                <TD>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={item.fullName} className="size-8" />
                    <span className="text-foreground">{item.fullName}</span>
                  </div>
                </TD>
                <TD className={`text-muted-foreground ${COL_HIDE_LG}`}>{item.company ?? "—"}</TD>
                <TD className="text-muted-foreground">{item.phone}</TD>
                <TD className={`text-muted-foreground ${COL_HIDE_MD}`}>{item.city}</TD>
                <TD className={`text-muted-foreground ${COL_HIDE_LG}`}>{item.type}</TD>
                <TD>
                  <StatusBadge status={item.status} />
                </TD>
                <TD className={`text-muted-foreground ${COL_HIDE_LG}`}>{item.owner}</TD>
                <TD className={`text-muted-foreground ${COL_HIDE_MD}`}>
                  {formatFaDate(item.registeredAt)}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
        {rows.length === 0 && (
          <p className="py-12 text-center text-sm text-faint">مشتری‌ای یافت نشد.</p>
        )}
      </Card>
    </>
  );
}
