import { useCallback, useId, useMemo, useState } from "react";
import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader, SearchInput } from "@/components/shared/PageHeader";
import { Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { StatusBadge } from "@/components/shared/Widgets";
import { Progress } from "@/components/ui/Progress";
import { COL_HIDE_MD, TD, TBody, TH, THead, TR, Table } from "@/components/ui/Table";
import { Avatar } from "@/components/ui/Avatar";
import { useFilter } from "@/hooks/useFilter";
import { useData } from "@/store/DataProvider";
import { SALES_OWNERS } from "@/data/reference";
import { formatFaDate, todayIso, toFaDigits } from "@/lib/format";
const STAGES = ["جدید", "تماس اولیه", "ارائه پیشنهاد", "مذاکره", "قرارداد", "ناموفق"];
const PRIORITIES = ["کم", "متوسط", "بالا", "فوری"];
export function FollowUps() {
  const { followUps } = useData();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const byStage = useMemo(
    () => (stage === "all" ? followUps : followUps.filter((item) => item.stage === stage)),
    [followUps, stage],
  );
  const toText = useCallback((item) => `${item.customer} ${item.subject} ${item.owner}`, []);
  const rows = useFilter(byStage, query, toText);
  return (
    <>
      <PageHeader
        title="روند پیگیری"
        description="مدیریت مراحل پیگیری مشتریان از تماس اولیه تا قرارداد"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            پیگیری جدید
          </Button>
        }
      />
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="جستجوی مشتری یا موضوع پیگیری..."
            className="min-w-64 flex-1"
          />
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-slate-400" />
            <Select
              value={stage}
              onChange={(event) => setStage(event.target.value)}
              className="w-44"
            >
              <option value="all">همه مراحل</option>
              {STAGES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>
      <Card>
        <Table>
          <THead>
            <TR>
              <TH>مشتری</TH>
              <TH>موضوع</TH>
              <TH>مرحله</TH>
              <TH className={COL_HIDE_MD}>کارشناس</TH>
              <TH>اولویت</TH>
              <TH className={COL_HIDE_MD}>سررسید</TH>
              <TH className="w-40">پیشرفت</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((item) => (
              <TR key={item.id}>
                <TD>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={item.customer} className="size-8" />
                    <span className="font-medium text-slate-800">{item.customer}</span>
                  </div>
                </TD>
                <TD className="text-slate-500">{item.subject}</TD>
                <TD>
                  <StatusBadge status={item.stage} />
                </TD>
                <TD className={`text-slate-500 ${COL_HIDE_MD}`}>{item.owner}</TD>
                <TD>
                  <StatusBadge status={item.priority} />
                </TD>
                <TD className={`text-slate-500 ${COL_HIDE_MD}`}>{formatFaDate(item.dueDate)}</TD>
                <TD>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={item.progress}
                      tone={item.progress >= 80 ? "success" : "brand"}
                      className="w-24"
                    />
                    <span className="text-xs text-slate-400">{toFaDigits(item.progress)}٪</span>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
        {rows.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-400">موردی یافت نشد.</p>
        )}
      </Card>
      {dialogOpen && <NewFollowUpDialog onClose={() => setDialogOpen(false)} />}
    </>
  );
}
function NewFollowUpDialog({ onClose }) {
  const { addFollowUp } = useData();
  const toast = useToast();
  const formId = useId();
  const [draft, setDraft] = useState({
    customer: "",
    subject: "",
    stage: "جدید",
    owner: SALES_OWNERS[0],
    dueDate: todayIso(),
    priority: "متوسط",
    progress: 10,
  });
  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    addFollowUp({ ...draft, progress: Math.min(100, Math.max(0, draft.progress)) });
    toast.push(`پیگیری «${draft.subject}» ثبت شد.`);
    onClose();
  };
  return (
    <Modal
      title="پیگیری جدید"
      description="یک روند پیگیری برای مشتری ثبت کنید"
      onClose={onClose}
      footer={
        <>
          <Button type="submit" form={formId}>
            ثبت پیگیری
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            انصراف
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="مشتری" required>
          <Input
            autoFocus
            required
            value={draft.customer}
            onChange={(event) => update("customer", event.target.value)}
            placeholder="نام مشتری"
          />
        </Field>
        <Field label="موضوع پیگیری" required>
          <Input
            required
            value={draft.subject}
            onChange={(event) => update("subject", event.target.value)}
            placeholder="مثلاً پیگیری پیش‌فاکتور"
          />
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
        <Field label="مرحله">
          <Select value={draft.stage} onChange={(event) => update("stage", event.target.value)}>
            {STAGES.map((item) => (
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
        <Field label="سررسید" required>
          <Input
            required
            type="date"
            dir="ltr"
            value={draft.dueDate}
            onChange={(event) => update("dueDate", event.target.value)}
          />
        </Field>
        <Field label="درصد پیشرفت" className="sm:col-span-2" hint="عددی بین ۰ تا ۱۰۰">
          <Input
            type="number"
            min={0}
            max={100}
            value={draft.progress}
            onChange={(event) => update("progress", Number(event.target.value))}
          />
        </Field>
      </form>
    </Modal>
  );
}
