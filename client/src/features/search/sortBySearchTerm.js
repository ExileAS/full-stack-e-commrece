const sortByRelevance = (search) => {
  return (a, b) => {
    if (
      a.name.toLowerCase().startsWith(search.toLowerCase()) &&
      b.name.toLowerCase().startsWith(search.toLowerCase())
    )
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    else if (a.name.toLowerCase().startsWith(search.toLowerCase())) return -1;
    else if (b.name.toLowerCase().startsWith(search.toLowerCase())) return 1;

    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  };
};

export default sortByRelevance;
