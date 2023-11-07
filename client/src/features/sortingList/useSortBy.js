const useSortBy = (list, sortBy, order) => {
  let sorted;
  if (!sortBy) return list;
  if (sortBy === "date") {
    sorted =
      order === "up"
        ? [...list].sort((a, b) => b.date.localeCompare(a.date))
        : [...list].sort((a, b) => a.date.localeCompare(b.date));
  } else {
    sorted =
      order === "up"
        ? [...list].sort((a, b) => a.price - b.price)
        : [...list].sort((a, b) => b.price - a.price);
  }
  return sorted;
};

export default useSortBy;
