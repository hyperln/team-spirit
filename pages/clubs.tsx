import { ClubListTemplate } from '@components/templates/club-list-template';
import { withRequireAuth } from '@hoc/with-auth';
import { listClubs } from '@lib/db';
import Head from 'next/head';

function ClubListPage({ clubs }) {
  return (
    <>
      <Head>
        <title>Clubs | Team Spirit</title>
      </Head>
      <ClubListTemplate clubs={clubs} />
    </>
  );
}

export async function getServerSideProps(context) {
  const clubs = await listClubs();
  return {
    props: {
      clubs,
    },
  };
}

export default withRequireAuth(ClubListPage);
