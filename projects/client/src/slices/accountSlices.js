import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //Login
  isLogin: window.localStorage.getItem("isLoggedIn") === "true",
  profile: window.localStorage.getItem("profile") ? JSON.parse(window.localStorage.getItem("profile")) : {},
  showUnauthorizedModal: false,
  redirectTo: "",
  userPhotoProfile: "",
};
const accountSlices = createSlice({
  name: "account",
  initialState,
  reducers: {
    //Login
    login(state, action) {
      state.isLogin = true;
      state.profile = action.payload;
      window.localStorage.setItem("isLoggedIn", "true");
      window.localStorage.setItem("profile", JSON.stringify(action.payload));
    },
    logout(state) {
      state.isLogin = false;
      state.profile = {};
      window.localStorage.setItem("isLoggedIn", false);
      window.localStorage.setItem("profile", JSON.stringify({}));
    },
    showUnauthorizedModal(state, action) {
      state.showUnauthorizedModal = true;
      state.redirectTo = action.payload;
    },
    hideUnauthorizeModal(state) {
      state.showUnauthorizedModal = false;
      state.redirectTo = "";
    },
    updateProfile(state, action) {
      state.profile = action.payload;
    },
  },
});

export const { login, logout, showUnauthorizedModal, hideUnauthorizeModal, updateProfile } = accountSlices.actions;
export default accountSlices.reducer;
