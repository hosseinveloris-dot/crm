/** Escape a single CSV cell following RFC 4180. */
function toCell(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}
/**
 * Download `rows` as a CSV file on the client.
 *
 * A UTF-8 BOM is prepended so Excel renders Persian text correctly, and
 * `\r\n` line endings keep it compatible with Windows Excel.
 */
export function downloadCsv(filename, header, rows) {
  const content = [header, ...rows].map((row) => row.map(toCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
