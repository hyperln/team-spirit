import { ReactElement } from 'react';
import Head from 'next/head';
import withTransition from '@hoc/with-transition';

function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>TeamSpirit | Team Management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>Hej</>
    </>
  );
}

export default withTransition(Home);
