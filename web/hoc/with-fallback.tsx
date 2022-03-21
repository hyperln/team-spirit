/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
import { ComponentType, FC } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';

import NotFound from '../pages/404';
import { Page } from '../lib/cms/cms-types';

type Props = {
  error: boolean;
  statusCode: 200 | 404 | 500;
  errorMessage?: string;
  errorPage?: Page;
};

export const withFallback = <P extends object>(
  Component: ComponentType<any>,
  FallbackComponent: ComponentType<P>,
): FC<P & Props> => (props: Props) => {
  const router = useRouter();
  return router.isFallback ? (
    <FallbackComponent {...(props as P)} />
  ) : !props.error ? (
    <Component {...(props as P)} />
  ) : props.statusCode === 404 ? (
    <NotFound page={props.errorPage} />
  ) : (
    <Error statusCode={props.statusCode} />
  );
};
