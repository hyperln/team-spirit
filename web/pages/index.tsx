import { ReactElement } from 'react';
import Head from 'next/head';
import withTransition from '@hoc/with-transition';
import { AuthScreen } from '@components/templates/auth-screen';

function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>TeamSpirit | Team Management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthScreen />
    </>
  );
}

export default withTransition(Home);
