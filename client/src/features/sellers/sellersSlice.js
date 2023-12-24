import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_SELLERS_URL } from "../utils/urlConstants";

const initialState = {
  status: "idle",
  sellers: [],
};

export const getAllSellers = createAsyncThunk("getAllSellers", async () => {
  try {
    const res = await fetch(GET_SELLERS_URL, {
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
  reducers: {},
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
        return state;
      })
      .addCase(getAllSellers.rejected, (state, action) => {
        state.status = "failed";
        return state;
      });
  },
});

export default sellersSlice.reducer;

export const selectAllSellers = (state) => state.sellers.sellers;
export const selectSellerById = (state, id) =>
  state.sellers.sellers.find((seller) => seller.id === id);
export const getIdByName = (state, name) =>
  state.sellers.sellers.find((seller) => seller.name === name)?.id;
