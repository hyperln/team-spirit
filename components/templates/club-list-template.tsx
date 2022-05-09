import { Box } from '@components/atoms/box';
import { Link } from '@components/atoms/link';
import { ListItem, List } from '@components/atoms/list';
import { Heading } from '@components/atoms/typography/heading';
import { AtSignIcon } from '@chakra-ui/icons';
import { HStack } from '@components/atoms/stack';
import { Center } from '@components/atoms/center';
import { Text } from '@components/atoms/typography/text';

export function ClubListTemplate({ clubs }) {
  return (
    <List>
      <Center>
        <Heading p="2">Clubs</Heading>
      </Center>
      {clubs.map((club) => (
        <HStack>
          <Box w="16" h="16">
            <Center>
              <AtSignIcon boxSize="10" />
            </Center>
          </Box>
          <Box w="80" h="16">
            <ListItem borderBottom="1px" h="16" key={club.id}>
              <Link href={`/clubs/${club.id}`}>
                <Text fontWeight="semibold">{club.name}</Text>

                <Text>{club.established}</Text>
              </Link>
            </ListItem>
          </Box>
        </HStack>
      ))}
    </List>
  );
}
