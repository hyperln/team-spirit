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
  console.log(teams);
  const { clubId } = router.query;
  return (
    <Flex justifyContent="center">
      <Box display="block">
        <Heading>Teams</Heading>
        <Button
          color="white"
          variant="ghost"
          leftIcon={<AddIcon />}
          as={Link}
          href={`/clubs/${clubId}/teams/team-registration`}
        >
          Register new team
        </Button>
        <List fontSize="xl" mt="2" spacing={3}>
          {teams.map((team) => (
            <ListItem key={team.id}>
              <Link href={`/clubs/${team.clubId}/teams/${team.id}`}>
                {team.name}
                <ArrowForwardIcon />
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Flex>
  );
}
