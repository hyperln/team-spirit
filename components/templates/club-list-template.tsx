import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';
import { ListItem, List } from '@components/atoms/list';
import { Heading } from '@components/atoms/typography/heading';
import { ArrowForwardIcon, AddIcon } from '@chakra-ui/icons';
import { Button } from '@components/atoms/button';

export function ClubListTemplate({ clubs }) {
  return (
    <Flex justifyContent="center" minH="calc(100vh - 80px)">
      <Box display="block">
        <Heading>Clubs</Heading>
        <Button
          leftIcon={<AddIcon />}
          as={Link}
          href="/clubs/club-registration"
        >
          Register new club
        </Button>
        <List fontSize="xl" mt="2" spacing={3}>
          {clubs.map((club) => (
            <ListItem key={club.id}>
              <Link href={`/clubs/${club.id}`}>
                {club.name}
                {<ArrowForwardIcon />}
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Flex>
  );
}
