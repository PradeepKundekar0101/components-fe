import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the types for the signup flow state
export interface SignupFlowState {
  currentStep: 'signup' | 'otp' | null;
  userEmail: string | null;
  userId: string | null;
  
  // Actions
  startSignupFlow: (email: string) => void;
  moveToOtpStep: (userId: string) => void;
  resetFlow: () => void;
  cancelFlow: () => void;
}

export const useSignupFlowStore = create<SignupFlowState>()(
  persist(
    (set, get) => ({
      currentStep: null,
      userEmail: null,
      userId: null,
      
      startSignupFlow: (email) => set({ 
        currentStep: 'signup', 
        userEmail: email,
        userId: null
      }),
      
      moveToOtpStep: (userId) => set({ 
        currentStep: 'otp',
        userId: userId
      }),
      
      resetFlow: () => set({ 
        currentStep: null, 
        userEmail: null,
        userId: null 
      }),
      
      cancelFlow: async () => {
        const { userId } = get();
        
        // TODO: Implement actual API call to delete user
        if (userId) {
          try {
            // Example: await deleteUser(userId);
            console.log('User deletion API call');
          } catch (error) {
            console.error('Failed to delete user', error);
          }
        }
        
        // Reset the flow
        set({ 
          currentStep: null, 
          userEmail: null,
          userId: null 
        });
      }
    }),
    {
      name: 'signup-flow-storage', // unique name
      partialize: (state) => ({
        currentStep: state.currentStep,
        userEmail: state.userEmail,
        userId: state.userId
      })
    }
  )
);