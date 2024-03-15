export function formatDate(date: Date | string) {
  if (!date) {
    return;
  }

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
