import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  currentUserAdmin: null,
  users: [],
  loading: false,
  error: false,
  isAdmin: false,
  resetEmail: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setResetEmail: (state, action) => {
      state.resetEmail = action.payload;
    },
    clearResetEmail: (state) => {
      state.resetEmail = null;
    },
    signinStart: (state) => {
      state.loading = false;
      state.error = false;
    },
    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
      state.isAdmin = false;
    },
    signinFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
      state.isAdmin = false;
    },

    // Admin Sign-in Actions
    adminSigninStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    adminSigninSuccess: (state, action) => {
      state.currentUserAdmin = action.payload;
      state.loading = false;
      state.error = false;
      state.isAdmin = true;
    },
    adminSigninFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    adminSignOut: (state) => {
      state.currentUserAdmin = null;
      state.loading = false;
      state.error = false;
      state.isAdmin = false;
    },
  },
});

export const {
  setResetEmail,
  clearResetEmail,
  signinStart,
  signinSuccess,
  signinFailure,
  signOut,
  adminSigninStart,
  adminSigninSuccess,
  adminSigninFailure,
  adminSignOut
} = userSlice.actions;
export default userSlice.reducer;
