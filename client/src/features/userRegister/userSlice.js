import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  userEmail: null,
  loggedIn: false,
  userOrderId: null,
  google: false,
  userName: null,
  userStatus: "unregistered",
  tempEmail: null,
};

export const checkUser = createAsyncThunk("user/checkUser", async () => {
  const res = await fetch("/api/auth", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
});

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
      state.userEmail = action.payload;
      state.userName = state.userEmail.substring(
        0,
        state.userEmail.indexOf("@")
      );
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
    setTempStatus(state, action) {
      console.log(action.payload);
      state.tempEmail = action.payload.email;
      state.userStatus = action.payload.status || "unregistered";
      return state;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkUser.rejected, (state, action) => {
        state.loggedIn = false;
        state.userEmail = null;
        state.google = false;
        state.userStatus = "unregistered";
        return state;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        if (action.payload.err) {
          state.loggedIn = false;
          state.userEmail = null;
          state.google = false;
          state.userStatus = "unregistered";
        } else if (action.payload.verifying) {
          state.userStatus = "verifying";
        } else if (action.payload.valid) {
          state.userStatus = "logged";
        }
        return state;
      });
  },
});

export const {
  logout,
  login,
  setOrderId,
  googleLogin,
  isGoogle,
  setTempStatus,
} = userSlice.actions;

export default userSlice.reducer;
