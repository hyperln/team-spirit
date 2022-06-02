import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { IconButton } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Icon } from '@components/atoms/icon';
import { useEditableControls } from '@hooks/use-editable-controls';
import { useToast } from '@hooks/use-toast';
import { UpdateTeam } from '@lib/db';
import { useEffect, useState } from 'react';
import { getLogoImage } from '@lib/storage/storage';
import { Club, Team } from 'shared/types';
import {
  Editable,
  EditableInput,
  EditablePreview,
} from '@components/atoms/typography/editable';
import { Box } from '@components/atoms/box';
import { Avatar } from '@components/molecules/avatar-image';

interface Props {
  club: Club;
  team: Team;
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
          aria-label="Edit Team Name"
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

export function TeamSettingsTemplate({ club, team }: Props) {
  const toast = useToast();

  const [teamName, setTeamName] = useState('');

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
    <Flex direction="column" alignItems="center">
      <Flex ml="5" mt="5" mb="5">
        <Editable
          maxWidth="72"
          placeholder="Enter Team Name"
          alignItems="center"
          onSubmit={handleEditableChange}
          textAlign="center"
          fontSize="2xl"
          defaultValue={team.name}
          display="flex"
        >
          <EditablePreview />
          <EditableInput onChange={(e) => setTeamName(e.target.value)} />
          <EditControls />
        </Editable>
      </Flex>
    </Flex>
  );
}
