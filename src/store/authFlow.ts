import { create } from "zustand";
import { useEffect } from "react";

type ModalName = "login" | "signup" | "otp" | "forgotpassword" | "resetpassword" | "null";
type AuthFlowType = "signup" | "forgotpassword" | "null";

interface AuthFlowState {
  currentModal: ModalName;
  authFlowType: AuthFlowType; 
  setModal: (modal: ModalName) => void;
  setAuthFlowType: (type: AuthFlowType) => void; 
}

const useAuthFlow = create<AuthFlowState>((set) => ({
  currentModal: "null", 
  authFlowType: "null", 
  setModal: (modal) => {
    localStorage.setItem("currentModal", modal);
    set({ currentModal: modal });
  },
  setAuthFlowType: (type) => {
    localStorage.setItem("authFlowType", type || "");
    set({ authFlowType: type });
  },
}));

export const useInitAuthFlow = () => {
  const setModal = useAuthFlow((state) => state.setModal);
  const setAuthFlowType = useAuthFlow((state) => state.setAuthFlowType);

  useEffect(() => {
    const storedModal = (localStorage.getItem("currentModal") as ModalName) || "null";
    const storedAuthFlowType = (localStorage.getItem("authFlowType") as AuthFlowType) || "null";
    
    setModal(storedModal);
    setAuthFlowType(storedAuthFlowType);
  }, [setModal, setAuthFlowType]);
};

export default useAuthFlow;
