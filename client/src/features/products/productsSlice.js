import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await fetch("/api/all-products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data;
  }
);

const productsSlice = createSlice({
  initialState,
  name: "products",
  reducers: {
    productSelected(state, action) {
      const { productId } = action.payload;
      const product = state.products.find(
        (product) => product.id === productId
      );
      if (product) {
        product.selected = true;
      }
    },
    removeProduct(state, action) {
      const { id } = action.payload;
      state = state.products.filter((product) => product.id !== id);
      return state;
    },
    countNewOnhand(state, action) {
      state.products.forEach((product) => {
        action.payload.forEach((ordered) => {
          product.id === ordered.id &&
            product.onhand - ordered.count >= 0 &&
            (product.onhand -= ordered.count);
        });
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "success";
        state.products = [...state.products, ...action.payload.result];
        return state;
      });
  },
});

export const {
  productAdded,
  deleteProduct,
  productSelected,
  removeProduct,
  countNewOnhand,
} = productsSlice.actions;

export default productsSlice.reducer;

export const selectAllProducts = (state) => state.products.products;
export const selectProductById = (state, id) =>
  state.products.products.find((product) => product.id === id);
export const selectProductsByUser = (state, user) =>
  state.products.products.filter((product) => product.seller === user.name);

export const generateId = (state) => {
  const products = state.products.products;
  let max = 0;
  products.forEach((element) => {
    max = max > Number(element.id) ? max : Number(element.id);
  });
  return `${1 + max}`;
};
