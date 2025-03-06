import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string; // Make password optional
  token?: string;    // Add token field
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean; // Add verification state
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
      console.log("SIGNUP Auth", action.payload);
      state.user = action.payload;
      state.isAuthenticated = false;
      state.isVerified = false;
    },
    login: (state, action: PayloadAction<User>) => {
      console.log("LOGIN Auth");
      const { password, ...userWithoutPassword } = action.payload;
      
      state.user = userWithoutPassword;
      state.isAuthenticated = true;
      state.isVerified = true;
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      toast.success("Login successful!");
    },
    logout: (state) => {
      console.log("LOGOUT Auth");
      state.user = null;
      state.isAuthenticated = false;
      state.isVerified = false;
      localStorage.removeItem("user");
      toast.info("You have been logged out.");
    },
  },
});

export const { login, logout, signup } = authSlice.actions;
export default authSlice.reducer;