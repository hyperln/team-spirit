import { useEffect, useState, useReducer } from 'react';
import { Box } from '@components/atoms/box';
import { Button, IconButton } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Heading } from '@components/atoms/typography/heading';
import { Text } from '@components/atoms/typography/text';
import { useToast } from '@hooks/use-toast';
import { isUserAdmin, isUserMember, leaveTeam, UpdateTeam } from '@lib/db';
import { Club, Gender, Team } from 'shared/types';
import { Spinner } from '@components/atoms/spinner';
import { Link } from '@components/atoms/link';
import { capitalizeFirstLetter } from '@utils/string-utils';
import { useEditableControls } from '@hooks/use-editable-controls';
import { Icon } from '@components/atoms/icon';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Editable,
  EditableInput,
  EditablePreview,
} from '@components/atoms/typography/editable';
import { Avatar } from '@components/molecules/avatar-image';

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

function EditControls() {
  const {
    isEditing,
    getEditButtonProps,
    getCancelButtonProps,
    getSubmitButtonProps,
  } = useEditableControls();
  return (
    <Flex justifyContent="center">
      {!isEditing ? (
        <IconButton
          size="sm"
          aria-label="Edit club name"
          icon={<Icon src="/icons/edit.svg" height={16} width={16} />}
          {...getEditButtonProps()}
        />
      ) : (
        <Flex justifyContent="center">
          <IconButton
            size="sm"
            aria-label="Save"
            icon={<CheckIcon />}
            {...getSubmitButtonProps()}
          />
          <IconButton
            size="sm"
            aria-label="Cancel"
            icon={<CloseIcon />}
            {...getCancelButtonProps()}
          />
        </Flex>
      )}
    </Flex>
  );
}

export function TeamPageTemplate({ team }: Props) {
  const [userIsMember, setUserIsMember] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState(club.logoUrl || '');
  const [image, setImage] = useState(null);
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

  const handleEditableChange = async (e) => {
    try {
      await UpdateTeam(team.id, {
        name: teamName,
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
    <>
      <Flex bg="orange.400" justifyContent="center">
        <Flex flexDir="column" alignItems="center">
          <Flex justifyContent="center" w="full">
            <Editable
              onSubmit={handleEditableChange}
              textAlign="center"
              fontSize="2xl"
              defaultValue={capitalizeFirstLetter(team.name)}
              display="flex"
              flexDir="column"
            >
              <EditablePreview w="full" />
              <EditableInput
                w="full"
                display="inline"
                onChange={(e) => setTeamName(e.target.value)}
              />
              <EditControls />
            </Editable>
            {!state.isMemberLoading && !state.isAdminLoading ? (
              <Flex flexDir="column" gap="8" position="absolute" right="0">
                {userIsAdmin ? (
                  <Link href="/clubs/teams/team-registration">Create Team</Link>
                ) : null}
                <Button
                  mx="5"
                  outline="0"
                  variant="unstyled"
                  textColor="white"
                  isLoading={state.isMemberLoading || state.isAdminLoading}
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
              </Flex>
            ) : null}
          </Flex>
          <Flex w="full" justifyContent="center">
            <Box position="relative">
              <Box p="4" display="block">
                <Avatar
                  my="-2"
                  // onClick={onOpen}
                  borderColor="white"
                  showBorder
                  size="xl"
                  left="2"
                  src={previewImageUrl}
                />
                {/* <IconButton
                  aria-label="Edit club logo"
                  icon={<Icon width="16" height="16" src="/icons/edit.svg" />}
                  // onClick={onOpen}
                  size="sm"
                  bottom="2.5"
                  left="24"
                  position="absolute"
                  backgroundColor="brand"
                  borderColor="white"
                  border="1px"
                /> */}
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
