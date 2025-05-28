const isNullOrEmpty = (value: any) => {
  return value === null || value === undefined || value === "";
};

const isValidDateString = (dateStr: string): boolean => {
  if (!dateStr || dateStr === "N/A") return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

export { isNullOrEmpty, isValidDateString };
