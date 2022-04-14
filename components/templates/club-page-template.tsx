import { useEffect, useState, useReducer } from 'react';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Heading } from '@components/atoms/typography/heading';
import { Text } from '@components/atoms/typography/text';
import { useToast } from '@hooks/use-toast';
import { isUserAdmin, isUserMember, joinClub, leaveClub } from '@lib/db';
import { Club } from 'shared/types';
import { Spinner } from '@components/atoms/spinner';
import { Link } from '@components/atoms/link';

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

export function ClubPageTemplate({ club }: Props) {
  const [userIsMember, setUserIsMember] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    isAdmin: true,
    isMember: true,
  });
  const toast = useToast();

  const checkIsUserMember = async () => {
    const isMember = await isUserMember(club.id);
    setUserIsMember(isMember);
    dispatch({ type: 'checkIsMember', payload: isMember });
  };

  const checkIsUserAdmin = async () => {
    const isAdmin = await isUserAdmin(club.id);
    console.log('isAdmin :>> ', isAdmin);
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
    <Flex justifyContent="center">
      <Box display="block">
        <Heading>{club.name}</Heading>
        <Text>{club.established}</Text>
        {!state.isMemberLoading && !state.isAdminLoading ? (
          <Flex flexDir="column" gap="8">
            {userIsAdmin ? (
              <Link href="/clubs/teams/team-registration">Create Team</Link>
            ) : null}
            {!userIsMember ? (
              <Button
                isLoading={state.isMemberLoading || state.isAdminLoading}
                onClick={handleJoinClub}
                spinner={
                  <Spinner
                    color="brand.50"
                    variant="outline"
                    thickness="3.8px"
                    emptyColor="gray.600"
                    speed="0.75s"
                    size="lg"
                  />
                }
              >
                Join club
              </Button>
            ) : (
              <Button
                isLoading={state.isMemberLoading || state.isAdminLoading}
                onClick={handleLeaveClub}
                spinner={
                  <Spinner
                    color="brand.50"
                    variant="outline"
                    thickness="3.8px"
                    emptyColor="gray.600"
                    speed="0.75s"
                    size="lg"
                  />
                }
              >
                Leave club
              </Button>
            )}
          </Flex>
        ) : null}
      </Box>
    </Flex>
  );
}
