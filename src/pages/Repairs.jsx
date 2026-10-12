import { useCallback, useId, useMemo, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader, SearchInput } from "@/components/shared/PageHeader";
import { Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { StatusBadge } from "@/components/shared/Widgets";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  COL_HIDE_LG,
  COL_HIDE_MD,
  EditButton,
  TD,
  TBody,
  TH,
  THead,
  TR,
  Table,
} from "@/components/ui/Table";
import { Avatar } from "@/components/ui/Avatar";
import { useFilter } from "@/hooks/useFilter";
import { useData } from "@/store/DataProvider";
import { DEVICES, TECHNICIANS } from "@/data/reference";
import { formatFaDate, formatToman, todayIso, toFaDigits } from "@/lib/format";
import { clampNumber, nextCode } from "@/lib/utils";
const STATUS_TABS = [
  "همه",
  "در انتظار بررسی",
  "در حال تعمیر",
  "آماده تحویل",
  "تحویل شده",
  "غیرقابل تعمیر",
];
const STATUSES = ["در انتظار بررسی", "در حال تعمیر", "آماده تحویل", "تحویل شده", "غیرقابل تعمیر"];
const PRIORITIES = ["کم", "متوسط", "بالا", "فوری"];
export function Repairs() {
  const { repairs } = useData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("همه");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const byStatus = useMemo(
    () => (status === "همه" ? repairs : repairs.filter((r) => r.status === status)),
    [repairs, status],
  );
  const toText = useCallback(
    (r) => `${r.customer} ${r.ticketCode} ${r.device} ${r.technician}`,
    [],
  );
  const rows = useFilter(byStatus, query, toText);
  const openCases = repairs.filter(
    (r) => r.status === "در حال تعمیر" || r.status === "در انتظار بررسی",
  ).length;
  const totalCost = repairs.reduce((sum, r) => sum + r.estimatedCost, 0);
  return (
    <>
      <PageHeader
        title="تعمیرات"
        description="مدیریت پرونده‌های تعمیر، تخصیص تکنسین و برآورد هزینه"
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="size-4" />
            پرونده تعمیر جدید
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4 sm:p-5">
          <p className="text-xs text-muted-foreground">پرونده‌های باز</p>
          <p className="mt-2 text-lg font-bold text-foreground sm:text-xl">
            {toFaDigits(openCases)}
          </p>
        </Card>
        <Card className="p-4 sm:p-5">
          <p className="text-xs text-muted-foreground">کل پرونده‌ها</p>
          <p className="mt-2 text-lg font-bold text-foreground sm:text-xl">
            {toFaDigits(repairs.length)}
          </p>
        </Card>
        <Card className="p-4 sm:p-5">
          <p className="text-xs text-muted-foreground">برآورد هزینه کل</p>
          <p className="mt-2 text-lg font-bold text-foreground sm:text-xl">
            {formatToman(totalCost)}
          </p>
        </Card>
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
            placeholder="جستجوی پرونده یا دستگاه..."
            className="min-w-64 flex-1 sm:max-w-xs"
          />
        </div>
      </Card>
      <Card>
        <Table>
          <THead>
            <TR>
              <TH>کد پرونده</TH>
              <TH>مشتری</TH>
              <TH>دستگاه</TH>
              <TH className={COL_HIDE_LG}>ایراد</TH>
              <TH className={COL_HIDE_LG}>تکنسین</TH>
              <TH>وضعیت</TH>
              <TH className={COL_HIDE_MD}>اولویت</TH>
              <TH className={COL_HIDE_MD}>تاریخ پذیرش</TH>
              <TH className={COL_HIDE_LG}>برآورد هزینه</TH>
              <TH className="w-12">عملیات</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((item) => (
              <TR key={item.id}>
                <TD className="font-medium text-foreground">{item.ticketCode}</TD>
                <TD>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={item.customer} className="size-8" />
                    <span className="text-foreground">{item.customer}</span>
                  </div>
                </TD>
                <TD className="text-foreground">{item.device}</TD>
                <TD className={`text-muted-foreground ${COL_HIDE_LG}`}>{item.issue}</TD>
                <TD className={`text-muted-foreground ${COL_HIDE_LG}`}>{item.technician}</TD>
                <TD>
                  <StatusBadge status={item.status} />
                </TD>
                <TD className={COL_HIDE_MD}>
                  <StatusBadge status={item.priority} />
                </TD>
                <TD className={`text-muted-foreground ${COL_HIDE_MD}`}>
                  {formatFaDate(item.receivedAt)}
                </TD>
                <TD className={`text-foreground ${COL_HIDE_LG}`}>
                  {item.estimatedCost > 0 ? formatToman(item.estimatedCost) : "—"}
                </TD>
                <TD>
                  <EditButton
                    onClick={() => {
                      setEditing(item);
                      setDialogOpen(true);
                    }}
                  />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
        {rows.length === 0 && (
          <p className="py-12 text-center text-sm text-faint">پرونده‌ای یافت نشد.</p>
        )}
      </Card>
      {dialogOpen && <RepairDialog record={editing} onClose={() => setDialogOpen(false)} />}
    </>
  );
}
function RepairDialog({ record, onClose }) {
  const { repairs, addRepair, updateRepair } = useData();
  const toast = useToast();
  const formId = useId();
  const editing = Boolean(record);
  const [draft, setDraft] = useState(() =>
    record
      ? { ...record }
      : {
          ticketCode: nextCode(
            "REP",
            repairs.map((r) => r.ticketCode),
          ),
          customer: "",
          device: DEVICES[0],
          issue: "",
          technician: TECHNICIANS[0],
          status: "در انتظار بررسی",
          priority: "متوسط",
          receivedAt: todayIso(),
          estimatedCost: 0,
        },
  );
  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = { ...draft, estimatedCost: Math.max(0, draft.estimatedCost) };
    if (editing) {
      updateRepair(record.id, payload);
      toast.push(`پرونده ${draft.ticketCode} بروزرسانی شد.`);
    } else {
      addRepair(payload);
      toast.push(`پرونده ${draft.ticketCode} ثبت شد.`);
    }
    onClose();
  };
  return (
    <Modal
      size="lg"
      title={editing ? "ویرایش پرونده تعمیر" : "پرونده تعمیر جدید"}
      description={
        editing ? "وضعیت پرونده و اطلاعات آن را تغییر دهید" : "پذیرش دستگاه و تخصیص تکنسین"
      }
      onClose={onClose}
      footer={
        <>
          <Button type="submit" form={formId}>
            {editing ? "ذخیره تغییرات" : "ثبت پرونده"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="کد پرونده" hint="به‌صورت خودکار تولید می‌شود">
          <Input
            readOnly
            dir="ltr"
            value={draft.ticketCode}
            className="bg-muted text-muted-foreground"
          />
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
        <Field label="دستگاه" required>
          <Select value={draft.device} onChange={(event) => update("device", event.target.value)}>
            {DEVICES.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="تکنسین مسئول" required>
          <Select
            value={draft.technician}
            onChange={(event) => update("technician", event.target.value)}
          >
            {TECHNICIANS.map((technician) => (
              <option key={technician} value={technician}>
                {technician}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="شرح ایراد" required className="sm:col-span-2">
          <Input
            required
            value={draft.issue}
            onChange={(event) => update("issue", event.target.value)}
            placeholder="مثلاً قطع شدن قوس در حین برش"
          />
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
        <Field label="تاریخ پذیرش" required>
          <Input
            required
            type="date"
            dir="ltr"
            value={draft.receivedAt}
            onChange={(event) => update("receivedAt", event.target.value)}
          />
        </Field>
        <Field label="برآورد هزینه" hint="به تومان">
          <Input
            type="number"
            min={0}
            step={100000}
            value={draft.estimatedCost}
            onChange={(event) => update("estimatedCost", clampNumber(event.target.value, 0, 1e12))}
          />
        </Field>
      </form>
    </Modal>
  );
}
