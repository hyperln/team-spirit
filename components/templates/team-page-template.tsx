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
import { MemberState, userMemberState } from '@hooks/use-member-state';
import { PageHeader } from '@components/organisms/pageheader';

interface Props {
  club: Club;
  team: Team;
}

export function TeamPageTemplate({ team, club }: Props) {
  const { memberState, isLoading, checkMemberState } = userMemberState({
    teamId: team.id,
  });
  const toast = useToast();

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

  interface SecondaryActionProps {
    memberState: MemberState;
    handleLeaveTeam: () => void;
  }

  function SecondaryAction({
    handleLeaveTeam,
    memberState,
  }: SecondaryActionProps) {
    return memberState === 'admin' ? (
      <Button
        justifySelf="flex-end"
        variant="unstyled"
        borderRadius="70"
        bg="transparent"
        onClick={() => console.log('add edit team from krills branch')}
      >
        Edit
      </Button>
    ) : (
      <Button
        justifySelf="flex-end"
        variant="unstyled"
        borderRadius="70"
        bg="transparent"
        onClick={handleLeaveTeam}
        spinner={
          <Spinner
            variant="outline"
            thickness="3.8px"
            emptyColor="gray.600"
            speed="0.75s"
            size="lg"
          />
        }
      >
        Leave
      </Button>
    );
  }

  return (
    <Flex justifyContent="center">
      <Box w="full" display="block">
        <PageHeader
          title={team.name}
          secondaryAction={
            <SecondaryAction
              handleLeaveTeam={handleLeaveTeam}
              memberState={memberState}
            />
          }
        />
        <Text>{capitalizeFirstLetter((team.gender as Gender).name)}</Text>
        {!isLoading ? (
          <Flex flexDir="column" gap="8">
            {memberState === 'admin' ? (
              <Link href="/clubs/teams/team-registration">Create Team</Link>
            ) : null}
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
