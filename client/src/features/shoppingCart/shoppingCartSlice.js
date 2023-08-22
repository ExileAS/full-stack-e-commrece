import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  ordered: [],
  confirmId: null,
  customerInfo: {},
};

export const postOrdered = createAsyncThunk(
  "shoppingCart/postOrdered",
  async (_, { getState }) => {
    const state = getState();
    try {
      const res = await fetch("/api/post-ordered", {
        method: "POST",
        body: JSON.stringify({
          list: state.shoppingCart.ordered,
          customerInfo: state.shoppingCart.customerInfo,
        }),
        headers: { "Content-Type": "application/json" },
      });
      console.log(res);
      const data = await res.json();
      if (data.confirmId) {
        return data.confirmId;
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const retrieveOrderedList = createAsyncThunk(
  "shoppingCart/retrieveOrderedList",
  async (userEmail) => {
    try {
      const res = await fetch("/api/retrieveOrdered", {
        method: "POST",
        body: JSON.stringify({ userEmail }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

const shoppingCartSlice = createSlice({
  initialState,
  name: "shoppingCart",
  reducers: {
    addToShoppingCart(state, action) {
      const { id } = action.payload;
      const product = state.cart.find((product) => product.id === id);
      if (action.payload.onhand !== 0 && !product) {
        action.payload = {
          ...action.payload,
          count: 1,
        };
        action.payload.onhand--;
        state.cart.push(action.payload);
      }
    },
    incrementInCart(state, action) {
      const { id } = action.payload;
      const product = state.cart.find((product) => product.id === id);
      if (product.onhand !== 0) {
        product.count++;
        product.onhand--;
      }
    },
    decrementInCart(state, action) {
      const id = action.payload;
      const product = state.cart.find((product) => product.id === id);
      if (product.count === 1) {
        state.cart = state.cart.filter((product) => product.id !== id);
        return state;
      }
      product.count--;
      product.onhand++;
    },
    clearShoppingCart(state, action) {
      state.cart = [];
      return state;
    },
    clearOrdered(state, action) {
      state.ordered = [];
      return state;
    },
    productsOrdered(state, action) {
      if (state.ordered.length > 0) {
        action.payload.ordered.forEach((product) => {
          let exists = false;
          state.ordered.forEach((ordered) => {
            if (ordered.id === product.id) {
              ordered.count += product.count;
              exists = true;
            }
          });
          !exists && state.ordered.push(product);
        });
        state.customerInfo = action.payload.userInfo;
        state.cart = [];
        return state;
      }

      state.ordered = [...state.ordered, ...state.cart];
      state.customerInfo = action.payload.userInfo;
      state.cart = [];
    },
    removeOrder(state, action) {
      const id = action.payload;
      state.ordered = state.ordered.filter((product) => product.id !== id);
    },
    decrementInOrdered(state, action) {
      const id = action.payload;
      const product = state.ordered.find((product) => product.id === id);
      if (product.count === 1) {
        state.ordered = state.ordered.filter((product) => product.id !== id);
        return state;
      }
      product.count--;
    },
    clearCustomerInfo(state, action) {
      state.customerInfo = [];
      return state;
    },
    createOrderedList(state, action) {
      state.ordered = action.payload;
      return state;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(postOrdered.fulfilled, (state, action) => {
        console.log(action.payload);
        state.confirmId = action.payload;
        return state;
      })
      .addCase(retrieveOrderedList.fulfilled, (state, action) => {
        console.log(action.payload);
        state.ordered = action.payload.ordered;
        state.customerInfo = action.payload.customerInfo;
        return state;
      });
  },
});

export default shoppingCartSlice.reducer;
export const {
  addToShoppingCart,
  incrementInCart,
  decrementInCart,
  clearShoppingCart,
  clearOrdered,
  productsOrdered,
  decrementInOrdered,
  removeOrder,
  clearCustomerInfo,
  createOrderedList,
} = shoppingCartSlice.actions;
export const selectAllInCart = (state) => state.shoppingCart.cart;
export const getTotalCost = (state) =>
  state.shoppingCart.cart.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );
export const checkAdded = (state, id) =>
  state.shoppingCart.cart.find((product) => product.id === id) === undefined
    ? false
    : true;
export const selectAllOrdered = (state) => state.shoppingCart.ordered;
export const getTotalCostOrdered = (state) =>
  state.shoppingCart.ordered &&
  state.shoppingCart.ordered.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );
