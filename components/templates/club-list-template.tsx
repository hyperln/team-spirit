import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Link, LinkBox, LinkOverlay } from '@components/atoms/link';
import { ListItem, List } from '@components/atoms/list';
import { Heading } from '@components/atoms/typography/heading';
import { ArrowForwardIcon, AddIcon, AtSignIcon } from '@chakra-ui/icons';
import { Button } from '@components/atoms/button';

export function ClubListTemplate({ clubs }) {
  return (
    <Flex justifyContent="center" minH="calc(100vh - 80px)">
      <Box w="80" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Button
          color="white"
          variant="ghost"
          leftIcon={<AddIcon />}
          as={Link}
          href="/clubs/club-registration"
        >
          Register new club
        </Button>

        <Box display="flex" alignItems="center">
          <Box
            textAlign="start"
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="lg"
            textTransform="uppercase"
            w="80"
          >
            <List>
              {clubs.map((club) => (
                <ListItem
                  h="12"
                  p="1"
                  borderBottom="1px"
                  borderBottomColor="orange.300"
                  key={club.id}
                >
                  <Link href={`/clubs/${club.id}`}>
                    <AtSignIcon boxSize="10" w={6} mr="1" />
                    {club.name}
                    Est:{club.established}
                  </Link>
                  <ArrowForwardIcon />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </Flex>
    // <Flex justifyContent="center" minH="calc(100vh - 80px)">
    //   <Box display="block">
    //     <Heading>Clubs</Heading>
    //     <Flex justifyContent="center">
    //       <Button
    //         color="white"
    //         variant="ghost"
    //         leftIcon={<AddIcon />}
    //         as={Link}
    //         href="/clubs/club-registration"
    //       >
    //         Register new club
    //       </Button>
    //     </Flex>
    //     <Box w="80" borderWidth="1px" borderRadius="lg" overflow="hidden">
    //       <List
    //         color="white"
    //         bg="brand"
    //         fontWeight="medium"
    //         fontSize="lg"
    //         mt="2"
    //         spacing={3}
    //         w="80"
    //         borderRadius="5%"
    //         padding="5"
    //         boxShadow="dark-lg"
    //       >
    //         {clubs.map((club) => (
    //           <ListItem
    //             borderBottom="1px"
    //             borderBottomColor="orange.300"
    //             key={club.id}
    //           >
    //             <Link href={`/clubs/${club.id}`}>
    //               {club.name}
    //               {<ArrowForwardIcon />}
    //             </Link>
    //           </ListItem>
    //         ))}
    //       </List>
    //     </Box>
    //   </Box>
    // </Flex>
  );
}
