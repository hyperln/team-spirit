import { withRequireAuth } from '@hoc/with-auth';
import withTransition from '@hoc/with-transition';
import Head from 'next/head';

function ClubRegistration() {
  return (
    <>
      <Head>
        <title>Register Club | Team Spirit</title>
      </Head>
    </>
  );
}

export default withTransition(withRequireAuth(ClubRegistration));
