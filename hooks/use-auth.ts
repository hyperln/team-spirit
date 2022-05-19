import { useToast } from '@hooks/use-toast';
import {
  currentUser,
  onAuthStateChange,
  signUp,
  signIn,
  signOut,
  resetPassword,
} from '@lib/auth';

export function useAuth() {
  const toast = useToast();

  const getCurrentUser = () => currentUser();

  const handleSignUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { user, session, error } = await signUp({ email, password });
    if (error) {
      return toast({
        status: 'error',
        description: error.message,
        title: error.status,
      });
    }
    return { user, session };
  };

  const handleSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { user, session, error } = await signIn({ email, password });
    if (error) {
      return toast({
        status: 'error',
        description: error.message,
        title: error.status,
      });
    }
    return { user, session };
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      return toast({
        status: 'error',
        description: error.message,
        title: error.status,
      });
    }
    return toast({
      status: 'success',
      description: 'You signed out!',
      title: 'Success',
      isClosable: true,
    });
  };

  const handleResetPassword = async ({ email }: { email: string }) => {
    const { data, error } = await resetPassword(email);

    if (error) {
      return toast({
        status: 'error',
        description: error.message,
        title: error.status,
      });
    }
    return toast({
      status: 'success',
      description: 'Password recovery email sent!',
      title: 'Success',
      isClosable: true,
    });
  };

  return {
    user: getCurrentUser(),
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    onAuthStateChange: onAuthStateChange,
    resetPassword: handleResetPassword,
  };
}
