const useSortBy = (list, sortBy, order) => {
  if (!sortBy || !order) return list;
  if (sortBy === "date") {
    return order === "up"
      ? [...list].sort((a, b) => b.date.localeCompare(a.date))
      : [...list].sort((a, b) => a.date.localeCompare(b.date));
  }
  return order === "up"
    ? [...list].sort((a, b) => a.price - b.price)
    : [...list].sort((a, b) => b.price - a.price);
};

export default useSortBy;
