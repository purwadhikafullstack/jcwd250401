import React, { useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import VerifyModal from "./VerifyModal";
import CreatePasswordModal from "./CreatePasswordModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { useSelector, useDispatch } from "react-redux";
import { hideModal } from "../slices/authModalSlices";

function AuthModal() {
  const isAuthModalVisible = useSelector((state) => state.authModal.isOpen); // Change state property name to "isVisible"
  const dispatch = useDispatch();
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignUpModal(false);
  };

  const openSignUpModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  const openVerifyModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
    setShowVerifyModal(true);
  };

  const openCreatePasswordModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
    setShowVerifyModal(false);
    setShowCreatePasswordModal(true);
  };

  const openForgotPasswordModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
    setShowVerifyModal(false);
    setShowCreatePasswordModal(false);
    setShowForgotPasswordModal(true);
  };

  const closeModal = () => {
    dispatch(hideModal()); // Dispatch the hideModal action
  };

  return (
    <>
      {isAuthModalVisible && (
        <>
          {showLoginModal && <LoginModal isOpen={showLoginModal} isClose={closeModal} openSignUpModal={openSignUpModal} openForgotPasswordModal={openForgotPasswordModal} />}
          {showSignUpModal && <SignUpModal isOpen={showSignUpModal} isClose={closeModal} openLoginModal={openLoginModal} />}
          {showVerifyModal && <VerifyModal isOpen={showVerifyModal} isClose={closeModal} />}
          {showCreatePasswordModal && <CreatePasswordModal isOpen={showCreatePasswordModal} isClose={closeModal} />}
          {showForgotPasswordModal && <ForgotPasswordModal isOpen={showForgotPasswordModal} isClose={closeModal} />}
        </>
      )}
    </>
  );
}

export default AuthModal;
