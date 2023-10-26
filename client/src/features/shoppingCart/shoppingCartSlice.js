import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  ordered: [],
  confirmId: null,
  customerInfo: {},
  orderInfo: "undelivered",
  payment: false,
  payedOrder: [],
};

export const checkUserCart = createAsyncThunk(
  "shoppingCart/checkUser",
  async () => {
    const res = await fetch("/api/auth", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data;
  }
);

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
      if (!data.error) return data;
      console.log(data.error);
      return data.error;
    } catch (err) {
      console.log(err);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "shoppingCart/updateOrder",
  (_, { getState }) => {
    const state = getState();
    try {
      fetch("/api/updateOrder", {
        method: "PATCH",
        body: JSON.stringify({
          customerInfo: state.shoppingCart.customerInfo,
          list: state.shoppingCart.ordered,
          confirmId: state.shoppingCart.confirmId,
        }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.log(err);
    }
  }
);

export const clearInDB = createAsyncThunk(
  "shoppingCart/clearInDB",
  (confirmId) => {
    try {
      fetch("/api/deleteOrder", {
        method: "DELETE",
        body: JSON.stringify({ confirmId }),
        headers: { "Content-Type": "application/json" },
      });
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
          selected: false,
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
      state.payedOrder = [];
      return state;
    },
    productsOrdered(state, action) {
      if (state.ordered.length > 0) {
        action.payload.orderedInCart.forEach((product) => {
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
    confirmPayment(state, action) {
      state.payment = true;
      // state.payedOrder = [...state.ordered];
      // state.ordered = [];
      // return state;
      state.payedOrder = [...state.payedOrder, ...state.ordered];
      state.ordered = [];
      return state;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(postOrdered.fulfilled, (state, action) => {
        state.confirmId = action.payload;
        return state;
      })
      .addCase(retrieveOrderedList.fulfilled, (state, action) => {
        state.customerInfo = action.payload.customerInfo;
        state.orderInfo = action.payload.orderInfo;
        state.confirmId = action.payload.orderId;
        if (action.payload.payed) {
          state.payedOrder = action.payload.ordered;
        } else {
          state.ordered = action.payload.ordered;
        }
        return state;
      })
      .addCase(checkUserCart.rejected, (state, action) => {
        state.ordered = [];
        state.cart = [];
        state.confirmId = null;
        state.customerInfo = {};
        return state;
      })
      .addCase(checkUserCart.fulfilled, (state, action) => {
        if (action.payload.err) {
          state.ordered = [];
          state.cart = [];
          state.confirmId = null;
          state.customerInfo = {};
          return state;
        }
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
  confirmPayment,
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
export const selectAllConfirmed = (state) => state.shoppingCart.payedOrder;
export const getTotalCostOrdered = (state) =>
  state.shoppingCart.ordered &&
  state.shoppingCart.ordered.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );
export const getCartLength = (state) => state.shoppingCart.cart.length;
