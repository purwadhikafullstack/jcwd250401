import React, { useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

function AuthModal() {
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignUpModal(false);
  };

  const openSignUpModal = () => {
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