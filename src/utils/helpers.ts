const toDate = (v: any) => {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? "" : d.toDateString();
};

const formatDate = (value: any) => {
  if (!value) return "-";

  const date = value instanceof Date ? value : new Date(value as string);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

/**
 * Convert camelCase string to snake_case
 * Examples:
 * - firstName -> first_name
 * - lastName -> last_name
 * - phoneNumber -> phone_number
 */
const camelToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export { camelToSnakeCase, formatDate, toDate };
