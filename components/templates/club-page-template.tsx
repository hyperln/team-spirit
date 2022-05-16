import { useEffect, useState, useReducer } from 'react';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Center } from '@components/atoms/center';
import { Flex } from '@components/atoms/flex';
import { Heading } from '@components/atoms/typography/heading';
import { Text } from '@components/atoms/typography/text';
import { useToast } from '@hooks/use-toast';
import {
  isUserAdmin,
  isUserMember,
  joinClub,
  leaveClub,
  UpdateClubProfile,
} from '@lib/db';
import { Club } from 'shared/types';
import { Spinner } from '@components/atoms/spinner';
import { Link } from '@components/atoms/link';
import { AddIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { uploadLogoImage } from '@lib/storage/storage';
import { Input, InputGroup } from '@components/atoms/input';
import { Avatar } from '@components/molecules/avatar-image';
import { useDisclosure } from '@hooks/use-disclosure';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@components/organisms/modal';
import { FormControl } from '@components/molecules/form';
import { Icon } from '@components/atoms/icon';
import { Container, InputAddon } from '@chakra-ui/react';

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
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [userIsMember, setUserIsMember] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(club.logoUrl || '');
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
    setUserIsAdmin(isAdmin);
    dispatch({ type: 'checkIsUserAdmin', payload: isAdmin });
  };

  useEffect(() => {
    checkIsUserMember();
    checkIsUserAdmin();
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

    let logoImageId = '';

    if (image) {
      try {
        const logoUrlData = await uploadLogoImage(club.id, image);
        logoImageId = logoUrlData.Key.split('logos/')[1];
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
        logoImageId,
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
          <Container position="relative">
            <Container display="block">
              <Avatar
                onClick={onOpen}
                borderColor="white"
                showBorder
                size="xl"
                left="2"
                src={previewImageUrl}
              />
            </Container>
            <EditIcon
              onClick={onOpen}
              boxSize="6"
              bottom="2.5"
              left="28"
              position="absolute"
              backgroundColor="brand"
              color="white"
              borderColor="white"
              border="1px"
              borderRadius="10"
              p="0.5"
            />
          </Container>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Upload Logo</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  {userIsAdmin ? (
                    <form onSubmit={handleLogoUpload}>
                      <PlusSquareIcon
                        // as={Input}
                        onChange={onSelectFile}
                        type="file"
                        boxSize="xs"
                      />

                      {/* <Input
                        pt="1"
                        type="file"
                        placeholder="Club Logo"
                        accept="image/*"
                        onChange={onSelectFile}
                        name="logo"
                      /> */}
                      <Button
                        onClick={onClose}
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
                </FormControl>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Center>
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
