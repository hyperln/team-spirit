import Head from 'next/head';
import { withRequireAuth } from '@hoc/with-auth';
import withTransition from '@hoc/with-transition';
import { fetchTeam } from '@lib/db';
import { Club, Team } from 'shared/types';
import { TeamPageTemplate } from '@components/templates/team-page-template';

interface Props {
  team: Team;
  club: Club;
}

function TeamDetails({ team, club }: Props) {
  return (
    <>
      <Head>
        <title>{team.name} | Team Spirit</title>
      </Head>
      <TeamPageTemplate team={team} club={club} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { clubId, teamId = [] } = context.query;
  const team = await fetchTeam(teamId);

  return {
    props: {
      teamId,
      team,
      clubId,
    },
  };
}

export default withTransition(withRequireAuth(TeamDetails));
