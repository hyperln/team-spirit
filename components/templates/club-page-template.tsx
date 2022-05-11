import { useEffect, useState, useReducer } from 'react';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Center } from '@components/atoms/center';
import { Flex } from '@components/atoms/flex';
import { Heading } from '@components/atoms/typography/heading';
import { Text } from '@components/atoms/typography/text';
import { useToast } from '@hooks/use-toast';
import {
  fetchClub,
  isUserAdmin,
  isUserMember,
  joinClub,
  leaveClub,
  UpdateClubData,
  UpdateClubProfile,
} from '@lib/db';
import { Club } from 'shared/types';
import { Spinner } from '@components/atoms/spinner';
import { Link } from '@components/atoms/link';
import { useRouter } from 'next/router';
import { List, ListItem } from '@components/atoms/list';
import { AddIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { uploadLogoImage } from '@lib/storage/storage';
import { useAuth } from '@hooks/use-auth';
import { Input } from '@components/atoms/input';
import { Avatar } from '@components/molecules/avatar-image';

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
  const router = useRouter();
  const toast = useToast();

  const { clubId } = router.query;

  const [userIsMember, setUserIsMember] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    console.log('isAdmin :>> ', isAdmin);
    setUserIsAdmin(isAdmin);
    dispatch({ type: 'checkIsUserAdmin', payload: isAdmin });
  };

  useEffect(() => {
    checkIsUserMember();
    checkIsUserAdmin();
    setPreviewImageUrl(previewImageUrl);
  }, []);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setPreviewImageUrl(undefined);
      return;
    }

    const selectedFile = e.target.files[0];

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewImageUrl(objectUrl);
    setImage(selectedFile);
  };

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

  const handleLogoUpload = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    let logoUrl = '';

    if (image) {
      try {
        const logoUrlData = await uploadLogoImage(club.id, image);
        logoUrl = logoUrlData.Key.split('logos/')[1];
      } catch (error) {
        return toast({
          status: 'error',
          description: error.message,
          title: 'error',
        });
      }
    }
    try {
      await UpdateClubProfile(club.id, {
        logoUrl,
      });

      toast({
        status: 'success',
        description: 'Club logo has been saved!',
        title: 'Success',
      });
    } catch (error) {
      toast({
        status: 'error',
        description: error.message,
        title: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex justifyContent="center">
      <Box display="block">
        <Center>
          <Heading>{club.name}</Heading>
          <Text fontWeight="semibold">{club.established}</Text>
          <Avatar
            borderColor="white"
            showBorder
            mt="5"
            size="xl"
            src={previewImageUrl}
          />
        </Center>
        {!state.isMemberLoading && !state.isAdminLoading ? (
          <Flex mt="5" flexDir="column" gap="8">
            {userIsAdmin ? (
              <form onSubmit={handleLogoUpload}>
                <Input
                  pt="1"
                  type="file"
                  placeholder="Club Logo"
                  accept="image/*"
                  onChange={onSelectFile}
                  name="logo"
                />
                <Button
                  color="white"
                  variant="ghost"
                  type="submit"
                  isLoading={isLoading}
                  spinner={<Spinner size="lg" />}
                >
                  Save Club Logo
                </Button>
              </form>
            ) : null}
            {userIsAdmin ? (
              <Button
                color="white"
                variant="ghost"
                leftIcon={<AddIcon />}
                href={`/clubs/${clubId}/teams/team-registration`}
                as={Link}
              >
                Register New Team
              </Button>
            ) : null}

            {!userIsMember ? (
              <Button
                color="white"
                variant="ghost"
                isLoading={state.isMemberLoading || state.isAdminLoading}
                onClick={handleJoinClub}
                spinner={<Spinner size="lg" />}
              >
                Join club
              </Button>
            ) : (
              <Button
                variant="ghost"
                color="white"
                borderRadius="70"
                bg="brand"
                isLoading={state.isMemberLoading || state.isAdminLoading}
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
                Leave club
              </Button>
            )}
          </Flex>
        ) : null}
      </Box>
    </Flex>
  );
}
