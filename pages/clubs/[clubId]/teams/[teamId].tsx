import Head from 'next/head';
import { withRequireAuth } from '@hoc/with-auth';
import withTransition from '@hoc/with-transition';
import { fetchTeam, fetchClub } from '@lib/db';
import { Club, Team } from 'shared/types';
import { TeamPageTemplate } from '@components/templates/team-page-template';
import { getLogoImage } from '@lib/storage/storage';

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
  const [team, club] = await Promise.all([
    fetchTeam(teamId), 
    fetchClub(clubId)
  ]);

  const { signedURL } = await getLogoImage(club.logoImageId);

  return {
    props: {
      club: { logoUrl: signedURL },
      teamId,
      team,
      clubId,
    },
  };
}

export default withTransition(withRequireAuth(TeamDetails));
