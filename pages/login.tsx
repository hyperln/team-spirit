import { AuthScreen } from '@components/templates/auth-screen';
import { useAuth } from '@hooks/use-auth';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

export default function Login() {
  const router = useRouter();
  const { user, onAuthStateChange } = useAuth();

  const redirect = useCallback(() => {
    const redirectUrl = router.query.redirect
      ? decodeURIComponent(router.query.redirect as string)
      : 'account';
    router.push(`${redirectUrl}`);
  }, [router]);

  useEffect(() => {
    if (user) {
      redirect();
    }
  }, [user, redirect]);

  useEffect(() => {
    const { data: listener } = onAuthStateChange(async (event, session) => {
      if (session.user) {
        redirect();
      }
    });
    return () => {
      listener?.unsubscribe();
    };
  }, [onAuthStateChange, redirect]);

  return <AuthScreen />;
}
