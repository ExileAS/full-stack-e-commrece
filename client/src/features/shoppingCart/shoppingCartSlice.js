import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import exponentialBackoff from "../utils/exponentialBackoff";
import {
  DELETE_ORDER_URL,
  POST_ORDERED_URL,
  RETRIVE_ORDERED_URL,
  UPDATE_ORDER_URL,
} from "../utils/urlConstants";

const initialState = {
  cart: [],
  ordered: [],
  confirmId: null,
  customerInfo: {},
  orderInfo: "undelivered",
  payment: false,
  payedOrder: [],
  payedId: null,
  isSplit: false,
  shipmentStartedAt: null,
  totalPayment: 0,
};

export const postOrdered = createAsyncThunk(
  "shoppingCart/postOrdered",
  async ({ token, verifiedUser }, { getState }) => {
    const state = getState();
    const postOrderedFn = async () => {
      try {
        const res = await fetch(POST_ORDERED_URL, {
          method: "POST",
          body: JSON.stringify({
            list: state.shoppingCart.ordered,
            customerInfo: state.shoppingCart.customerInfo,
            verifiedUser,
          }),
          credentials: "include",
          headers: { "Content-Type": "application/json", "csrf-token": token },
        });
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    };
    return await exponentialBackoff(postOrderedFn);
  }
);

export const retrieveOrderedList = createAsyncThunk(
  "shoppingCart/retrieveOrderedList",
  async ({ userEmail, token }) => {
    const retrieveOrderFn = async () => {
      try {
        const res = await fetch(RETRIVE_ORDERED_URL, {
          method: "POST",
          body: JSON.stringify({ userEmail }),
          credentials: "include",
          headers: { "Content-Type": "application/json", "csrf-token": token },
        });
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    };
    return await exponentialBackoff(retrieveOrderFn);
  }
);

export const updateOrder = createAsyncThunk(
  "shoppingCart/updateOrder",
  async ({ isPaid, token }, { getState }) => {
    const state = getState();
    const listUpdates = state.shoppingCart.ordered.length
      ? state.shoppingCart.ordered
      : state.shoppingCart.payedOrder;
    const updateFn = async () => {
      try {
        const res = await fetch(UPDATE_ORDER_URL, {
          method: "PATCH",
          body: JSON.stringify({
            customerInfo: state.shoppingCart.customerInfo,
            list: listUpdates,
            confirmId: state.shoppingCart.confirmId,
            payedOrder: isPaid,
            isSplit: state.shoppingCart.isSplit,
          }),
          credentials: "include",
          headers: { "Content-Type": "application/json", "csrf-token": token },
        });
        const data = res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    };
    return await exponentialBackoff(updateFn);
  }
);

export const clearInDB = createAsyncThunk(
  "shoppingCart/clearInDB",
  async ({ confirmId, token }) => {
    const clearFn = async () => {
      try {
        const res = await fetch(DELETE_ORDER_URL, {
          method: "DELETE",
          body: JSON.stringify({ confirmId }),
          credentials: "include",
          headers: { "Content-Type": "application/json", "csrf-token": token },
        });
        const data = await res.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    };
    return await exponentialBackoff(clearFn);
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
      console.log(state.ordered);
      if (state.ordered?.length > 0) {
        action.payload.orderedInCart.forEach((product) => {
          let exists = false;
          state.ordered.forEach((ordered) => {
            if (ordered.id === product.id) {
              ordered.count += product.count;
              exists = true;
            }
          });
          if (!exists) state.ordered.push(product);
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
    createOrderedList(state, action) {
      state.ordered = action.payload;
      return state;
    },
    confirmPayment(state, action) {
      state.payment = true;
      const order = [...state.payedOrder, ...state.ordered];
      if (!state.payedOrder.length) {
        state.payedOrder = order;
        state.ordered = [];
        return state;
      }
      const updated = state.payedOrder
        .map((product) => {
          const existing = state.ordered.find(({ id }) => product.id === id);
          if (existing) {
            return {
              ...product,
              count: product.count + 1,
            };
          }
          return product;
        })
        .concat(state.ordered);

      const filtered = updated.filter((product, ind) => {
        return (
          ind === updated.indexOf(updated.find(({ id }) => product.id === id))
        );
      });
      state.payedOrder = filtered;
      state.ordered = [];
      return state;
    },
    setOrderInfo(state, action) {
      state.shipmentStartedAt = action.payload.startedAt;
      state.totalPayment = action.payload.totalPayment || 0;
      return state;
    },
    clearCustomerInfo: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(postOrdered.fulfilled, (state, action) => {
        state.confirmId = action.payload?.confirmId;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.payedId = action.payload.newId || state.payedId;
      })
      .addCase(retrieveOrderedList.fulfilled, (state, action) => {
        if (!action.payload) return;
        const payload = action.payload;
        state.customerInfo = payload.customerInfo;
        if (payload.isSplit) {
          state.isSplit = true;
          state.ordered = payload.orderedUnpaid || [];
          state.payedOrder = payload.orderedPaid || [];
          state.confirmId = payload.orderId;
          state.payedId = payload.payedId;
          state.shipmentStartedAt = payload.startedAt;
          return state;
        }
        if (payload.payed) {
          state.payedOrder = payload.ordered || [];
          state.payedId = payload.orderId;
          state.isSplit = false;
          state.shipmentStartedAt = payload.startedAt;
        } else {
          state.ordered = payload.ordered || [];
          state.confirmId = payload.orderId;
          state.isSplit = false;
        }
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
  confirmPayment,
  setOrderInfo,
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
