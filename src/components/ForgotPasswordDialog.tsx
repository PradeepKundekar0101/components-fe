import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/schemas/auth-schema';
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import OtpVerificationDialog from './OtpVerificationDialog';
import ResetPasswordDialog from './ResetPasswordDialog';
import api from '@/config/axios';
import { toast } from 'react-toastify';
import { useSignupFlowStore } from '@/store/signupFlowStore';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOtpDialog, setShowOtpDialog] = useState<boolean>(false);
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false);
  const { startSignupFlow, currentStep } = useSignupFlowStore();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/v1/auth/forgot-password', {
        email: values.email
      });

      if (response.status === 200) {
        startSignupFlow(values.email);
        setShowOtpDialog(true);
        toast.success(response.data.message || "Reset OTP sent to your email");
      }
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      let errorMessage = 'Failed to send reset email. Please try again.';

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

  const handleOtpVerificationSuccess = () => {
    setShowOtpDialog(false);
    setShowResetDialog(true);
  };

  const handleResetPasswordSuccess = () => {
    setShowResetDialog(false);
    onClose();
  };

  // Don't show this dialog if we're in a later step of the flow
  if (currentStep === 'otp' || currentStep === 'resetPassword') {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="p-6 pt-8 rounded-lg shadow-xl border border-gray-200 sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Reset Your Password
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter your email address and we'll send you a verification code to reset your password.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <p className="text-sm font-medium text-red-500">
                  {form.formState.errors.root.message}
                </p>
              )}

              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-red-600 text-white hover:bg-red-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {showOtpDialog && (
        <OtpVerificationDialog
          isOpen={showOtpDialog}
          onClose={() => setShowOtpDialog(false)}
          onSuccess={handleOtpVerificationSuccess}
          purpose="passwordReset"
        />
      )}

      {showResetDialog && (
        <ResetPasswordDialog
          isOpen={showResetDialog}
          onClose={() => setShowResetDialog(false)}
          onSuccess={handleResetPasswordSuccess}
        />
      )}
    </>
  );
};

export default ForgotPasswordDialog;