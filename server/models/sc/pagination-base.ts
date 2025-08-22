export default interface IPagination {
  page?: string;
  pageSize?: string;
  sortExp?: string;
  sortOrd?: "ASC" | "DESC";
}
