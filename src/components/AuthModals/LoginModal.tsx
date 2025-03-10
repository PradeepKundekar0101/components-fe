import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, LoginFormValues } from '@/schemas/auth-schema';
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
import ForgotPasswordDialog from './ForgotPasswordDialog';
import { login } from "@/store/authSlice";
import { useDispatch } from 'react-redux';
import authService from '@/services/authService';
import useAuthFlow from '@/store/authFlow';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userEmail = localStorage.getItem('email');
  const { setModal } = useAuthFlow();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: userEmail || '',
      password: '',
    },
  });

  useEffect(() => {
    if (userEmail) {
      form.setValue('identifier', userEmail);
    }
  }, [userEmail, form]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(values.identifier, values.password);

      if (response.status === 200) {
        const isEmail = values.identifier.includes('@');
        const authenticatedUser = {
          id: response.data.userId || '',
          firstName: '',
          lastName: '',
          email: isEmail ? values.identifier : '',
          phone: !isEmail ? values.identifier : '',
          token: response.data.token
        };

        dispatch(login(authenticatedUser));
        setModal('null');
      }
    } catch (error: any) {
      form.setError('root', {
        type: 'manual',
        message: error.response?.data?.message || 'Invalid credentials. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    setModal('forgotpassword');
    setShowForgotPassword(true);
  };

  const closeForgotPasswordDialog = () => {
    setShowForgotPassword(false);
  };

  const handleOpenSignup = () => {
    onClose();
    setModal('signup');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="p-6 pt-10 rounded-lg shadow-xl border border-gray-200 sm:max-w-md max-h-[90vh] overflow-y-auto !focus:outline-none">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-gray-800 mt-4">Login to your account</DialogTitle>
            <DialogDescription className="text-gray-500">
              Enter your email/phone and password to access your account.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email or Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        className="border-gray-300 focus:ring-red-500 focus:border-red-500 rounded-md"
                        placeholder="Enter your email or phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="border-gray-300 focus:ring-red-500 focus:border-red-500 rounded-md pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-red-500 hover:text-red-600 transition"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </Button>

              {form.formState.errors.root && (
                <p className="text-sm font-medium text-red-500">{form.formState.errors.root.message}</p>
              )}

              <DialogFooter className="flex !flex-col space-y-4">
                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Button
                    type="button"
                    variant="link"
                    className="text-red-500 hover:text-red-600 p-0"
                    onClick={handleOpenSignup}
                  >
                    Sign Up
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {showForgotPassword && (
        <ForgotPasswordDialog isOpen={showForgotPassword} onClose={closeForgotPasswordDialog} />
      )}
    </>
  );
};

export default LoginModal;