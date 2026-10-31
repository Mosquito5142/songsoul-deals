// เดือนตามเวลาประเทศไทย เพราะเจ้าของดูยอดคลิกเป็นรอบเดือนท้องถิ่น

export function bangkokMonthStartIso(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  return `${year}-${month}-01T00:00:00+07:00`;
}

export function formatBangkokMonth(now = new Date()): string {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: "Asia/Bangkok",
    month: "long",
    year: "numeric",
    numberingSystem: "latn",
  }).format(now);
}
