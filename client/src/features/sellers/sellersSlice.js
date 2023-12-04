import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  sellers: [],
  currIsSeller: false,
};

export const getAllSellers = createAsyncThunk("getAllSellers", async () => {
  try {
    const res = await fetch("/api/allSellers", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
});

const sellersSlice = createSlice({
  initialState,
  name: "sellers",
  reducers: {
    addNewSeller(state, action) {
      const seller = state.sellers.find(({ id }) => action.payload.id === id);
      if (!seller) state.sellers.push(action.payload);
      return state;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllSellers.fulfilled, (state, action) => {
        state.status = "success";
        state.sellers = Array.from(new Set([...action.payload.sellerList])).map(
          (seller, ind) => {
            return {
              name: seller,
              id: `${ind}`,
            };
          }
        );
        return state;
      })
      .addCase(getAllSellers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAllSellers.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const { addNewSeller } = sellersSlice.actions;

export default sellersSlice.reducer;

export const selectAllSellers = (state) => state.sellers.sellers;
export const selectSellerById = (state, id) =>
  state.sellers.sellers.find((seller) => seller.id === id);
export const getIdByName = (state, name) =>
  state.sellers.sellers.find((seller) => seller.name === name)?.id;

export const generateIdSeller = (state) => {
  const sellers = state.sellers.sellers;
  let max = 0;
  sellers.forEach((element) => {
    max = max > Number(element.id) ? max : Number(element.id);
  });
  return `${1 + max}`;
};
