import { RegisterClubTemplate } from '@components/templates/register-club-template';
import { withRequireAuth } from '@hoc/with-auth';
import Head from 'next/head';

function ClubRegistration() {
  return (
    <>
      <Head>
        <title>Register Club | Team Spirit</title>
      </Head>
      <RegisterClubTemplate />
    </>
  );
}

export default withRequireAuth(ClubRegistration);
