import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';
import { ListItem, UnorderedList } from '@components/atoms/list';
import { Heading } from '@components/atoms/typography/heading';

export function ClubListTemplate({ clubs }) {
  return (
    <Flex justifyContent="center">
      <Box display="block">
        <Heading>Clubs</Heading>
        <Link href="/clubs/new">Register new club</Link>
        <UnorderedList>
          {clubs.map((club) => (
            <ListItem key={club.id}>
              <Link href={`/clubs/${club.id}`}>{club.name}</Link>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    </Flex>
  );
}
