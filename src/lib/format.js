const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
/** Convert western digits inside a string to Persian digits. */
export function toFaDigits(value) {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}
/** Format a number with thousand separators (Latin digits). */
export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}
/** Format a number with thousand separators and Persian digits. */
export function formatFaNumber(value) {
  return toFaDigits(formatNumber(value));
}
/** Format an amount in Toman with Persian digits. */
export function formatToman(value) {
  return `${formatFaNumber(value)} تومان`;
}
const FA_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
/** Format an ISO date (YYYY-MM-DD) as a Persian (Jalali) date string. */
export function formatFaDate(iso) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  const { jy, jm, jd } = toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${toFaDigits(jd)} ${FA_MONTHS[jm - 1]} ${toFaDigits(jy)}`;
}
/** Today's local date as `YYYY-MM-DD` — used as the default for date inputs. */
export function todayIso() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
/** Relative "time ago" label in Persian for an ISO date. */
export function timeAgo(iso) {
  const then = new Date(`${iso}T00:00:00`).getTime();
  const days = Math.max(0, Math.round((Date.now() - then) / 86_400_000));
  if (days === 0) return "امروز";
  if (days === 1) return "دیروز";
  if (days < 30) return `${toFaDigits(days)} روز پیش`;
  const months = Math.round(days / 30);
  if (months < 12) return `${toFaDigits(months)} ماه پیش`;
  return `${toFaDigits(Math.round(months / 12))} سال پیش`;
}
/** Convert Gregorian date parts to Jalali (Solar Hijri) date parts. */
function toJalali(gy, gm, gd) {
  const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    gDaysInMonth.slice(0, gm - 1).reduce((sum, d) => sum + d, 0);
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm = 0;
  let jd = days + 1;
  while (jm < 12 && jd > jDaysInMonth[jm]) {
    jd -= jDaysInMonth[jm];
    jm += 1;
  }
  return { jy, jm: jm + 1, jd };
}
