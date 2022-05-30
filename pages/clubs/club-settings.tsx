import { ClubSettingsTemplate } from '@components/templates/club-settings-template';
import { withRequireAuth } from '@hoc/with-auth';
import { fetchClub, UpdateClub } from '@lib/db';
import { getLogoImage } from '@lib/storage/storage';
import Head from 'next/head';
import { getServerSideProps } from 'pages/clubs';
import { Club } from 'shared/types';

interface Props {
  club: Club;
}

function ClubSettings({ club }: Props) {
  return (
    <>
      <Head>
        <title>Club Settings | Team Spirit</title>
      </Head>
      <ClubSettingsTemplate club={club} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { clubId } = context.query;
  const club = await fetchClub(clubId);
  const { signedURL } = await getLogoImage(club.logoImageId);
  return {
    props: {
      club: { ...club, logoUrl: signedURL },
    },
  };
}

export default withRequireAuth(ClubSettings);
