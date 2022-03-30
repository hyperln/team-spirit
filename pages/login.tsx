import { AuthScreen } from '@components/templates/auth-screen';
import { withRequireAuth } from '@hoc/with-auth';
import withTransition from '@hoc/with-transition';
import { useAuth } from '@hooks/use-auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
function Login() {
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      const redirectUrl = router.query.redirect
        ? decodeURIComponent(router.query.redirect as string)
        : 'account';
      router.push(`/${redirectUrl}`);
    }
  }, [user, router]);
  return <AuthScreen />;
}
export default withTransition(withRequireAuth(Login));
