import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';
import { ListItem, UnorderedList } from '@components/atoms/list';
import { Heading } from '@components/atoms/typography/heading';

export function TeamsListTemplate({ clubs, teams }) {
  const club = clubs;
  return (
    <Flex justifyContent="center">
      <Box display="block">
        <Heading>Teams</Heading>
        <Link href={`/clubs/${club.id}/teams/team-registration`}>
          Register new team
        </Link>
        <UnorderedList>
          {teams.map((club, team) => (
            <ListItem key={team.id}>
              <Link href={`/clubs/${club.id}/${team.id}`}>{team.name}</Link>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    </Flex>
  );
}
