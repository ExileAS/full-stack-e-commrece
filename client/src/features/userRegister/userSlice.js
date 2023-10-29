import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  userEmail: null,
  loggedIn: false,
  userOrderId: null,
  google: false,
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
      return state;
    },
    login(state, action) {
      state.loggedIn = true;
      state.userEmail = action.payload;
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
      }
      return state;
    },
  },
  extraReducers(builder) {
    builder.addCase(checkUser.rejected, (state, action) => {
      console.log(action.payload.err);
      state.loggedIn = false;
      state.userEmail = null;
      state.google = false;
      return state;
    });
  },
});

export const { logout, login, setOrderId, googleLogin, isGoogle } =
  userSlice.actions;

export default userSlice.reducer;
