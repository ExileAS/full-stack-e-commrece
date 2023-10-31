const Categories = ({ changeCategory }) => {
  return (
    <div>
      <select className="search-categories" onChange={changeCategory}>
        <option value="all" key="0">
          Categories
        </option>
        <option value="devices" key="devices">
          devices
        </option>
        <option value="clothes" key="clothes">
          clothes
        </option>
        <option value="accessories" key="accessories">
          accessories
        </option>
        <option value="others" key="others">
          others
        </option>
      </select>
    </div>
  );
};

export default Categories;
