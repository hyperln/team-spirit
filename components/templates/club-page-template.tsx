import { useEffect, useState, useReducer } from 'react';
import { Box } from '@components/atoms/box';
import { Button, IconButton } from '@components/atoms/button';
import { Center } from '@components/atoms/center';
import { Flex } from '@components/atoms/flex';
import { Heading } from '@components/atoms/typography/heading';
import { useToast } from '@hooks/use-toast';
import {
  isUserAdmin,
  isUserMember,
  joinClub,
  leaveClub,
  UpdateClub,
} from '@lib/db';
import { Club } from 'shared/types';
import { Spinner } from '@components/atoms/spinner';
import { Link } from '@components/atoms/link';
import { AddIcon, CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { uploadLogoImage } from '@lib/storage/storage';
import { Input } from '@components/atoms/input';
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
import { FormControl, FormLabel } from '@components/molecules/form';
import { Icon } from '@components/atoms/icon';
import { ButtonGroup, Container } from '@chakra-ui/react';
import {
  Editable,
  EditableInput,
  EditablePreview,
} from '@components/atoms/typography/editable';

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

  const [size, setSize] = useState('xs');
  const [clubName, setClubName] = useState('');
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
    setClubName(clubName);
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
      await UpdateClub(club.id, {
        name: clubName,
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

  const handleEditableChange = async (e) => {
    e.preventDefault();
    try {
      await UpdateClub(club.id, {
        name: clubName,
      });

      toast({
        status: 'success',
        description: 'Club name has been updated!',
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
    <Flex bg="orange.400" justifyContent="center">
      <Box>
        <form onSubmit={handleEditableChange}>
          <Editable
            textAlign="center"
            fontSize="2xl"
            // name="clubName"
            // value={clubName}
            defaultValue={club.name}
            color="white"
          >
            <EditablePreview />
            {/* <Input
              as={EditableInput}
              // type="submit"
            /> */}
            <EditableInput
              type="submit"
              // onEdit={handleEditableChange}
              onChange={(e) => setClubName(e.target.value)}
            />
          </Editable>
        </form>
        <Container position="relative">
          <Container p="4" display="block">
            <Avatar
              my="-2"
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

        <Modal isOpen={isOpen} onClose={onClose} size={size}>
          <ModalOverlay />
          <ModalContent borderRadius="xl">
            <ModalBody>
              <ModalHeader textAlign="center">Upload Logo</ModalHeader>
              <ModalCloseButton />
              <FormControl>
                {userIsAdmin ? (
                  <form onSubmit={handleLogoUpload}>
                    <Input
                      id="icon-button-file"
                      style={{ display: 'none' }}
                      type="file"
                      placeholder="Club Logo"
                      accept="image/*"
                      onChange={onSelectFile}
                      name="logo"
                    />
                    <FormLabel
                      border="2px"
                      borderStyle="dotted"
                      htmlFor="icon-button-file"
                    >
                      <Icon
                        width="150"
                        height="150"
                        src="/icons/upload-image.svg"
                      />
                    </FormLabel>
                    <Center>
                      <Avatar
                        borderColor="white"
                        showBorder
                        mt="5"
                        size="xl"
                        src={previewImageUrl}
                      />
                    </Center>
                    <Flex pt="2" direction="column">
                      <Button
                        onClick={onClose}
                        color="white"
                        variant="ghost"
                        type="submit"
                        isLoading={isLoading}
                        spinner={<Spinner size="lg" />}
                      >
                        Save
                      </Button>
                    </Flex>
                  </form>
                ) : null}
              </FormControl>
            </ModalBody>
          </ModalContent>
        </Modal>
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
