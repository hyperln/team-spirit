import { useEffect } from 'react';
import { Page } from '@lib/cms/cms-types';
import { Sections } from '@components/templates/sections';
import { useAuth } from '@hooks/use-auth';
import { useRouter } from 'next/router';
import { AuthScreen } from '../auth-screen';

type Props = Page & {
  content: Page;
};

export default function SignInPageTemplate({ content, ...props }: Props) {
  const router = useRouter();
  const { onAuthStateChange } = useAuth();

  useEffect(() => {
    const { data: listener } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const redirectUrl = router.query.redirect
          ? decodeURIComponent(router.query.redirect as string)
          : 'account';
        router.push(`/${redirectUrl}`);
      }
    });
    return () => {
      listener?.unsubscribe();
    };
  }, []);

  return (
    <main>
      <Sections {...props} {...content} sections={content.sections} />
      <AuthScreen />
    </main>
  );
}
