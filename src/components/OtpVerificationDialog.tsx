// In your OtpVerificationDialog.tsx file

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, OtpFormValues } from '@/schemas/auth-schema';
import { login } from "@/store/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSignupFlowStore } from '@/store/signupFlowStore';
import api from '@/config/axios';
import { toast } from 'react-toastify';

interface OtpVerificationDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess: () => void;
}

const OtpVerificationDialog: React.FC<OtpVerificationDialogProps> = ({
  onSuccess,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(1); // 2 minutes
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const RESEND_OTP_TIMER = 120;

  // Use the signup flow store
  const { userEmail, cancelFlow, resetFlow, currentStep } = useSignupFlowStore();

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    const savedEndTime = localStorage.getItem('otpTimerEndTime');
    const now = new Date().getTime();

    if (savedEndTime) {
      const endTime = parseInt(savedEndTime);
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

      if (remaining <= 0) {
        setRemainingTime(0);
        localStorage.removeItem('otpTimerEndTime');
      } else {
        setRemainingTime(remaining);
      }
    } else {
      setRemainingTime(RESEND_OTP_TIMER);
      const endTime = now + (RESEND_OTP_TIMER * 1000);
      localStorage.setItem('otpTimerEndTime', endTime.toString());
    }

    let timer: NodeJS.Timeout;

    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            localStorage.removeItem('otpTimerEndTime');
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const onSubmit = async (values: OtpFormValues) => {
    setIsLoading(true);
    try {
      // Make API call to verify OTP
      console.log("Verifying OTP:", userEmail, values.otp);
      const response = await api.post('/api/v1/auth/verifyotp', {
        email: userEmail,
        otp: values.otp
      });

      // If verification is successful
      if (response.status === 200) {
        toast.success(response.data.message || "Email verified successfully!");

        localStorage.setItem("user", JSON.stringify(user));

        const currentUser = user;

        if (!currentUser || !currentUser.email || !currentUser.password) {
          throw new Error("User data is missing for auto-login");
        }

        // Auto-login after successful verification
        try {

          console.log(currentUser.email, currentUser.password);
          const loginResponse = await api.post('/api/v1/auth/login', {
            email: currentUser.email,
            password: currentUser.password
          });
          console.log(loginResponse)

          if (loginResponse.status === 200) {
            // Extract JWT token from response
            const token = loginResponse.data.token;

            // Create complete user data without password
            const authenticatedUser = {
              id: loginResponse.data.userId || currentUser.id || '',
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              email: currentUser.email,
              phone: currentUser.phone,
              token: token
            };

            // Remove password from Redux store by dispatching login with clean user data
            dispatch(login(authenticatedUser));

            resetFlow();
            onSuccess();
          } else {
            throw new Error("Auto-login failed after verification");
          }
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          resetFlow();
          onSuccess();
        }
      } else {
        throw new Error(response.data.message || 'OTP verification failed');
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      let errorMessage = 'Invalid OTP. Please try again.';

      // Check if the error has a specific message from the API
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
      form.setError('root', {
        type: 'manual',
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/v1/auth/sendotp', {
        email: userEmail
      });

      setRemainingTime(RESEND_OTP_TIMER);
      const now = new Date().getTime();
      const endTime = now + (RESEND_OTP_TIMER * 1000);
      localStorage.setItem('otpTimerEndTime', endTime.toString());

      toast.success(response.data.message || "OTP resent successfully!");
      form.setError('root', {
        type: 'manual',
        message: 'OTP resent successfully!',
      });

      setTimeout(() => {
        form.clearErrors('root');
      }, 3000);
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      let errorMessage = 'Failed to resend OTP. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      form.setError('root', {
        type: 'manual',
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    cancelFlow();
    onClose?.();
  };

  if (currentStep !== 'otp') return null;

  return (
    <Dialog open={true} onOpenChange={handleCancel}>
      <DialogContent className="p-6 pt-8 rounded-lg border border-gray-200 sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Verify Your Email
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            We've sent a verification code to <span className="font-medium text-red-600">{userEmail}</span>.
            Please enter the code below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
            {/* OTP Input Field */}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="text-center text-lg font-bold tracking-wider border-gray-300 focus:ring-red-500 focus:border-red-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Timer and Resend OTP */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Time remaining: <span className="font-medium">{formatTime(remainingTime)}</span>
              </span>

              <Button
                type="button"
                variant="link"
                size="sm"
                className={`px-0 font-medium text-red-600 transition ${remainingTime > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'
                  }`}
                onClick={handleResendOtp}
                disabled={remainingTime > 0 || isLoading}
              >
                Resend OTP
              </Button>
            </div>

            {/* Error/Success Message */}
            {form.formState.errors.root && (
              <p className={`text-sm font-medium ${form.formState.errors.root.message === 'OTP resent successfully!' ? 'text-green-500' : 'text-red-500'}`}>
                {form.formState.errors.root.message}
              </p>
            )}

            {/* Footer Buttons */}
            <DialogFooter className="pt-4 flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-1/2 bg-red-600 text-white hover:bg-red-500"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationDialog;