import Head from 'next/head';
import { ClubPageTemplate } from '@components/templates/club-page-template';
import { withRequireAuth } from '@hoc/with-auth';
import { fetchClub, listTeams } from '@lib/db';
import { Club, Team } from 'shared/types';
import { TeamsListTemplate } from '@components/templates/teams-list-template';

interface Props {
  club: Club;
  teams: Team[];
}

function ClubDetails({ club, teams }: Props) {
  return (
    <>
      <Head>
        <title>{club.name} | Team Spirit</title>
      </Head>
      <ClubPageTemplate club={club} />
      <TeamsListTemplate teams={teams} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { clubId } = context.query;
  const [club, teams] = await Promise.all([
    fetchClub(clubId),
    listTeams(clubId),
  ]);

  return {
    props: {
      club,
      teams,
    },
  };
}

export default withRequireAuth(ClubDetails);
