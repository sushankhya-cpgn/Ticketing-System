import  { Dayjs } from "dayjs";

export const formatDate = (date: Date | Dayjs | null) => {
  if (!date) return "";

  // Convert Dayjs to JS Date if needed
  const jsDate = (date as Dayjs).toDate ? (date as Dayjs).toDate() : (date as Date);

  const y = jsDate.getFullYear();
  const m = String(jsDate.getMonth() + 1).padStart(2, "0");
  const d = String(jsDate.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};
