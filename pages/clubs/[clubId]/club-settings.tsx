import { ClubSettingsTemplate } from '@components/templates/club-settings-template';
import { withRequireAuth } from '@hoc/with-auth';
import { fetchClub } from '@lib/db';
import { getLogoImage } from '@lib/storage/storage';
import Head from 'next/head';
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
  console.log('clubId :>> ', clubId);
  const club = await fetchClub(clubId);
  console.log('club :>> ', club);
  const { signedURL } = await getLogoImage(club.logoImageId);
  return {
    props: {
      club: { ...club, logoUrl: signedURL },
    },
  };
}

export default withRequireAuth(ClubSettings);
