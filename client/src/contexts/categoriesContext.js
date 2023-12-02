import { createContext, useState } from "react";

export const CategoriesContext = createContext(null);

export default function CategoriesContextProvider({ children }) {
  const categories = ["devices", "clothes", "accessories", "others"];
  const [category, setCategory] = useState("");
  const contextValue = {
    categories,
    category,
    setCategory,
  };
  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  );
}
