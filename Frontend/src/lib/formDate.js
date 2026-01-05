/**
 * Convert date → yyyy-MM-dd
 * NO timezone shift
 */
export function toISODate(date) {
  if (!date) return "";

  // already yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  let y, m, d;

  // MM/DD/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    [m, d, y] = date.split("/").map(Number);
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  // Date or ISO string
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "";

  // ⛔ use LOCAL date, NOT UTC
  y = parsed.getFullYear();
  m = parsed.getMonth() + 1;
  d = parsed.getDate();

  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}