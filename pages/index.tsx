import { ReactElement } from 'react';
import Head from 'next/head';
import { Text } from '@components/atoms/typography/text';
import withTransition from '@hoc/with-transition';
import { AuthScreen } from '@components/templates/auth-screen';
import { withRequireAuth } from '@hoc/with-auth';

function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>TeamSpirit | Team Management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Text align="center" fontSize="36px">
        Welcome to TeamSpirit!
      </Text>
      <AuthScreen />
    </>
  );
}

export default withTransition(withRequireAuth(Home));
