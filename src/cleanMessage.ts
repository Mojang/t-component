export function cleanMessage(message: string) {
  return message
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
