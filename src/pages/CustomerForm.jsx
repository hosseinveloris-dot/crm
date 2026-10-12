import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Info, Save, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { CITIES, CUSTOMER_SOURCES, SALES_OWNERS } from "@/data/reference";
import { todayIso, toFaDigits } from "@/lib/format";
import { clampNumber, cn, digitsOnly, nextCode } from "@/lib/utils";
import { useData } from "@/store/DataProvider";
const INITIAL = {
  type: "حقیقی",
  fullName: "",
  company: "",
  nationalId: "",
  phone: "",
  landline: "",
  email: "",
  city: "تهران",
  address: "",
  source: "وب‌سایت",
  owner: SALES_OWNERS[0],
  note: "",
};
const PHONE_LENGTH = 11;
const NATIONAL_ID_LENGTH = 10;
export function CustomerForm() {
  const { customers, addCustomer } = useData();
  const toast = useToast();
  const [form, setForm] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const isLegal = form.type === "حقوقی";
  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "نام را وارد کنید.";
    if (form.phone.length !== PHONE_LENGTH) {
      next.phone = `شماره همراه باید ${toFaDigits(PHONE_LENGTH)} رقم باشد.`;
    }
    if (form.landline && form.landline.length !== PHONE_LENGTH) {
      next.landline = `شماره ثابت باید ${toFaDigits(PHONE_LENGTH)} رقم باشد.`;
    }
    if (form.nationalId && form.nationalId.length !== NATIONAL_ID_LENGTH) {
      next.nationalId = `${isLegal ? "شناسه ملی" : "کد ملی"} باید ${toFaDigits(NATIONAL_ID_LENGTH)} رقم باشد.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitted) return;
    if (!validate()) {
      toast.push("لطفاً خطاهای فرم را برطرف کنید.", "error");
      return;
    }
    addCustomer({
      code: nextCode(
        "CUS",
        customers.map((customer) => customer.code),
      ),
      fullName: form.fullName,
      company: isLegal ? form.company : undefined,
      phone: form.phone,
      city: form.city,
      type: form.type,
      status: "در انتظار تایید",
      owner: form.owner,
      registeredAt: todayIso(),
    });
    setSubmitted(true);
    toast.push(`مشتری «${form.fullName}» ثبت شد.`);
  };
  return (
    <>
      <PageHeader
        title="ثبت مشتری"
        description="افزودن مشتری جدید به سامانه و تعیین کارشناس مسئول"
        actions={
          <Link
            to="/customers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-brand"
          >
            <ArrowRight className="size-4" />
            بازگشت به فهرست مشتریان
          </Link>
        }
      />
      {submitted && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
          <CheckCircle2 className="size-5 shrink-0" />
          اطلاعات مشتری «{form.fullName || "بدون نام"}» با موفقیت ثبت شد.
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات هویتی</CardTitle>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="نوع مشتری" required>
                <Select value={form.type} onChange={(e) => update("type", e.target.value)}>
                  <option value="حقیقی">حقیقی</option>
                  <option value="حقوقی">حقوقی</option>
                </Select>
              </Field>
              <Field
                label={isLegal ? "نام مدیرعامل / رابط" : "نام و نام خانوادگی"}
                required
                error={errors.fullName}
              >
                <Input
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="مثلاً علی رضایی"
                  required
                />
              </Field>
              {isLegal && (
                <Field label="نام شرکت" required>
                  <Input
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="مثلاً صنایع فولاد پارس"
                  />
                </Field>
              )}
              <Field label={isLegal ? "شناسه ملی" : "کد ملی"} error={errors.nationalId}>
                <Input
                  value={form.nationalId}
                  onChange={(e) =>
                    update("nationalId", digitsOnly(e.target.value, NATIONAL_ID_LENGTH))
                  }
                  placeholder="۱۰ رقم"
                  inputMode="numeric"
                  maxLength={NATIONAL_ID_LENGTH}
                />
              </Field>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات تماس</CardTitle>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="تلفن همراه" required error={errors.phone}>
                <Input
                  value={form.phone}
                  onChange={(e) => update("phone", digitsOnly(e.target.value, PHONE_LENGTH))}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  inputMode="numeric"
                  maxLength={PHONE_LENGTH}
                  required
                />
              </Field>
              <Field label="تلفن ثابت" error={errors.landline}>
                <Input
                  value={form.landline}
                  onChange={(e) => update("landline", digitsOnly(e.target.value, PHONE_LENGTH))}
                  placeholder="۰۲۱۸۸۸۸۸۸۸۸"
                  inputMode="numeric"
                  maxLength={PHONE_LENGTH}
                />
              </Field>
              <Field label="ایمیل">
                <Input
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="name@company.com"
                />
              </Field>
              <Field label="شهر" required>
                <Select value={form.city} onChange={(e) => update("city", e.target.value)}>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="نشانی" className="sm:col-span-2">
                <Textarea
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="نشانی کامل پستی"
                />
              </Field>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات فروش</CardTitle>
            </CardHeader>
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="منبع آشنایی">
                <Select value={form.source} onChange={(e) => update("source", e.target.value)}>
                  {CUSTOMER_SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="کارشناس مسئول" required>
                <Select value={form.owner} onChange={(e) => update("owner", e.target.value)}>
                  {SALES_OWNERS.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="توضیحات" className="sm:col-span-2">
                <Textarea
                  value={form.note}
                  onChange={(e) => update("note", e.target.value)}
                  placeholder="یادداشت آزاد درباره مشتری"
                />
              </Field>
            </CardBody>
          </Card>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitted}>
              {submitted ? <Save className="size-4" /> : <UserPlus className="size-4" />}ثبت مشتری
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                setForm(INITIAL);
                setErrors({});
                setSubmitted(false);
              }}
            >
              پاک کردن فرم
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-3">
              <div className="flex items-center gap-2 text-brand">
                <Info className="size-4" />
                <h3 className="text-sm font-semibold">راهنمای ثبت</h3>
              </div>
              <ul className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                {[
                  "برای مشتریان حقوقی، وارد کردن نام شرکت و شناسه ملی الزامی است.",
                  "شماره تماس همراه به‌عنوان شناسه اصلی مشتری استفاده می‌شود.",
                  "کارشناس مسئول تعیین‌کننده مالک پرونده پیگیری و تیکت‌های پشتیبانی است.",
                  "پس از ثبت، می‌توانید از بخش «روند پیگیری» مرحله بعدی را ایجاد کنید.",
                ].map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full bg-brand")} />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-2">
              <p className="text-xs text-faint">خلاصه اطلاعات وارد‌شده</p>
              <dl className="space-y-2 text-sm">
                <SummaryRow label="نوع" value={form.type} />
                <SummaryRow label="نام" value={form.fullName || "—"} />
                {isLegal && <SummaryRow label="شرکت" value={form.company || "—"} />}
                <SummaryRow label="همراه" value={form.phone || "—"} />
                <SummaryRow label="شهر" value={form.city} />
                <SummaryRow label="کارشناس" value={form.owner} />
              </dl>
            </CardBody>
          </Card>
        </div>
      </form>
    </>
  );
}
function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
      <dt className="text-xs text-faint">{label}</dt>
      <dd className="truncate text-xs font-medium text-foreground">{value}</dd>
    </div>
  );
}
