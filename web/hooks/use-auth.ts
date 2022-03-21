import { useToast } from '@hooks/use-toast';
import { auth } from '@lib/munin/auth';
import { useCheckEmailLazyQuery } from '@lib/api/graphql/schema/queries.graphql';
import { useEffect, useState } from 'react';

export function useAuth() {
  const toast = useToast();
  const getCurrentUser = () => auth().currentUser;

  const [userExists, setUserExists] = useState(null);

  const [
    checkEmailQuery,
    {
      loading: isCheckEmailLoading,
      data: checkEmailData,
      refetch: refetchCheckEmail,
      variables: checkEmailVariables,
    },
  ] = useCheckEmailLazyQuery({ fetchPolicy: 'network-only' });

  useEffect(() => {
    setUserExists(checkEmailData?.checkEmail);
  }, [checkEmailData]);

  const checkEmail = async (email: string) => {
    if (checkEmailVariables?.email === email) {
      setUserExists(null);
      const { data } = await refetchCheckEmail({
        email,
      });
      setUserExists(data?.checkEmail);
    } else {
      checkEmailQuery({
        variables: {
          email,
        },
      });
    }
  };

  const signUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { user, session, error } = await auth().signUp({ email, password });
    if (error) {
      return toast({
        status: 'error',
        description: error.message,
        title: error.name,
      });
    }
    return { user, session };
  };

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { user, session, error } = await auth().signIn({ email, password });
    if (error) {
      return toast({
        status: 'error',
        description: error.message,
        title: error.name,
      });
    }
    return { user, session };
  };

  const signOut = async () => {
    const { error } = await auth().signOut();
    if (error) {
      return toast({
        status: 'error',
        description: error.message,
        title: error.name,
      });
    }
  };

  return {
    user: getCurrentUser(),
    checkEmail,
    userExists,
    isLoading: isCheckEmailLoading,
    signUp,
    signIn,
    signOut,
    onAuthStateChange: auth().onAuthStateChange,
  };
}
