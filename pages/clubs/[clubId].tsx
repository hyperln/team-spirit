import Head from 'next/head';
import { ClubPageTemplate } from '@components/templates/club-page-template';
import { withRequireAuth } from '@hoc/with-auth';
import { fetchClub } from '@lib/db';
import { Club } from 'shared/types';

interface Props {
  club: Club;
}

function ClubDetails({ club }: Props) {
  return (
    <>
      <Head>
        <title>{club.name} | Team Spirit</title>
      </Head>
      <ClubPageTemplate club={club} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { clubId, teamId = [] } = context.query;
  const club = await fetchClub(clubId);

  return {
    props: {
      clubId,
      club,
      teamId,
    },
  };
}

export default withRequireAuth(ClubDetails);
