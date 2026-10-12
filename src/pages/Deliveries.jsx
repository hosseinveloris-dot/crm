import { useCallback, useId, useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader, SearchInput } from "@/components/shared/PageHeader";
import { Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { StatusBadge } from "@/components/shared/Widgets";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { COL_HIDE_LG, COL_HIDE_MD, TD, TBody, TH, THead, TR, Table } from "@/components/ui/Table";
import { useFilter } from "@/hooks/useFilter";
import { useData } from "@/store/DataProvider";
import { CARRIERS, PRODUCTS, PRODUCT_UNITS } from "@/data/reference";
import { downloadCsv } from "@/lib/csv";
import { formatFaDate, formatFaNumber, todayIso } from "@/lib/format";
import { nextCode } from "@/lib/utils";
const STATUS_TABS = ["همه", "در حال آماده‌سازی", "آماده ارسال", "در مسیر", "تحویل شده", "مرجوع"];
const STATUSES = ["در حال آماده‌سازی", "آماده ارسال", "در مسیر", "تحویل شده", "مرجوع"];
const EXPORT_HEADER = ["کد سفارش", "مشتری", "کالا", "مقدار", "واحد", "وضعیت", "حامل", "تاریخ"];
export function Deliveries() {
  const { deliveries } = useData();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("همه");
  const [dialogOpen, setDialogOpen] = useState(false);
  const byStatus = useMemo(
    () => (status === "همه" ? deliveries : deliveries.filter((d) => d.status === status)),
    [deliveries, status],
  );
  const toText = useCallback((d) => `${d.customer} ${d.orderCode} ${d.product} ${d.carrier}`, []);
  const rows = useFilter(byStatus, query, toText);
  const handleExport = () => {
    downloadCsv(
      "deliveries",
      EXPORT_HEADER,
      rows.map((d) => [
        d.orderCode,
        d.customer,
        d.product,
        d.quantity,
        d.unit,
        d.status,
        d.carrier,
        d.date,
      ]),
    );
    toast.push(`خروجی ${formatFaNumber(rows.length)} سفارش دانلود شد.`, "info");
  };
  return (
    <>
      <PageHeader
        title="تحویل کالا"
        description="پیگیری وضعیت سفارش‌ها از آماده‌سازی تا تحویل نهایی"
        actions={
          <>
            <Button variant="outline" onClick={handleExport}>
              <Download className="size-4" />
              خروجی اکسل
            </Button>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              سفارش جدید
            </Button>
          </>
        }
      />
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
            placeholder="جستجوی سفارش یا مشتری..."
            className="min-w-64 flex-1 sm:max-w-xs"
          />
        </div>
      </Card>
      <Card>
        <Table>
          <THead>
            <TR>
              <TH>کد سفارش</TH>
              <TH>مشتری</TH>
              <TH className={COL_HIDE_MD}>کالا</TH>
              <TH>مقدار</TH>
              <TH>وضعیت</TH>
              <TH className={COL_HIDE_LG}>حامل</TH>
              <TH className={COL_HIDE_MD}>تاریخ</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((item) => (
              <TR key={item.id}>
                <TD className="font-medium text-slate-800">{item.orderCode}</TD>
                <TD className="text-slate-700">{item.customer}</TD>
                <TD className={`text-slate-500 ${COL_HIDE_MD}`}>{item.product}</TD>
                <TD className="text-slate-500">
                  {formatFaNumber(item.quantity)} {item.unit}
                </TD>
                <TD>
                  <StatusBadge status={item.status} />
                </TD>
                <TD className={`text-slate-500 ${COL_HIDE_LG}`}>{item.carrier}</TD>
                <TD className={`text-slate-500 ${COL_HIDE_MD}`}>{formatFaDate(item.date)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
        {rows.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-400">سفارشی یافت نشد.</p>
        )}
      </Card>
      {dialogOpen && <NewDeliveryDialog onClose={() => setDialogOpen(false)} />}
    </>
  );
}
function NewDeliveryDialog({ onClose }) {
  const { deliveries, addDelivery } = useData();
  const toast = useToast();
  const formId = useId();
  const [draft, setDraft] = useState(() => ({
    orderCode: nextCode(
      "ORD",
      deliveries.map((d) => d.orderCode),
    ),
    customer: "",
    product: PRODUCTS[0],
    quantity: 1,
    unit: PRODUCT_UNITS[0],
    status: "در حال آماده‌سازی",
    carrier: CARRIERS[0],
    date: todayIso(),
    address: "",
  }));
  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    addDelivery({ ...draft, quantity: Math.max(0, draft.quantity) });
    toast.push(`سفارش ${draft.orderCode} ثبت شد.`);
    onClose();
  };
  return (
    <Modal
      title="سفارش جدید"
      description="ثبت سفارش و تعیین وضعیت تحویل"
      onClose={onClose}
      footer={
        <>
          <Button type="submit" form={formId}>
            ثبت سفارش
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="کد سفارش" hint="به‌صورت خودکار تولید می‌شود">
          <Input
            readOnly
            dir="ltr"
            value={draft.orderCode}
            className="bg-slate-50 text-slate-500"
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
        <Field label="کالا" required>
          <Select value={draft.product} onChange={(event) => update("product", event.target.value)}>
            {PRODUCTS.map((product) => (
              <option key={product} value={product}>
                {product}
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
        <Field label="مقدار" required>
          <Input
            required
            type="number"
            min={0}
            value={draft.quantity}
            onChange={(event) => update("quantity", Number(event.target.value))}
          />
        </Field>
        <Field label="واحد">
          <Select value={draft.unit} onChange={(event) => update("unit", event.target.value)}>
            {PRODUCT_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="حامل">
          <Select value={draft.carrier} onChange={(event) => update("carrier", event.target.value)}>
            {CARRIERS.map((carrier) => (
              <option key={carrier} value={carrier}>
                {carrier}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="تاریخ" required>
          <Input
            required
            type="date"
            dir="ltr"
            value={draft.date}
            onChange={(event) => update("date", event.target.value)}
          />
        </Field>
        <Field label="نشانی تحویل" className="sm:col-span-2">
          <Input
            value={draft.address}
            onChange={(event) => update("address", event.target.value)}
            placeholder="شهر، خیابان، پلاک"
          />
        </Field>
      </form>
    </Modal>
  );
}
