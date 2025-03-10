import React from "react";
import useAuthFlow, { useInitAuthFlow } from "@/store/authFlow";
import LoginModal from "@/components/AuthModals/LoginModal";
import SignupModal from "@/components/AuthModals/SignupModal";
import OtpVerificationDialog from "@/components/AuthModals/OtpVerificationDialog";
import ForgotPasswordDialog from "@/components/AuthModals/ForgotPasswordDialog";
import ResetPasswordDialog from "@/components/AuthModals/ResetPasswordDialog";

const ModalController: React.FC = () => {
  useInitAuthFlow();
  const { currentModal, setModal } = useAuthFlow();

  const closeModal = () => setModal("null");

  return (
    <>
      {currentModal === "login" && <LoginModal isOpen onClose={closeModal} />}
      {currentModal === "signup" && <SignupModal isOpen onClose={closeModal} />}
      {currentModal === "otp" && <OtpVerificationDialog isOpen onClose={closeModal} />}
      {currentModal === "forgotpassword" && <ForgotPasswordDialog isOpen onClose={closeModal} />}
      {currentModal === "resetpassword" && <ResetPasswordDialog isOpen onClose={closeModal} />}
    </>
  );
};

export default ModalController;
