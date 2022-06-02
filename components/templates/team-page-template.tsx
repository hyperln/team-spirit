import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Heading } from '@components/atoms/typography/heading';
import { Text } from '@components/atoms/typography/text';
import { useToast } from '@hooks/use-toast';
import { leaveTeam } from '@lib/db';
import { Club, Gender, Team } from 'shared/types';
import { Spinner } from '@components/atoms/spinner';
import { Link } from '@components/atoms/link';
import { capitalizeFirstLetter } from '@utils/string-utils';
import { userMemberState } from '@hooks/use-member-state';
import { useRouter } from 'next/router';

interface Props {
  club: Club;
  team: Team;
}

export function TeamPageTemplate({ team, club }: Props) {
  const { memberState, isLoading, checkMemberState } = userMemberState({
    teamId: team.id,
  });
  const toast = useToast();

  const router = useRouter();
  const { clubId, teamId } = router.query;

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam(team.id);
      checkMemberState();
      toast({
        status: 'success',
        description: 'You have left the team!',
        title: 'Success',
      });
    } catch (error) {
      toast({
        status: 'error',
        description: error.message,
        title: 'error',
      });
    }
  };

  return (
    <Flex justifyContent="center">
      <Box display="block">
        <Heading>{team.name}</Heading>
        <Text>{capitalizeFirstLetter((team.gender as Gender).name)}</Text>
        {!isLoading ? (
          <Flex flexDir="column" gap="8">
            {/* {memberState === 'admin' ? ( */}
            <Link href={`/clubs/${clubId}/teams/${team.id}/team-settings`}>
              Edit
            </Link>
            {/* ) : null} */}
            <Button
              isLoading={isLoading}
              onClick={handleLeaveTeam}
              spinner={<Spinner size="lg" />}
            >
              Leave Team
            </Button>
          </Flex>
        ) : null}
      </Box>
    </Flex>
  );
}
