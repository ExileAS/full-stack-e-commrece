import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
};

export const postOrdered = createAsyncThunk(
  "shoppingCart/postOrdered",
  async ({ token, verifiedUser }, { getState }) => {
    console.log("POSTING!");
    const state = getState();
    try {
      const res = await fetch("/api/post-ordered", {
        method: "POST",
        body: JSON.stringify({
          list: state.shoppingCart.ordered,
          customerInfo: state.shoppingCart.customerInfo,
          verifiedUser,
        }),
        headers: { "Content-Type": "application/json", "csrf-token": token },
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
  async (isPaid, { getState }) => {
    const state = getState();
    const listUpdates = state.shoppingCart.ordered.length
      ? state.shoppingCart.ordered
      : state.shoppingCart.payedOrder;
    try {
      const res = await fetch("/api/updateOrder", {
        method: "PATCH",
        body: JSON.stringify({
          customerInfo: state.shoppingCart.customerInfo,
          list: listUpdates,
          confirmId: state.shoppingCart.confirmId,
          payedOrder: isPaid,
          isSplit: state.shoppingCart.isSplit,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = res.json();
      return data;
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
    clearCustomerInfo: () => initialState,
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
    setStartedAt(state, action) {
      state.shipmentStartedAt = action.payload;
      return state;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(postOrdered.fulfilled, (state, action) => {
        state.confirmId = action.payload;
        return state;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.payedId = action.payload.newId || state.payedId;
        return state;
      })
      .addCase(retrieveOrderedList.fulfilled, (state, action) => {
        if (!action.payload) return state;
        state.customerInfo = action.payload.customerInfo;
        if (action.payload.isSplit) {
          state.isSplit = true;
          state.ordered = action.payload.orderedUnpaid;
          state.payedOrder = action.payload.orderedPaid;
          state.confirmId = action.payload.orderId;
          state.payedId = action.payload.payedId;
          state.shipmentStartedAt = action.payload.startedAt;
          return state;
        }
        if (action.payload.payed) {
          state.payedOrder = action.payload.ordered;
          state.payedId = action.payload.orderId;
          state.isSplit = false;
          state.shipmentStartedAt = action.payload.startedAt;
        } else {
          state.ordered = action.payload.ordered;
          state.confirmId = action.payload.orderId;
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
  setStartedAt,
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
