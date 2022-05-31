import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { useToast } from '@hooks/use-toast';
import { joinClub, leaveClub } from '@lib/db';
import { Club } from 'shared/types';
import { Spinner } from '@components/atoms/spinner';
import { Link } from '@components/atoms/link';
import { PageHeader } from '@components/organisms/pageheader';
import { AddIcon } from '@chakra-ui/icons';
import { Avatar } from '@components/molecules/avatar-image';
import { Text } from '@components/atoms/typography/text';
import { MemberState, userMemberState } from '@hooks/use-member-state';

interface Props {
  club: Club;
}

interface SecondaryActionProps {
  memberState: MemberState;
  handleJoinClub: () => void;
  handleLeaveClub: () => void;
}

function SecondaryAction({
  handleJoinClub,
  handleLeaveClub,
  memberState,
}: SecondaryActionProps) {
  return memberState === 'notMember' ? (
    <Button
      variant="unstyled"
      bg="transparent"
      onClick={handleJoinClub}
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
      Join
    </Button>
  ) : memberState === 'admin' ? (
    <Button
      justifySelf="flex-end"
      variant="unstyled"
      borderRadius="70"
      bg="transparent"
      onClick={() => console.log('add edit club from krills branch')}
    >
      Edit
    </Button>
  ) : (
    <Button
      justifySelf="flex-end"
      variant="unstyled"
      borderRadius="70"
      bg="transparent"
      onClick={handleLeaveClub}
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

export function ClubPageTemplate({ club }: Props) {
  const toast = useToast();
  const { memberState, isLoading, checkMemberState } = userMemberState({
    clubId: club.id,
  });

  const handleJoinClub = async () => {
    try {
      await joinClub(club.id);
      checkMemberState();
      toast({
        status: 'success',
        description: 'You have joined the club!',
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

  const handleLeaveClub = async () => {
    try {
      await leaveClub(club.id);
      checkMemberState();
      toast({
        status: 'success',
        description: 'You have left the club!',
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
    <Flex w="full" flexDir="column">
      <Box w="full">
        <PageHeader
          image={
            <Flex w="full" justifyContent="center">
              <Box position="relative">
                <Box p="4" display="block">
                  <Avatar
                    my="-2"
                    borderColor="white"
                    showBorder
                    size="xl"
                    left="2"
                    src={club.logoUrl}
                  />
                </Box>
              </Box>
            </Flex>
          }
          title={club.name}
          secondaryAction={
            <SecondaryAction
              handleLeaveClub={handleLeaveClub}
              handleJoinClub={handleJoinClub}
              memberState={memberState}
            />
          }
        />
        <Text fontWeight="semibold">{club.established}</Text>
      </Box>
      {!isLoading ? (
        <Flex mt="5" flexDir="column" gap="8">
          {memberState === 'admin' ? (
            <Button
              color="white"
              variant="ghost"
              leftIcon={<AddIcon />}
              href={`/clubs/${club.id}/teams/team-registration`}
              as={Link}
            >
              Register New Team
            </Button>
          ) : null}
        </Flex>
      ) : null}
    </Flex>
  );
}
