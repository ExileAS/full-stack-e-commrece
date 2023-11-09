import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

export const fetchReviews = createAsyncThunk(
  "review/fetchReviews",
  async () => {
    const res = await fetch("/api/reviews", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data);
    return data;
  }
);

export const editReviewDb = createAsyncThunk(
  "review/editReview",
  async (info) => {
    try {
      const res = await fetch("/api/editReview", {
        method: "PATCH",
        body: JSON.stringify({
          id: info.productId,
          email: info.currUser,
          review: info.finalRating,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
);

export const reviewSlice = createSlice({
  initialState,
  name: "review",
  reducers: {
    addReview(state, action) {
      const product = state.products.find(
        (product) => product.productId === action.payload.id
      );
      const userReview = product?.info.customers.find(
        (customer) => customer.name === action.payload.user
      );

      if (product && !userReview) {
        product.info.reviewCount++;
        product.info.rating =
          (product.info.rating * (product.info.reviewCount - 1) +
            action.payload.rating) /
          product.info.reviewCount;
      } else if (product && userReview) {
        userReview.rating = action.payload.rating;
        product.info.rating =
          (product.info.rating * product.info.reviewCount +
            (action.payload.rating - userReview.rating)) /
          product.info.reviewCount;
      }
      return state;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      console.log(action.payload.reviews);
      state.products = action.payload.reviews;
      return state;
    });
  },
});

export const { addReview } = reviewSlice.actions;
export default reviewSlice.reducer;

export const getInfoByProductId = (state, id) =>
  state.review.products.find((product) => product.productId === id)?.info;

export const getReviewByUser = (state, userEmail, id) =>
  getInfoByProductId(state, id)?.customers.find(
    (customer) => customer.name === userEmail
  )?.rating || 0;
