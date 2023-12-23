import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  userEmail: null,
  loggedIn: false,
  userOrderId: null,
  googleAccount: false,
  userName: null,
  tempEmail: null,
  purchaseCount: 0,
  totalPayments: 0,
  isVIP: false,
  phoneNumber: null,
  resetAttemptsRemaining: 0,
  totalDiscount: 0,
  currIsSeller: false,
  listings: [],
};

const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    logout(state, action) {
      state.loggedIn = false;
      state.userEmail = null;
      state.googleAccount = false;
      state.userName = null;
      return state;
    },
    login(state, action) {
      const payload = action.payload;
      state.loggedIn = true;
      state.tempId = "";
      state.userEmail = payload.user;
      state.purchaseCount = payload.purchaseCount;
      state.totalPayments = payload.totalPayments;
      state.isVIP = payload.specialCustomer;
      state.userName =
        payload.user.substring(0, payload.user.indexOf("@")) +
        (state.isVIP ? "★" : "");
      state.phoneNumber = payload.phoneNumber;
      state.listings = payload.listings || [];
      state.currIsSeller = Boolean(payload.listings);
      return state;
    },
    setOrderId(state, action) {
      state.userOrderId = action.payload;
      return state;
    },
    googleLogin(state, action) {
      const user = jwtDecode(action.payload);
      if (user) {
        state.loggedIn = true;
        state.userEmail = user.email;
        state.googleAccount = true;
        state.userName = state.userEmail.substring(
          0,
          state.userEmail.indexOf("@")
        );
      }
      return state;
    },
    setTempEmail(state, action) {
      state.tempEmail = action.payload;
      return state;
    },
    setRemainingAttempts(state, action) {
      state.resetAttemptsRemaining = action.payload;
      return state;
    },
    setTotalDiscount(state, action) {
      state.totalDiscount = action.payload;
      return state;
    },
    setSellerPhone(state, action) {
      state.phoneNumber = action.payload;
      state.currIsSeller = true;
      return state;
    },
    setTempPassword(state, action) {
      state.tempPassword = action.payload;
      return state;
    },
    clearUserInfo: () => initialState,
  },
});

export const {
  logout,
  login,
  setOrderId,
  googleLogin,
  isGoogle,
  setTempEmail,
  setRemainingAttempts,
  setTotalDiscount,
  setSellerPhone,
  clearUserInfo,
} = userSlice.actions;

export default userSlice.reducer;
