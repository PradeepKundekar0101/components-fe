import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { signupSchema, SignupFormValues } from '@/schemas/auth-schema';
import { Button } from '@/components/ui/button';
import {
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
import { useSignupFlowStore } from '@/store/signupFlowStore';
import api from '@/config/axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { signup } from '@/store/authSlice';

interface SignupFormProps {
  onSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { currentStep, startSignupFlow, moveToOtpStep } = useSignupFlowStore();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const showOtpDialog = currentStep === 'otp';

  const onSubmit = async (values: SignupFormValues) => {
    if (values.password !== values.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      })
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password
      };

      console.log("Signup data:", userData);
      const response = await api.post('/api/v1/auth/signup', userData);

      if (response.status === 201 || response.status === 200) {
        const tempUserData = {
          id: '',
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password // Store temporarily for auto-login after OTP
        };

        dispatch(signup(tempUserData));

        // Start the signup flow with the user's email
        startSignupFlow(values.email);

        // Move to OTP step in store
        moveToOtpStep(values.email);

        toast.success(response.data.message || "Verification code sent to your email");
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      let errorMessage = 'Signup failed. Please try again.';

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleOtpVerificationSuccess = () => {
    onSuccess();
  };
  return (
    <>
      <DialogHeader className="text-center">
        <DialogTitle className="text-xl font-bold text-gray-800 mt-4">Create an account</DialogTitle>
        <DialogDescription className="text-gray-500">
          Fill in your details to create a new account.
        </DialogDescription>
      </DialogHeader>



      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4 ">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      className="border-gray-300 focus:ring-red-600 focus:border-red-600 rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      className="border-gray-300 focus:ring-red-600 focus:border-red-600 rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    className="border-gray-300 focus:ring-red-600 focus:border-red-600 rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="1234567890"
                    className="border-gray-300 focus:ring-red-600 focus:border-red-600 rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
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
                        className="border-gray-300 focus:ring-red-600 focus:border-red-600 rounded-md pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="border-gray-300 focus:ring-red-600 focus:border-red-600 rounded-md pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.formState.errors.root && (
            <p className="text-sm font-medium text-red-500">
              {form.formState.errors.root.message}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md shadow-md transition" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </DialogFooter>
        </form>
      </Form>

      {showOtpDialog && (
        <OtpVerificationDialog
          isOpen={showOtpDialog}
          onClose={() => {/* handled by store */ }}
          onSuccess={handleOtpVerificationSuccess}
        />
      )}
    </>
  );
};

export default SignupForm;