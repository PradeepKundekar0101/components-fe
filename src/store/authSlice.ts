import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  token?: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean;
};

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("user") && !!JSON.parse(localStorage.getItem("user") || "null")?.token,
  isVerified: !!localStorage.getItem("user") && !!JSON.parse(localStorage.getItem("user") || "null")?.token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signup: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = false;
      state.isVerified = false;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isVerified = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isVerified = false;
      localStorage.removeItem("user");
      toast.error("You have been logged out.");
    },
  },
});

export const { login, logout, signup } = authSlice.actions;
export default authSlice.reducer;