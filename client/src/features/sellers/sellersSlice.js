import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { name: "Steve", id: "1" },
  { name: "John", id: "2" },
  { name: "Dave", id: "3" },
  { name: "Sarah", id: "4" },
];

const sellersSlice = createSlice({
  initialState,
  name: "sellers",
  reducers: {},
});

export default sellersSlice.reducer;

export const selectAllSellers = (state) => state.sellers;
export const selectSellerById = (state, id) =>
  state.sellers.find((seller) => seller.id === id);

export const generateId = (state) => {
  const sellers = state.sellers;
  let max = 0;
  sellers.forEach((element) => {
    max = max > Number(element.id) ? max : Number(element.id);
  });
  return `${1 + max}`;
};
