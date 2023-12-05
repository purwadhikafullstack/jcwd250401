import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //Login
  isLogin: window.localStorage.getItem("isLoggedIn") === "true",
  isLoginAdmin: window.localStorage.getItem("isLoggedInAdmin") === "true",
  profile: window.localStorage.getItem("profile") ? JSON.parse(window.localStorage.getItem("profile")) : {},
  adminProfile: window.localStorage.getItem("adminProfile") ? JSON.parse(window.localStorage.getItem("adminProfile")) : {},
  username: "",
  showUnauthorizedModal: false,
  redirectTo: "",
  userPhotoProfile: "",
  isWarehouseAdmin: false,
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
    loginAdmin(state, action) {
      state.isLoginAdmin = true;
      state.adminProfile = action.payload;
      window.localStorage.setItem("isLoggedInAdmin", "true");
      window.localStorage.setItem("adminProfile", JSON.stringify(action.payload));
    },
    logoutAdmin(state) {
      state.isLoginAdmin = false;
      state.profile = {};
      window.localStorage.setItem("isLoggedInAdmin", false);
      window.localStorage.setItem("adminProfile", JSON.stringify({}));
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
    updateProfileAdmin(state, action) {
      state.adminProfile = action.payload;
      window.localStorage.setItem("adminProfile", JSON.stringify(action.payload));
    },
    setIsWarehouseAdmin(state, action) {
      state.isWarehouseAdmin = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
  },
});

export const { login, logout, loginAdmin, logoutAdmin, showUnauthorizedModal, hideUnauthorizeModal, updateProfile, updateProfileAdmin, setIsWarehouseAdmin, setUsername } = accountSlices.actions;
export default accountSlices.reducer;
