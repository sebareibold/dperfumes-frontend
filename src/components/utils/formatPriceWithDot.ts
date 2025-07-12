export default function formatPriceWithDot(value: number): string {
  if (typeof value !== "number") return "";
  return value.toLocaleString("es-AR").replace(/,/g, ".");
} 