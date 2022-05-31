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
import { PageHeader } from '@components/organisms/pageheader';
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
import {
  Editable,
  EditableInput,
  EditablePreview,
} from '@components/atoms/typography/editable';
import { useEditableControls } from '@hooks/use-editable-controls';
import { ColorAccordion } from '@components/organisms/color-accordion';
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

function EditControls() {
  const {
    isEditing,
    getEditButtonProps,
    getCancelButtonProps,
    getSubmitButtonProps,
  } = useEditableControls();
  return (
    <Flex justifyContent="center" m="1">
      {!isEditing ? (
        <IconButton
          size="xs"
          aria-label="Edit club name"
          icon={<Icon src="/icons/edit.svg" height={16} width={16} />}
          {...getEditButtonProps()}
        />
      ) : (
        <Flex justifyContent="center">
          <IconButton
            mr="1"
            size="xs"
            aria-label="Save"
            icon={<CheckIcon />}
            {...getSubmitButtonProps()}
          />
          <IconButton
            size="xs"
            aria-label="Cancel"
            icon={<CloseIcon />}
            {...getCancelButtonProps()}
          />
        </Flex>
      )}
    </Flex>
  );
}

export function ClubPageTemplate({ club }: Props) {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
    try {
      await UpdateClub(club.id, {
        name: clubName,
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
    <Flex flexDir="column" minH="calc(100vh - 80px)">
      <Box>
        <PageHeader
          image={
            <Flex w="full" justifyContent="center">
              <Box position="relative">
                <Box p="4" display="block">
                  <Avatar
                    my="-2"
                    onClick={onOpen}
                    borderColor="white"
                    showBorder
                    size="xl"
                    left="2"
                    src={previewImageUrl}
                  />
                </Box>
              </Box>
            </Flex>
          }
          title={club.name}
          secondaryAction={
            !userIsMember ? (
              <Button
                color="black"
                variant="unstyled"
                bg="transparent"
                isLoading={state.isMemberLoading || state.isAdminLoading}
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
                Leave
              </Button>
            )
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
