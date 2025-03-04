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
  const [userEmail, setUserEmail] = useState<string>('');

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store email for OTP verification
      setUserEmail(values.email);

      // Show OTP verification dialog
      setShowOtpDialog(true);
    } catch (error) {
      console.error('Password reset request failed:', error);
      form.setError('root', {
        type: 'manual',
        message: 'Failed to send reset email. Please try again.'
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a verification code to reset your password.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
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

              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
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
          email={userEmail}
          onSuccess={handleOtpVerificationSuccess}
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