import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  showLoginModal,
  showSignUpModal,
  showVerifyModal,
  showCreatePasswordModal,
  showForgotPasswordModal,
  hideLoginModal,
  hideSignUpModal,
  hideVerifyModal,
  hideCreatePasswordModal,
  hideForgotPasswordModal,
} from '../slices/authModalSlices';

import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import VerifyModal from './VerifyModal';
import CreatePasswordModal from './CreatePasswordModal';
import ForgotPasswordModal from './ForgotPasswordModal';


function AuthModal() {
  const dispatch = useDispatch();
  const loginModalVisible = useSelector((state) => state.authModal.loginModalVisible);
  const signUpModalVisible = useSelector((state) => state.authModal.signUpModalVisible);
  const verifyModalVisible = useSelector((state) => state.authModal.verifyModalVisible);
  const createPasswordModalVisible = useSelector((state) => state.authModal.createPasswordModalVisible);
  const forgotPasswordModalVisible = useSelector((state) => state.authModal.forgotPasswordModalVisible);

  const openLoginModal = () => {
    dispatch(showLoginModal());
  };

  const closeLoginModal = () => {
    dispatch(hideLoginModal());
  };

  const openSignUpModal = () => {
    dispatch(showSignUpModal());
  };

  const closeSignUpModal = () => {
    dispatch(hideSignUpModal());
  };

  const openVerifyModal = () => {
    dispatch(showVerifyModal());
  };

  const closeVerifyModal = () => {
    dispatch(hideVerifyModal());
  };

  const openCreatePasswordModal = () => {
    dispatch(showCreatePasswordModal());
  };

  const closeCreatePasswordModal = () => {
    dispatch(hideCreatePasswordModal());
  };

  const openForgotPasswordModal = () => {
    dispatch(showForgotPasswordModal());
  };

  const closeForgotPasswordModal = () => {
    dispatch(hideForgotPasswordModal());
  };

  return (
    <>
      {/* Render modals based on their visibility state */}
      {loginModalVisible && (
        <LoginModal isOpen={openLoginModal} isClose={closeLoginModal} />
      )}
      {signUpModalVisible && (
        <SignUpModal isOpen={openSignUpModal} isClose={closeSignUpModal} />
      )}
      {verifyModalVisible && (
        <VerifyModal isOpen={openVerifyModal} isClose={closeVerifyModal} />
      )}
      {createPasswordModalVisible && (
        <CreatePasswordModal isOpen={openCreatePasswordModal} isClose={closeCreatePasswordModal} />
      )}
      {forgotPasswordModalVisible && (
        <ForgotPasswordModal isOpen={openForgotPasswordModal} isClose={closeForgotPasswordModal} />
      )}
    </>
  );
}

export default AuthModal;