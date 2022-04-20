import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Center } from '@components/atoms/center';
import { Flex } from '@components/atoms/flex';
import { Heading } from '@components/atoms/typography/heading';
import { Text } from '@components/atoms/typography/text';
import { useToast } from '@hooks/use-toast';
import { isUserMember, joinClub, leaveClub } from '@lib/db';
import { useEffect, useState } from 'react';
import { Club } from 'shared/types';

interface Props {
  club: Club;
}

export function ClubPageTemplate({ club }: Props) {
  const [userIsMember, setUserIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const checkIsUserMember = async () => {
    const isMember = await isUserMember(club.id);
    setUserIsMember(isMember);
    setIsLoading(false);
  };

  useEffect(() => {
    checkIsUserMember();
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
    <Flex justifyContent="center" minH="calc(100vh - 80px)">
      <Box display="block">
        <Heading>{club.name}</Heading>
        <Text fontWeight="semibold">Established: {club.established}</Text>
        {!userIsMember ? (
          <Button isLoading={isLoading} onClick={handleJoinClub}>
            Join club
          </Button>
        ) : (
          <Button isLoading={isLoading} onClick={handleLeaveClub}>
            Leave club
          </Button>
        )}
      </Box>
    </Flex>
  );
}
