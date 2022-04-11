import { ReactElement } from 'react';
import Head from 'next/head';
import withTransition from '@hoc/with-transition';
import { withRequireAuth } from '@hoc/with-auth';
import { Link } from '@components/atoms/link';
import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';

function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>TeamSpirit | Team Management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box w="full">
          <Flex flexDirection="column" alignItems="center" w="full" mx="auto">
            <Link href="authed">Authed page</Link>
            <Link href="account">Account</Link>
            <Link href="club-registration">Register Club</Link>
          </Flex>
        </Box>
      </main>
    </>
  );
}

export default withTransition(withRequireAuth(Home));
