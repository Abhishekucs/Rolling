export function matchesAPattern(text: string, pattern: string): boolean {
  const regex = new RegExp(`^${pattern}$`);
  return regex.test(text);
}
type OrderByDirection = "asc" | "desc";

export function getOrder(value: string): OrderByDirection {
  if (value === "expensive" || value === "new") {
    return "desc";
  } else {
    return "asc";
  }
}
