import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, OtpFormValues } from '@/schemas/auth-schema';
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
import authService from '@/services/authService';
import useAuthFlow from '@/store/authFlow';
import api from '@/config/axios';

interface OtpVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  purpose?: 'verification' | 'passwordReset';
}

const OtpVerificationDialog: React.FC<OtpVerificationDialogProps> = ({
  isOpen,
  onClose,
  purpose = 'verification'
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(120); // 2 minutes
  const RESEND_OTP_TIMER = 120;
  const userEmail = localStorage.getItem('email');
  const authFlow = useAuthFlow();

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
      await authService.verifyOtp(values.otp);
    } catch (error: any) {
      form.setError('root', {
        type: 'manual',
        message: error.response?.data?.message || 'Invalid OTP. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      await authService.resendOtp();

      setRemainingTime(RESEND_OTP_TIMER);
      const now = new Date().getTime();
      const endTime = now + (RESEND_OTP_TIMER * 1000);
      localStorage.setItem('otpTimerEndTime', endTime.toString());

      form.setError('root', {
        type: 'manual',
        message: 'OTP resent successfully!',
      });

      setTimeout(() => {
        form.clearErrors('root');
      }, 3000);
    } catch (error: any) {
      form.setError('root', {
        type: 'manual',
        message: error.response?.data?.message || 'Failed to resend OTP. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      if (purpose === 'verification') {
        const userId = JSON.parse(localStorage.getItem('user') || 'null')?.id;
        if (userId) {
          await api.delete(`/api/v1/user/${userId}`);
        }
      }

      authFlow.setModal("null");
      onClose();
    } catch (error: any) {
      form.setError('root', {
        type: 'manual',
        message: error.response?.data?.message || 'Failed to cancel registration. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="p-6 pt-8 rounded-lg border border-gray-200 sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {purpose === 'passwordReset' ? 'Verify OTP' : 'Verify Your Email'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            We've sent a verification code to <span className="font-medium text-red-600">{userEmail}</span>.
            Please enter the code below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
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

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Time remaining: <span className="font-medium">{formatTime(remainingTime)}</span>
              </span>

              <Button
                type="button"
                variant="link"
                size="sm"
                className={`px-0 font-medium text-red-600 transition ${remainingTime > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
                onClick={handleResendOtp}
                disabled={remainingTime > 0 || isLoading}
              >
                Resend OTP
              </Button>
            </div>

            {form.formState.errors.root && (
              <p className={`text-sm font-medium ${form.formState.errors.root.message === 'OTP resent successfully!' ? 'text-green-500' : 'text-red-500'}`}>
                {form.formState.errors.root.message}
              </p>
            )}

            <DialogFooter className="pt-4 flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {isLoading && purpose === 'verification' ? "Cancelling..." : "Cancel"}
              </Button>
              <Button
                type="submit"
                className="w-1/2 bg-red-600 text-white hover:bg-red-500"
                disabled={isLoading}
              >
                {isLoading && form.formState.isSubmitting ? "Verifying..." : "Verify"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationDialog;