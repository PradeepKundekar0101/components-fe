import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the types for the signup flow state
export interface SignupFlowState {
  currentStep: 'signup' | 'otp' | 'resetPassword' | 'login' | null;
  userEmail: string | null;
  userId: string | null;
  otpValue: string | null;
  
  // Actions
  startSignupFlow: (email: string) => void;
  moveToOtpStep: (userId: string) => void;
  setOtpValue: (otp: string) => void;
  moveToResetPasswordStep: () => void;
  completeResetPassword: () => void;
  moveToLoginStep: () => void;
  resetFlow: () => void;
  cancelFlow: () => void;
}

export const useSignupFlowStore = create<SignupFlowState>()(
  persist(
    (set) => ({
      currentStep: null,
      userEmail: null,
      userId: null,
      otpValue: null,
      
      startSignupFlow: (email) => set({ 
        currentStep: 'signup', 
        userEmail: email,
        userId: null,
        otpValue: null
      }),
      
      moveToOtpStep: (userId) => set({ 
        currentStep: 'otp',
        userId: userId
      }),

      setOtpValue: (otp) => set({
        otpValue: otp
      }),
      
      moveToResetPasswordStep: () => set({
        currentStep: 'resetPassword'
      }),
      
      completeResetPassword: () => set({
        currentStep: 'login'
      }),
      
      moveToLoginStep: () => set({
        currentStep: 'login'
      }),
      
      resetFlow: () => set({ 
        currentStep: null, 
        userEmail: null,
        userId: null,
        otpValue: null
      }),
      
      cancelFlow: async () => {
        set({ 
          currentStep: null, 
          userEmail: null,
          userId: null,
          otpValue: null
        });
      }
    }),
    {
      name: 'signup-flow-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        userEmail: state.userEmail,
        userId: state.userId,
        otpValue: state.otpValue
      })
    }
  )
);