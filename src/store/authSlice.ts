import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("user"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signup: (state, action: PayloadAction<User>) => {
      console.log("SIGNUP Auth")
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    login: (state, action: PayloadAction<User>) => {
      console.log("LOGIN Auth")
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      console.log("LOGOUT Auth")
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      alert("You have been logged out.");
    },
  },
});

export const { login, logout, signup } = authSlice.actions;
export default authSlice.reducer;
