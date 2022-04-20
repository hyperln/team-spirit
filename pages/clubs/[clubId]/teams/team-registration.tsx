import { RegisterTeamTemplate } from '@components/templates/register-team-template';
import { fetchClub } from '@lib/db';
import Head from 'next/head';
import { Club } from 'shared/types';

interface Props {
  club: Club;
}

export default function TeamRegistration({ club }: Props) {
  const { test } = club;
  return (
    <>
      <Head>
        <title>Register Team | Team Spirit</title>
      </Head>
      <RegisterTeamTemplate club={club} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { clubId } = context.query;
  const club = await fetchClub(clubId);
  return {
    props: {
      club,
    },
  };
}
