/* eslint-disable react/display-name */
/* eslint-disable react/destructuring-assignment */
import { useAuth } from '@hooks/use-auth';
import { config } from 'config';
import { useRouter } from 'next/router';
import { ComponentType, FC, useEffect } from 'react';

type Props = any;
export const withRequireAuth =
  <P extends object>(Component: ComponentType<P>): FC<P & Props> =>
  (props: Props) => {
    const { user, onAuthStateChange } = useAuth();
    const router = useRouter();

    useEffect(() => {
      const { data: listener } = onAuthStateChange((event, session) => {
        if (!session?.user) {
          router.push(
            `/${config.site.auth.signInPath}?redirect=${encodeURIComponent(
              router.asPath,
            )}`,
          );
        }
      });
      return () => {
        listener?.unsubscribe();
      };
    }, [onAuthStateChange, router]);

    useEffect(() => {
      if (!user) {
        router.push(
          `/${config.site.auth.signInPath}?redirect=${encodeURIComponent(
            router.asPath,
          )}`,
        );
      }
    }, [user]);

    return user?.id ? <Component {...props} /> : null;
  };

export const withCheckRequireAuth =
  <P extends object>(Component: ComponentType<P>): FC<P & Props> =>
  (props: Props) =>
    props.page.settings.isAuthRequired ? (
      withRequireAuth(Component)(props)
    ) : (
      <Component {...props} />
    );
