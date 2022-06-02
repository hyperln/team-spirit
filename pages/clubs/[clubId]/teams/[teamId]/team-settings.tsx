import { TeamSettingsTemplate } from '@components/templates/team-settings-template';
import { withRequireAuth } from '@hoc/with-auth';
import { fetchTeam } from '@lib/db';
import Head from 'next/head';
import { Team, Club } from 'shared/types';

interface Props {
  club: Club;
  team: Team;
}

function TeamSettings({ team, club }: Props) {
  return (
    <>
      <Head>
        <title>Team Settings | Team Spirit</title>
      </Head>
      <TeamSettingsTemplate team={team} club={club} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { teamId } = context.query;
  const team = await fetchTeam(teamId);
  return {
    props: {
      team: { ...team },
    },
  };
}
export default withRequireAuth(TeamSettings);
