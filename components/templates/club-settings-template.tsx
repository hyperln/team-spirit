import { useState } from 'react';
import { Box } from '@components/atoms/box';
import { Button, IconButton } from '@components/atoms/button';
import { Center } from '@components/atoms/center';
import { Flex } from '@components/atoms/flex';
import { useToast } from '@hooks/use-toast';
import { UpdateClub } from '@lib/db';
import { Club } from 'shared/types';
import { Spinner } from '@components/atoms/spinner';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
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

interface Props {
  club: Club;
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

export function ClubSettingsTemplate({ club }: Props) {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const [clubName, setClubName] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState(club.logoUrl || '');
  const [image, setImage] = useState(null);

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
    <>
      <Flex>
        <Box>
          <Editable
            alignItems="center"
            onSubmit={handleEditableChange}
            textAlign="center"
            fontSize="2xl"
            defaultValue={club.name}
            display="flex"
          >
            <EditablePreview />
            <EditableInput
              backgroundColor="gray.100"
              onChange={(e) => setClubName(e.target.value)}
            />
            <EditControls />
          </Editable>
        </Box>
        <Box>
          <Avatar
            my="-2"
            onClick={onOpen}
            borderColor="white"
            showBorder
            size="xl"
            left="2"
            src={previewImageUrl}
          />
          <IconButton
            aria-label="Edit club logo"
            icon={<Icon width="16" height="16" src="/icons/edit.svg" />}
            onClick={onOpen}
            size="xs"
            bottom="3.5"
            left="24"
            position="absolute"
            backgroundColor="brand"
            borderColor="white"
            border="1px"
          />
        </Box>
        <ColorAccordion club={club} />
        <Modal isOpen={isOpen} onClose={onClose} size="xs">
          <ModalOverlay />
          <ModalContent borderRadius="xl">
            <ModalBody>
              <ModalHeader textAlign="center">Upload Logo</ModalHeader>
              <ModalCloseButton />
              <FormControl>
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
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
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
              </FormControl>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
}
