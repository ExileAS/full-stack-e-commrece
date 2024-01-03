import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ADD_REVIEW_URL,
  EDIT_REVIEW_URL,
  GET_REVIEWS_URL,
} from "../utils/urlConstants";

const initialState = {
  products: [],
  status: "idle",
};

export const fetchReviews = createAsyncThunk(
  "review/fetchReviews",
  async () => {
    try {
      const res = await fetch(GET_REVIEWS_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const addReviewDb = createAsyncThunk(
  "review/addReviewDb",
  async (info) => {
    try {
      const res = await fetch(ADD_REVIEW_URL, {
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
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const editReviewDb = createAsyncThunk(
  "review/editReviewDb",
  async (info) => {
    try {
      const res = await fetch(EDIT_REVIEW_URL, {
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
      return data;
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
