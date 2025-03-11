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
  isVerified: boolean;
};

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isVerified: !!localStorage.getItem("token")
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signup: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isVerified = !!action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isVerified = !!action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isVerified = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      toast.error("You have been logged out.");
    },
    setVerification: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
  },
});

export const { login, logout, signup, setVerification  } = authSlice.actions;
export default authSlice.reducer;