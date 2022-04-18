import { ReactElement } from 'react';
import Head from 'next/head';
import withTransition from '@hoc/with-transition';
import { withRequireAuth } from '@hoc/with-auth';
import { Link } from '@components/atoms/link';
import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { LinkList } from '@components/organisms/linkList';
import teams from './clubs/teams';
import clubs from './clubs';

function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>TeamSpirit | Team Management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <LinkList clubs={clubs} teams={teams} />
      </main>
    </>
  );
}

export default withTransition(withRequireAuth(Home));
