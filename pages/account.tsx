import { AccountPageTemplate } from '@components/templates/account-page-template';
import { withRequireAuth } from '@hoc/with-auth';
import Head from 'next/head';

function Account() {
  return (
    <>
      <Head>
        <title>Account | Team Spirit</title>
      </Head>
      <AccountPageTemplate />
    </>
  );
}

export default withRequireAuth(Account);
