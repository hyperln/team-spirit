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
          color="white"
          variant="ghost"
          leftIcon={<AddIcon />}
          as={Link}
          href="/clubs/club-registration"
        >
          Register new club
        </Button>
        <List
          color="white"
          bg="brand"
          fontWeight="medium"
          fontSize="lg"
          mt="2"
          spacing={3}
          w="80"
          borderRadius="5%"
          padding="5"
          boxShadow="dark-lg"
        >
          {clubs.map((club) => (
            <ListItem
              borderBottom="1px"
              borderBottomColor="orange.300"
              key={club.id}
            >
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
