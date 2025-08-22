import IPagination from "../models/sc/pagination-base";
import { isNullOrEmpty } from "./string";

const paginate = (query: IPagination, sortColumns: string[]) => {
  let page = parseInt(query.page);
  let pageSize = parseInt(query.pageSize);
  let sortExp = query.sortExp;
  let sortOrder = query.sortOrd;

  if (isNaN(page) || isNaN(pageSize)) {
    throw new Error("Page and page size must be numbers.");
  }

  page = Math.max(1, page);
  pageSize = Math.max(1, pageSize);

  const skip = (page - 1) * pageSize;

  if (!isNullOrEmpty(sortExp) && !sortColumns.includes(sortExp)) {
    throw new Error("Unknown column: " + sortExp);
  }

  if (!sortOrder || (sortOrder !== "ASC" && sortOrder !== "DESC")) {
    sortOrder = "DESC";
  }

  if (!sortExp) {
    sortExp = "id";
  }

  return { page, pageSize, sortExp, sortOrder, skip };
};

export { paginate };
