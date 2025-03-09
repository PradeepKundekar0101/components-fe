import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordFormValues } from '@/schemas/auth-schema';
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
import { useSignupFlowStore } from '@/store/signupFlowStore';
import api from '@/config/axios';
import { toast } from 'react-toastify';

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const { userEmail, otpValue, moveToLoginStep } = useSignupFlowStore();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (values.password !== values.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    const userEmail = localStorage.getItem('email');

    setIsLoading(true);
    try {

      if (!userEmail) {
        throw new Error("Email not found in state");
      }

      if (!otpValue) {
        throw new Error("OTP not found in state");
      }

      const resetData = {
        email: userEmail,
        otp: otpValue,
        password: values.password
      };

      const response = await api.post('/api/v1/auth/reset-password', resetData);

      if (response.status === 200) {
        const { token, user } = response.data;

        // Store in localStorage
        localStorage.setItem('resetPasswordDone', 'true');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success("Password reset successfully and Logged In");

        // moveToLoginStep();

        if (onClose) {
          onClose();
        }

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Password reset failed:', error);
      let errorMessage = 'Failed to reset password. Please try again.';

      if (error.response?.data?.message) {
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


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 pt-8 rounded-lg shadow-xl border border-gray-200 sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Reset Your Password
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Create a new password for your account. Make sure it's strong and secure.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
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

            <DialogFooter className="pt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-600 text-white hover:bg-red-500"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;