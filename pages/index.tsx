import { ReactElement } from 'react';
import Head from 'next/head';
import withTransition from '@hoc/with-transition';
import { withRequireAuth } from '@hoc/with-auth';
import { Link } from '@components/atoms/link';
import { Box } from '@components/atoms/box';

function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>TeamSpirit | Team Management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box mx="auto">
        <Link href="authed">Authed page</Link>
      </Box>
    </>
  );
}

export default withTransition(withRequireAuth(Home));
