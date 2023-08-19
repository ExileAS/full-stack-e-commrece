import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  userEmail: null,
  loggedIn: false,
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
      return state;
    },
    login(state, action) {
      state.loggedIn = true;
      state.userEmail = action.payload;
      return state;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkUser.fulfilled, (state, action) => {
        state.loggedIn = true;
        state.userEmail = action.payload.user;
        return state;
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.loggedIn = false;
        state.userEmail = null;
        return state;
      });
  },
});

export const { logout, login } = userSlice.actions;

export default userSlice.reducer;
