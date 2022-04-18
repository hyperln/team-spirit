import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';

export function LinkList({ clubs, teams }) {
  const { club } = clubs;
  const { team } = teams;

  return (
    <Box w="full">
      <Flex flexDirection="column" alignItems="center" w="full" mx="auto">
        <Link href="/authed">Authed page</Link>
        <Link href="/account">Account</Link>
        <Link href="/clubs">View clubs</Link>
        <Link href="/clubs/club-registration">Register club</Link>
        <Link href="/clubs/teams">View teams</Link>
        <Link href={`/clubs/${club.id}/teams/team-registration`}>
          Register team
        </Link>
      </Flex>
    </Box>
  );
}
