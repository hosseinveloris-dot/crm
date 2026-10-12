import { useCallback, useId, useMemo, useState } from "react";
import { CheckCircle2, Clock, MessageSquare, Plus } from "lucide-react";
import { PageHeader, SearchInput } from "@/components/shared/PageHeader";
import { StatCard, StatusBadge } from "@/components/shared/Widgets";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { COL_HIDE_LG, COL_HIDE_MD, TD, TBody, TH, THead, TR, Table } from "@/components/ui/Table";
import { Avatar } from "@/components/ui/Avatar";
import { useFilter } from "@/hooks/useFilter";
import { useData } from "@/store/DataProvider";
import { SALES_OWNERS } from "@/data/reference";
import { formatFaDate, formatFaNumber, todayIso, toFaDigits } from "@/lib/format";
import { nextCode } from "@/lib/utils";
const STATUS_TABS = ["همه", "باز", "در حال بررسی", "پاسخ داده شده", "بسته"];
const STATUSES = ["باز", "در حال بررسی", "پاسخ داده شده", "بسته"];
const CHANNELS = ["تلفن", "ایمیل", "چت", "حضوری"];
const PRIORITIES = ["کم", "متوسط", "بالا", "فوری"];
export function Support() {
  const { tickets } = useData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("همه");
  const [dialogOpen, setDialogOpen] = useState(false);
  const byStatus = useMemo(
    () => (status === "همه" ? tickets : tickets.filter((t) => t.status === status)),
    [tickets, status],
  );
  const toText = useCallback((t) => `${t.customer} ${t.subject} ${t.code} ${t.agent}`, []);
  const rows = useFilter(byStatus, query, toText);
  const open = tickets.filter((t) => t.status === "باز" || t.status === "در حال بررسی").length;
  const answered = tickets.filter((t) => t.status === "پاسخ داده شده").length;
  const rated = tickets.filter((t) => t.satisfaction);
  const avgSatisfaction = rated.length
    ? (rated.reduce((sum, t) => sum + (t.satisfaction ?? 0), 0) / rated.length).toFixed(1)
    : "—";
  return (
    <>
      <PageHeader
        title="پشتیبانی"
        description="مدیریت تیکت‌های مشتریان، اولویت‌بندی و سنجش رضایت"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            تیکت جدید
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="تیکت‌های باز" value={formatFaNumber(open)} icon={Clock} tone="warning" />
        <StatCard
          title="در انتظار تایید مشتری"
          value={formatFaNumber(answered)}
          icon={MessageSquare}
          tone="info"
        />
        <StatCard
          title="میانگین رضایت"
          value={`${toFaDigits(avgSatisfaction)} از ۵`}
          icon={CheckCircle2}
          tone="success"
        />
      </div>
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={status} onValueChange={setStatus}>
            <TabsList>
              {STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="جستجوی تیکت..."
            className="min-w-64 flex-1 sm:max-w-xs"
          />
        </div>
      </Card>
      <Card>
        <Table>
          <THead>
            <TR>
              <TH>کد تیکت</TH>
              <TH>مشتری</TH>
              <TH className={COL_HIDE_MD}>موضوع</TH>
              <TH className={COL_HIDE_LG}>کانال</TH>
              <TH className={COL_HIDE_MD}>اولویت</TH>
              <TH>وضعیت</TH>
              <TH className={COL_HIDE_LG}>کارشناس</TH>
              <TH className={COL_HIDE_MD}>تاریخ</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((item) => (
              <TR key={item.id}>
                <TD className="font-medium text-slate-800">{item.code}</TD>
                <TD>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={item.customer} className="size-8" />
                    <span className="text-slate-700">{item.customer}</span>
                  </div>
                </TD>
                <TD className={`text-slate-500 ${COL_HIDE_MD}`}>{item.subject}</TD>
                <TD className={`text-slate-500 ${COL_HIDE_LG}`}>{item.channel}</TD>
                <TD className={COL_HIDE_MD}>
                  <StatusBadge status={item.priority} />
                </TD>
                <TD>
                  <StatusBadge status={item.status} />
                </TD>
                <TD className={`text-slate-500 ${COL_HIDE_LG}`}>{item.agent}</TD>
                <TD className={`text-slate-500 ${COL_HIDE_MD}`}>{formatFaDate(item.createdAt)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
        {rows.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-400">تیکتی یافت نشد.</p>
        )}
      </Card>
      {dialogOpen && <NewTicketDialog onClose={() => setDialogOpen(false)} />}
    </>
  );
}
function NewTicketDialog({ onClose }) {
  const { tickets, addTicket } = useData();
  const toast = useToast();
  const formId = useId();
  const [draft, setDraft] = useState(() => ({
    code: nextCode(
      "SUP",
      tickets.map((t) => t.code),
    ),
    customer: "",
    subject: "",
    channel: "تلفن",
    priority: "متوسط",
    status: "باز",
    agent: SALES_OWNERS[0],
    createdAt: todayIso(),
  }));
  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    addTicket(draft);
    toast.push(`تیکت ${draft.code} ثبت شد.`);
    onClose();
  };
  return (
    <Modal
      title="تیکت جدید"
      description="ثبت درخواست پشتیبانی مشتری"
      onClose={onClose}
      footer={
        <>
          <Button type="submit" form={formId}>
            ثبت تیکت
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="کد تیکت" hint="به‌صورت خودکار تولید می‌شود">
          <Input readOnly dir="ltr" value={draft.code} className="bg-slate-50 text-slate-500" />
        </Field>
        <Field label="مشتری" required>
          <Input
            autoFocus
            required
            value={draft.customer}
            onChange={(event) => update("customer", event.target.value)}
            placeholder="نام مشتری"
          />
        </Field>
        <Field label="موضوع" required className="sm:col-span-2">
          <Input
            required
            value={draft.subject}
            onChange={(event) => update("subject", event.target.value)}
            placeholder="موضوع درخواست"
          />
        </Field>
        <Field label="کانال ارتباطی">
          <Select value={draft.channel} onChange={(event) => update("channel", event.target.value)}>
            {CHANNELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="کارشناس پاسخگو" required>
          <Select value={draft.agent} onChange={(event) => update("agent", event.target.value)}>
            {SALES_OWNERS.map((agent) => (
              <option key={agent} value={agent}>
                {agent}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="اولویت">
          <Select
            value={draft.priority}
            onChange={(event) => update("priority", event.target.value)}
          >
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="وضعیت">
          <Select value={draft.status} onChange={(event) => update("status", event.target.value)}>
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="تاریخ ثبت" required className="sm:col-span-2">
          <Input
            required
            type="date"
            dir="ltr"
            value={draft.createdAt}
            onChange={(event) => update("createdAt", event.target.value)}
          />
        </Field>
      </form>
    </Modal>
  );
}
