import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  userEmail: null,
  loggedIn: false,
  userOrderId: null,
  google: false,
  userName: null,
  tempEmail: null,
  tempPassword: null,
  purchaseCount: 0,
  totalPayments: 0,
  verifiedUser: false,
  phoneNumber: null,
  resetAttemptsRemaining: 0,
  totalDiscount: 0,
  currIsSeller: false,
};

const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    logout(state, action) {
      state.loggedIn = false;
      state.userEmail = null;
      state.google = false;
      state.userName = null;
      return state;
    },
    login(state, action) {
      state.loggedIn = true;
      state.tempId = "";
      state.userEmail = action.payload.user;
      state.purchaseCount = action.payload.purchaseCount;
      state.totalPayments = action.payload.totalPayments;
      state.verifiedUser =
        action.payload.purchaseCount >= 3 &&
        action.payload.totalPayments / 100 >= 3000;
      state.userName =
        state.userEmail.substring(0, state.userEmail.indexOf("@")) +
        (state.verifiedUser ? "☆" : "");
      state.phoneNumber = action.payload.phoneNumber;
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
        state.google = true;
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
