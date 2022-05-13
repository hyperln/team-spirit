import { useEffect, useState, useReducer } from 'react';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Heading } from '@components/atoms/typography/heading';
import { Text } from '@components/atoms/typography/text';
import { useToast } from '@hooks/use-toast';
import { isUserAdmin, isUserMember, leaveTeam } from '@lib/db';
import { Club, Gender, Team } from 'shared/types';
import { Spinner } from '@components/atoms/spinner';
import { Link } from '@components/atoms/link';
import { capitalizeFirstLetter } from '@utils/string-utils';

interface Props {
  club: Club;
  team: Team;
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

export function TeamPageTemplate({ team }: Props) {
  const [userIsMember, setUserIsMember] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    isAdmin: true,
    isMember: true,
  });
  const toast = useToast();

  const checkIsUserMember = async () => {
    const isMember = await isUserMember(team.id);
    setUserIsMember(isMember);
    dispatch({ type: 'checkIsMember', payload: isMember });
  };

  const checkIsUserAdmin = async () => {
    const isAdmin = await isUserAdmin(team.id);
    console.log('isAdmin :>> ', isAdmin);
    setUserIsAdmin(isAdmin);
    dispatch({ type: 'checkIsUserAdmin', payload: isAdmin });
  };

  useEffect(() => {
    checkIsUserMember();
    checkIsUserAdmin();
  }, []);

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam(team.id);
      checkIsUserMember();
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
        {!state.isMemberLoading && !state.isAdminLoading ? (
          <Flex flexDir="column" gap="8">
            {userIsAdmin ? (
              <Link href="/clubs/teams/team-registration">Create Team</Link>
            ) : null}
            <Button
              isLoading={state.isMemberLoading || state.isAdminLoading}
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
