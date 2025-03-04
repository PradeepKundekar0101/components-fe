import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, OtpFormValues } from '@/schemas/auth-schema';
import { login } from "@/store/authSlice";
import { useDispatch } from 'react-redux';
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

interface OtpVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

const OtpVerificationDialog: React.FC<OtpVerificationDialogProps> = ({
  isOpen,
  onClose,
  email,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(120); // 2 minutes
  const dispatch = useDispatch();

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, remainingTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const onSubmit = async (values: OtpFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API verification
      // Mock successful OTP verification

      console.log(values.otp)

      const mockUser = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: email,
        phone: '1234567890',
      };

      dispatch(login(mockUser));
      onSuccess();
    } catch (error) {
      console.error('OTP verification failed:', error);
      form.setError('root', {
        type: 'manual',
        message: 'Invalid OTP. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      // Simulate API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset timer
      setRemainingTime(120);

      // Success message
      form.setError('root', {
        type: 'manual',
        message: 'OTP resent successfully!',
      });

      setTimeout(() => {
        form.clearErrors('root');
      }, 3000);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 pt-8 rounded-lg border border-gray-200 sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Verify Your Email
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            We've sent a verification code to <span className="font-medium text-red-600">{email}</span>.
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
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="w-full bg-red-600 text-white hover:bg-red-500"
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