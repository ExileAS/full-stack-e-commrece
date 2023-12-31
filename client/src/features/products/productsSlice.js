import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET_PRODUCTS_URL } from "../utils/urlConstants";

const initialState = {
  products: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    try {
      const res = await fetch(GET_PRODUCTS_URL, {
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
    productUnSelected(state, action) {
      const { productId } = action.payload;
      const product = state.products.find(
        (product) => product.id === productId
      );
      if (product) {
        product.selected = false;
      }
    },
    addNewProduct(state, action) {
      state.products.push(action.payload);
      return state;
    },
    editExisting(state, action) {
      const existing = state.products.find(
        ({ id }) => id === action.payload.id
      );
      if (existing) {
        state.products = state.products.filter(
          ({ id }) => id !== existing.id || action.payload
        );
      }
      return state;
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
      return state;
    },
    setProductState(state, action) {
      state.products = action.payload;
      return state;
    },
    attatchReviews(state, action) {
      state.products = state.products.map((product) => {
        const current = action.payload.find(
          ({ productId }) => productId === product.id
        );
        return {
          ...product,
          rating: current ? current.info.rating : 0,
        };
      });
      return state;
    },
    clearProducts: () => initialState,
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
        const res = action.payload.result.map((product) => {
          product.img = `${process.env.REACT_APP_PROXY_DEV}/images/${product.img}`;
          return product;
        });
        state.products = [...res];
        return state;
      });
  },
});

export const {
  productAdded,
  deleteProduct,
  productSelected,
  productUnSelected,
  removeProduct,
  setProductState,
  countNewOnhand,
  attatchReviews,
  clearProducts,
  addNewProduct,
  editExisting,
} = productsSlice.actions;

export default productsSlice.reducer;

export const checkSelected = (state, id) =>
  state.products.products.find((product) => product.id === id)?.selected;

export const getAllSelected = (state) =>
  state.products.products.filter((product) => product.selected);

export const selectAllProducts = (state) => state.products.products;

export const selectProductById = (state, id) =>
  state.products.products.find((product) => product.id === id);

export const selectProductsBySeller = (state, seller) =>
  state.products.products.filter((product) => product.seller === seller?.name);

export const generateId = (state) => {
  const products = state.products.products;
  let max = 0;
  products.forEach((element) => {
    max = max > Number(element.id) ? max : Number(element.id);
  });
  return `${1 + max}`;
};
