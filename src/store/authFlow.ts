import { create } from 'zustand';

type ModalName = 'login' | 'signup' | 'otp' | 'forgotpassword' | 'resetpassword' | null;

interface AuthFlowState {
  currentModal: ModalName;
  setModal: (modal: ModalName) => void;
}

const useAuthFlow = create<AuthFlowState>((set) => {
  const savedModal = (localStorage.getItem('currentModal') as ModalName) || null;

  return {
    currentModal: savedModal,
    setModal: (modal) => {
      localStorage.setItem('currentModal', modal || 'null');
      set({ currentModal: modal });
    },
  };
});

export default useAuthFlow;