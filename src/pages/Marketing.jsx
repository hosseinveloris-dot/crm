import { useCallback, useId, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Plus, Target, TrendingUp, Wallet } from "lucide-react";
import { PageHeader, EmptyState, SearchInput } from "@/components/shared/PageHeader";
import { StatCard, StatusBadge } from "@/components/shared/Widgets";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
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
import { Progress } from "@/components/ui/Progress";
import { useFilter } from "@/hooks/useFilter";
import { useData } from "@/store/DataProvider";
import { LEAD_SOURCES, SALES_OWNERS } from "@/data/reference";
import { LEAD_STATUSES, MARKETING_CHANNELS } from "@/data/marketing";
import { formatFaDate, formatFaNumber, formatToman, todayIso, toFaDigits } from "@/lib/format";
import { clampNumber } from "@/lib/utils";
const DEFAULT_CHANNEL = "kiln";
function isChannel(value) {
  return MARKETING_CHANNELS.some((channel) => channel.id === value);
}
export function Marketing() {
  const { channel: param } = useParams();
  const navigate = useNavigate();
  const { leads } = useData();
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const channel = isChannel(param) ? param : DEFAULT_CHANNEL;
  const meta = MARKETING_CHANNELS.find((item) => item.id === channel);
  const byChannel = useMemo(
    () => leads.filter((lead) => lead.channel === channel),
    [leads, channel],
  );
  const toText = useCallback((lead) => `${lead.customer} ${lead.source} ${lead.owner}`, []);
  const rows = useFilter(byChannel, query, toText);
  const converted = byChannel.filter((lead) => lead.status === "تبدیل شده");
  const pipeline = byChannel.reduce((sum, lead) => sum + lead.value, 0);
  const conversionRate = byChannel.length
    ? Math.round((converted.length / byChannel.length) * 100)
    : 0;
  return (
    <>
      <PageHeader
        title="بازاریابی"
        description="مدیریت سرنخ‌ها و فرصت‌های فروش به تفکیک کانال"
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="size-4" />
            ثبت سرنخ
          </Button>
        }
      />
      <Tabs value={channel} onValueChange={(value) => navigate(`/marketing/${value}`)}>
        <TabsList className="w-full sm:w-auto">
          {MARKETING_CHANNELS.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="text-sm text-muted-foreground">{meta.description}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="تعداد سرنخ‌ها"
          value={formatFaNumber(byChannel.length)}
          icon={Target}
          tone="brand"
        />
        <StatCard
          title="ارزش خط لوله فروش"
          value={formatToman(pipeline)}
          icon={Wallet}
          tone="success"
        />
        <StatCard
          title="نرخ تبدیل"
          value={`${toFaDigits(conversionRate)}٪`}
          icon={TrendingUp}
          tone="info"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>سرنخ‌های کانال «{meta.title}»</CardTitle>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="جستجوی سرنخ..."
            className="w-full sm:max-w-xs"
          />
        </CardHeader>
        {rows.length > 0 ? (
          <Table>
            <THead>
              <TR>
                <TH>مشتری</TH>
                <TH className={COL_HIDE_MD}>منبع</TH>
                <TH>وضعیت</TH>
                <TH className={COL_HIDE_LG}>کارشناس</TH>
                <TH className="w-40">امتیاز</TH>
                <TH className={COL_HIDE_MD}>ارزش تخمینی</TH>
                <TH className={COL_HIDE_LG}>تاریخ ثبت</TH>
                <TH className="w-12">عملیات</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((lead) => (
                <TR key={lead.id}>
                  <TD>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={lead.customer} className="size-8" />
                      <span className="font-medium text-foreground">{lead.customer}</span>
                    </div>
                  </TD>
                  <TD className={`text-muted-foreground ${COL_HIDE_MD}`}>{lead.source}</TD>
                  <TD>
                    <StatusBadge status={lead.status} />
                  </TD>
                  <TD className={`text-muted-foreground ${COL_HIDE_LG}`}>{lead.owner}</TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={lead.score}
                        tone={lead.score >= 70 ? "success" : "brand"}
                        className="w-24"
                      />
                      <span className="text-xs text-faint">{toFaDigits(lead.score)}</span>
                    </div>
                  </TD>
                  <TD className={`text-foreground ${COL_HIDE_MD}`}>
                    {lead.value > 0 ? formatToman(lead.value) : "—"}
                  </TD>
                  <TD className={`text-muted-foreground ${COL_HIDE_LG}`}>
                    {formatFaDate(lead.createdAt)}
                  </TD>
                  <TD>
                    <EditButton
                      onClick={() => {
                        setEditing(lead);
                        setDialogOpen(true);
                      }}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        ) : (
          <CardBody>
            <EmptyState title="سرنخی یافت نشد" description="برای این کانال موردی ثبت نشده است." />
          </CardBody>
        )}
      </Card>
      {dialogOpen && (
        <LeadDialog channel={channel} record={editing} onClose={() => setDialogOpen(false)} />
      )}
    </>
  );
}
function LeadDialog({ channel, record, onClose }) {
  const { addLead, updateLead } = useData();
  const toast = useToast();
  const formId = useId();
  const meta = MARKETING_CHANNELS.find((item) => item.id === channel);
  const editing = Boolean(record);
  const [draft, setDraft] = useState(() =>
    record
      ? { ...record }
      : {
          customer: "",
          source: LEAD_SOURCES[0],
          status: "سرنخ",
          score: 50,
          owner: SALES_OWNERS[0],
          value: 0,
          createdAt: todayIso(),
        },
  );
  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...draft,
      channel,
      score: Math.min(100, Math.max(0, draft.score)),
      value: Math.max(0, draft.value),
    };
    if (editing) {
      updateLead(record.id, payload);
      toast.push(`سرنخ «${draft.customer}» بروزرسانی شد.`);
    } else {
      addLead(payload);
      toast.push(`سرنخ «${draft.customer}» در کانال ${meta.title} ثبت شد.`);
    }
    onClose();
  };
  return (
    <Modal
      title={editing ? "ویرایش سرنخ" : "ثبت سرنخ"}
      description={editing ? "اطلاعات سرنخ را تغییر دهید" : `کانال «${meta.title}»`}
      onClose={onClose}
      footer={
        <>
          <Button type="submit" form={formId}>
            {editing ? "ذخیره تغییرات" : "ثبت سرنخ"}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="مشتری" required className="sm:col-span-2">
          <Input
            autoFocus
            required
            value={draft.customer}
            onChange={(event) => update("customer", event.target.value)}
            placeholder="نام مشتری یا شرکت"
          />
        </Field>
        <Field label="منبع">
          <Select value={draft.source} onChange={(event) => update("source", event.target.value)}>
            {LEAD_SOURCES.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="وضعیت">
          <Select value={draft.status} onChange={(event) => update("status", event.target.value)}>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="کارشناس مسئول" required>
          <Select value={draft.owner} onChange={(event) => update("owner", event.target.value)}>
            {SALES_OWNERS.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="تاریخ ثبت" required>
          <Input
            required
            type="date"
            dir="ltr"
            value={draft.createdAt}
            onChange={(event) => update("createdAt", event.target.value)}
          />
        </Field>
        <Field label="امتیاز" hint="عددی بین ۰ تا ۱۰۰">
          <Input
            type="number"
            min={0}
            max={100}
            value={draft.score}
            onChange={(event) => update("score", clampNumber(event.target.value, 0, 100))}
          />
        </Field>
        <Field label="ارزش تخمینی" hint="به تومان">
          <Input
            type="number"
            min={0}
            step={1000000}
            value={draft.value}
            onChange={(event) => update("value", clampNumber(event.target.value, 0, 1e12))}
          />
        </Field>
      </form>
    </Modal>
  );
}
