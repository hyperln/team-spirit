import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';
import { ListItem, UnorderedList } from '@components/atoms/list';
import { Heading } from '@components/atoms/typography/heading';

export function ClubListTemplate({ clubs }) {
  return (
    <Flex
      justifyContent="center"
      bgGradient="linear(brand.900 10%, brand.600 60%)"
      minH="calc(100vh - 80px)"
    >
      <Box display="block">
        <Heading>Clubs</Heading>
        <Link href="/clubs/club-registration">Register new club</Link>
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
