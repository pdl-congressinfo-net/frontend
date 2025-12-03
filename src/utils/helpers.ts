const toDate = (v: any) => {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? "" : d.toDateString();
};
export { toDate };
