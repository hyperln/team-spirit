import { useEffect, useState, useReducer } from 'react';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { useToast } from '@hooks/use-toast';
import { isUserAdmin, isUserMember, joinClub, leaveClub } from '@lib/db';
import { Club } from 'shared/types';
import { Spinner } from '@components/atoms/spinner';
import { Link } from '@components/atoms/link';
import { PageHeader } from '@components/organisms/pageheader';
import { AddIcon } from '@chakra-ui/icons';
import { Avatar } from '@components/molecules/avatar-image';
import { Text } from '@components/atoms/typography/text';

interface Props {
  club: Club;
}

interface LoadingState {
  isMemberLoading: boolean;
  isAdminLoading: boolean;
}

const actions = {
  checkIsMember: (state: LoadingState, action: any) => ({
    ...state,
    isMemberLoading: action.payload,
  }),
  checkIsAdmin: (state: LoadingState, action: any) => ({
    ...state,
    isAdminLoading: action.payload,
  }),
};

function reducer(state, action) {
  return actions[action.type] || state;
}

function SecondaryAction({
  userIsMember,
  userIsAdmin,
  handleJoinClub,
  handleLeaveClub,
}) {
  return !userIsMember ? (
    <Button
      color="black"
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
  ) : userIsAdmin ? (
    <Button
      justifySelf="flex-end"
      variant="unstyled"
      color="white"
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
      color="white"
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

  const [userIsMember, setUserIsMember] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    isAdmin: true,
    isMember: true,
  });

  const checkIsUserMember = async () => {
    const isMember = await isUserMember(club.id);
    setUserIsMember(isMember);
    dispatch({ type: 'checkIsMember', payload: isMember });
  };

  const checkIsUserAdmin = async () => {
    const isAdmin = await isUserAdmin(club.id);
    setUserIsAdmin(isAdmin);
    dispatch({ type: 'checkIsUserAdmin', payload: isAdmin });
  };

  useEffect(() => {
    checkIsUserMember();
    checkIsUserAdmin();
  }, []);

  const handleJoinClub = async () => {
    try {
      await joinClub(club.id);
      checkIsUserMember();
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
      checkIsUserMember();
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
      <Box>
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
              userIsAdmin={userIsAdmin}
              userIsMember={userIsMember}
            />
          }
        />
        <Text fontWeight="semibold">{club.established}</Text>
      </Box>
      {!state.isMemberLoading && !state.isAdminLoading ? (
        <Flex mt="5" flexDir="column" gap="8">
          {userIsAdmin ? (
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
