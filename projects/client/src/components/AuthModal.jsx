import React, { useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import VerifyModal from "./VerifyModal";
import CreatePasswordModal from "./CreatePasswordModal";
import ForgotPasswordModal from "./ForgotPasswordModal";

function AuthModal() {
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

  const CreatePassswordModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
  };

  const ForgotPasswordModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };





  return (
    <>
      {showLoginModal && <LoginModal isOpen={showLoginModal} isClose={openSignUpModal} openSignUpModal={openSignUpModal} />}
      {showSignUpModal && <SignUpModal isOpen={showSignUpModal} isClose={openLoginModal} openLoginModal={openLoginModal} />}
    </>
  );
}

export default AuthModal;