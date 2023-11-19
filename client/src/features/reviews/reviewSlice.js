import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  status: "idle",
};

export const fetchReviews = createAsyncThunk(
  "review/fetchReviews",
  async () => {
    const res = await fetch("/api/reviews", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data;
  }
);

export const addReviewDb = createAsyncThunk(
  "review/addReviewDb",
  async (info) => {
    try {
      const res = await fetch("/api/addReview", {
        method: "POST",
        body: JSON.stringify({
          id: info.productId,
          email: info.currUser,
          review: info.rating,
          comment: info.comment,
          productName: info.productName,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("added: ", data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const editReviewDb = createAsyncThunk(
  "review/editReviewDb",
  async (info) => {
    try {
      const res = await fetch("/api/editReview", {
        method: "PATCH",
        body: JSON.stringify({
          id: info.productId,
          email: info.currUser,
          review: info.rating,
          comment: info.comment,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("edited: ", data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const reviewSlice = createSlice({
  initialState,
  name: "review",
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.products = action.payload.reviews;
        state.status = "success";
        return state;
      })
      .addCase(fetchReviews.pending, (state, action) => {
        state.status = "loading";
      });
  },
});

export default reviewSlice.reducer;

export const getAllReviews = (state) => state.review.products || [];

export const getInfoByProductId = (state, id) =>
  state.review.products.find((product) => product.productId === id)?.info;

export const getReviewByUser = (state, userEmail, id) =>
  getInfoByProductId(state, id)?.customers?.find(
    (customer) => customer.name === userEmail
  )?.rating;
