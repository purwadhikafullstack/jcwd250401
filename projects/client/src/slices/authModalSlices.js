import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginModalVisible: false,
  signUpModalVisible: false,
  verifyModalVisible: false,
  createPasswordModalVisible: false,
  forgotPasswordModalVisible: false,
  email: "",
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    showLoginModal: (state) => {
      state.loginModalVisible = true;
    },
    hideLoginModal: (state) => {
      state.loginModalVisible = false;
    },
    showSignUpModal: (state) => {
      state.signUpModalVisible = true;
    },
    hideSignUpModal: (state) => {
      state.signUpModalVisible = false;
    },
    showVerifyModal: (state) => {
      state.verifyModalVisible = true;
    },
    hideVerifyModal: (state) => {
      state.verifyModalVisible = false;
    },
    showCreatePasswordModal: (state) => {
      state.createPasswordModalVisible = true;
    },
    hideCreatePasswordModal: (state) => {
      state.createPasswordModalVisible = false;
    },
    showForgotPasswordModal: (state) => {
      state.forgotPasswordModalVisible = true;
    },
    hideForgotPasswordModal: (state) => {
      state.forgotPasswordModalVisible = false;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { showLoginModal, hideLoginModal, showSignUpModal, hideSignUpModal, showVerifyModal, hideVerifyModal, showCreatePasswordModal, hideCreatePasswordModal, showForgotPasswordModal, hideForgotPasswordModal, setEmail } =
  authModalSlice.actions;

export default authModalSlice.reducer;
