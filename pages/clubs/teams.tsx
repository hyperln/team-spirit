import { TeamsListTemplate } from '@components/templates/teams-list-template';
import { withRequireAuth } from '@hoc/with-auth';
import withTransition from '@hoc/with-transition';
import { listTeams } from '@lib/db';
import Head from 'next/head';

function TeamListPage({ clubs, teams }) {
  return (
    <>
      <Head>
        <title>Teams | Team Spirit</title>
      </Head>
      <TeamsListTemplate teams={teams} clubs={clubs} />
    </>
  );
}

export async function getServerSideProps(context) {
  const teams = await listTeams();
  return {
    props: {
      teams,
    },
  };
}

export default withTransition(withRequireAuth(TeamListPage));
