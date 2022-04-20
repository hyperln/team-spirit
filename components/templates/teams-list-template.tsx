import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';
import { List, ListItem } from '@components/atoms/list';
import { Heading } from '@components/atoms/typography/heading';
import { ArrowForwardIcon, AddIcon } from '@chakra-ui/icons';

import { useRouter } from 'next/router';

export function TeamsListTemplate({ teams }) {
  const router = useRouter();

  const { clubId } = router.query;
  return (
    <Flex
      justifyContent="center"
      bgGradient="linear(brand.900 10%, brand.600 60%)"
      minH="calc(100vh - 80px)"
    >
      <Box display="block">
        <Heading>Teams</Heading>
        <Button
          leftIcon={<AddIcon />}
          as={Link}
          href={`/clubs/${clubId}/teams/team-registration`}
        >
          Register new team
        </Button>
        <List fontSize="xl" mt="2" spacing={3}>
          {teams.map((club, team) => (
            <ListItem key={team.id}>
              <Link href={`/clubs/${club.id}/${team.id}`}>
                {team.name}
                {<ArrowForwardIcon />}
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Flex>
  );
}
