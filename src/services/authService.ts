import api from '@/config/axios';
import { SignupFormValues } from '@/schemas/auth-schema';
import { toast } from 'react-toastify';
import useAuthFlow from '@/store/authFlow';

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  token?: string;
}

export interface ApiResponse {
  status: number;
  data: any;
}

class AuthService {
  async signup(userData: Omit<SignupFormValues, 'confirmPassword'>): Promise<ApiResponse> {
    try {
      const requestData = {
        firstname: userData.firstName,
        lastname: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password
      };

      const response = await api.post('/api/v1/auth/signup', requestData);
      
      if (response.status === 201 || response.status === 200) {
        localStorage.setItem('email', userData.email);
        localStorage.setItem('token', response.data.token);
        
        
        const authFlow = useAuthFlow.getState();
        authFlow.setModal('otp');
        authFlow.setAuthFlowType('signup');
        
        toast.success(response.data.message || "Verification code sent to your email");
      }
      
      return {
        status: response.status,
        data: response.data
      };
    } catch (error: any) {
      this.handleError(error, 'Signup failed. Please try again.');
      throw error;
    }
  }

  async login(identifier: string, password: string): Promise<ApiResponse> {
    try {
      const isEmail = identifier.includes('@');

      const loginData = {
        email: isEmail ? identifier : '',
        password: password
      };

      const response = await api.post('/api/v1/auth/login', loginData);
      
      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        const authFlow = useAuthFlow.getState();
        authFlow.setModal("null");
        
        toast.success(response.data.message || "Login successful");
      }
      
      return {
        status: response.status,
        data: response.data
      };
    } catch (error: any) {
      this.handleError(error, 'Invalid credentials. Please try again.');
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      localStorage.setItem("email", email);

      const response = await api.post('/api/v1/auth/forgot-password', {
        email: email
      });
      
      if (response.status === 200) {
        const authFlow = useAuthFlow.getState();
        authFlow.setAuthFlowType('forgotpassword');
        authFlow.setModal('otp');
        
        toast.success(response.data.message || "Reset OTP sent to your email");
      }
      
      return {
        status: response.status,
        data: response.data
      };
    } catch (error: any) {
      this.handleError(error, 'Failed to send reset email. Please try again.');
      throw error;
    }
  }

  async resetPassword(password: string): Promise<ApiResponse> {
    try {
      const userEmail = localStorage.getItem('email');

      if (!userEmail) {
        throw new Error("Email not found in state");
      }

      const resetData = {
        email: userEmail,
        password: password
      };

      const response = await api.post('/api/v1/auth/reset-password', resetData);
      
      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        const authFlow = useAuthFlow.getState();
        authFlow.setModal("null");
        
        toast.success("Password reset successfully and Logged In");
      }
      
      return {
        status: response.status,
        data: response.data
      };
    } catch (error: any) {
      this.handleError(error, 'Failed to reset password. Please try again.');
      throw error;
    }
  }

  async verifyOtp(otp: string): Promise<ApiResponse> {
    try {
      const userEmail = localStorage.getItem('email');

      if (!userEmail) {
        throw new Error("Email not found in state");
      }

      const response = await api.post('/api/v1/auth/verifyotp', {
        email: userEmail,
        otp: otp
      });

      if (response.status === 200) {
        const authFlow = useAuthFlow.getState();
        const authFlowType = authFlow.authFlowType; 
  
        if (authFlowType === "forgotpassword") {
          authFlow.setModal("resetpassword"); 
        } else {
          authFlow.setModal("null"); 
        }
  
        toast.success(response.data.message || "OTP verified successfully");
      }
      
      return {
        status: response.status,
        data: response.data
      };
    } catch (error: any) {
      this.handleError(error, 'OTP verification failed. Please try again.');
      throw error;
    }
  }

  async resendOtp(): Promise<ApiResponse> {
    try {
      const userEmail = localStorage.getItem('email');

      if (!userEmail) {
        throw new Error("Email not found in state");
      }

      const response = await api.post('/api/v1/auth/sendotp', {
        email: userEmail
      });
      
      if (response.status === 200) {
        toast.success(response.data.message || "OTP resent successfully");
      }
      
      return {
        status: response.status,
        data: response.data
      };
    } catch (error: any) {
      this.handleError(error, 'Failed to resend OTP. Please try again.');
      throw error;
    }
  }

  getCurrentUser(): UserData | null {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }

  isVerified(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('currentModal');
    
    const authFlow = useAuthFlow.getState();
    authFlow.setModal("login");
    
    toast.info("Logged out successfully");
  }

  private handleError(error: any, defaultMessage: string): void {
    let errorMessage = defaultMessage;

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    toast.error(errorMessage);
  }
}

const authService = new AuthService();
export default authService;