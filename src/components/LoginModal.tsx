import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignupForm from './SignupForm';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import { login } from "@/store/authSlice";
import { useDispatch } from 'react-redux';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API call
      const mockUser = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: values.identifier.includes('@') ? values.identifier : 'user@example.com',
        phone: !values.identifier.includes('@') ? values.identifier : '1234567890',
      };

      dispatch(login(mockUser));
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
      form.setError('root', {
        type: 'manual',
        message: 'Invalid credentials. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const closeForgotPasswordDialog = () => {
    setShowForgotPassword(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className=" p-6 pt-10  rounded-lg shadow-xl border border-gray-200 sm:max-w-md max-h-[90vh] overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1 h-12 ">
              <TabsTrigger value="login" className="py-2 px-4 rounded-md text-gray-700 hover:bg-red-500 hover:text-white transition">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="py-2 px-4 rounded-md text-gray-700 hover:bg-red-500 hover:text-white transition">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <DialogHeader className="text-center">
                <DialogTitle className="text-xl font-bold text-gray-800 mt-4">Login to your account</DialogTitle>
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
                    className="text-red-500 hover:text-red-500 transition"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </Button>

                  {form.formState.errors.root && (
                    <p className="text-sm font-medium text-red-500">{form.formState.errors.root.message}</p>
                  )}

                  <DialogFooter>
                    <Button type="submit" className="w-full bg-red-500 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md shadow-md transition" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <SignupForm onSuccess={onClose} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {showForgotPassword && (
        <ForgotPasswordDialog isOpen={showForgotPassword} onClose={closeForgotPasswordDialog} />
      )}
    </>
  );

};

export default LoginModal;