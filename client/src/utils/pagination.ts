export const getPageButtons = (page: number, totalPages: number) => {
  const TOTAL_PAGES = totalPages;
  const RANGE = 5;
  const VISIBLE_BUTTONS = totalPages < 10 ? totalPages : 10;

  let pages = [];

  let start = Math.max(1, page - RANGE);
  let end = Math.min(TOTAL_PAGES, start + VISIBLE_BUTTONS - 1);

  if (page + RANGE > TOTAL_PAGES) {
    start = TOTAL_PAGES - VISIBLE_BUTTONS + 1;
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};
