import { useEffect, useState } from 'react';
import { useToast } from '@hooks/use-toast';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Input } from '@components/atoms/input';
import { useAuth } from '@hooks/use-auth';
import { updateUserProfile } from '@lib/db';
import { Select } from '@components/atoms/select';
import { Flex } from '@components/atoms/flex';
import { uploadAvatarImage } from '@lib/storage/storage';
import { Avatar } from '@components/molecules/avatar-image';
import { useProfile } from '@hooks/use-profile';
import { Spinner } from '@components/atoms/spinner';
import { Heading } from '@components/atoms/typography/heading';
import { FormControl, FormLabel } from '@components/molecules/form';
import { Center } from '@components/atoms/center';
import { useColorModeValue } from '@hooks/use-color-mode';
import { Text } from '@components/atoms/typography/text';

export function AccountPageTemplate() {
  const toast = useToast();
  const { user } = useAuth();
  const { profile, fetchProfile } = useProfile();

  const [image, setImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setGender(profile.gender);
      setPreviewImageUrl(profile.previewUrl);
    }
  }, [profile]);

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

  const handleGenderSelect = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    let avatarUrl = '';

    if (image) {
      try {
        const avatarUrlData = await uploadAvatarImage(user.id, image);
        avatarUrl = avatarUrlData.Key.split('avatars/')[1];
      } catch (error) {
        return toast({
          status: 'error',
          description: error.message,
          title: 'error',
        });
      }
    }

    try {
      await updateUserProfile(user.id, {
        firstName,
        lastName,
        avatarUrl,
        gender,
      });

      fetchProfile();

      toast({
        status: 'success',
        description: 'Profile has been updated!',
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
    <Flex justifyContent="flex-start" h="52" mt="-20">
      <Box
        bg="orange.400"
        mt="16"
        justifyContent={{ base: 'center', lg: 'right' }}
        p="12"
        width="full"
      >
        <Center>
          <Avatar
            borderColor="white"
            showBorder
            mt="5"
            size="xl"
            src={previewImageUrl}
            name={firstName || user.email}
          />
        </Center>
        <Heading as="h2" size="lg" textAlign="center">
          Welcome, {profile?.firstName || user.email}{' '}
        </Heading>

        <form onSubmit={handleSubmit}>
          <FormControl mt="10" mb="6" variant="floating">
            <Box mb="2" position="relative">
              <FormLabel
                position="absolute"
                top={firstName ? '-8' : '0'}
                left="0"
                py="4"
                fontSize={firstName ? 'sm' : 'md'}
                pointerEvents="none"
                outline="none"
                transition="0.5s"
                _focus={{
                  top: '-8',
                  color: '#03e9f4',
                  fontSize: 'sm',
                }}
              >
                First Name
              </FormLabel>
              <Input
                placeholder=" "
                w="100%"
                py="4"
                mb="3"
                variant="flushed"
                background="transparent"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                name="firstName"
              />
            </Box>
            <Box mb="2" position="relative">
              <FormLabel
                position="absolute"
                top={lastName ? '-8' : '0'}
                left="0"
                py="4"
                fontSize={lastName ? 'sm' : 'md'}
                pointerEvents="none"
                transition="0.5s"
                _focus={{
                  top: '-8',
                  color: '#03e9f4',
                  fontSize: 'sm',
                }}
              >
                Last Name
              </FormLabel>
              <Input
                placeholder=" "
                w="100%"
                py="4"
                mb="3"
                variant="flushed"
                background="transparent"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                name="lastName"
              />
            </Box>
            <Box mb="5">
              <Select
                onChange={handleGenderSelect}
                placeholder="Gender"
                variant="flushed"
                value={gender}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </Box>

            <Box>
              <Text mb="1" fontWeight="semibold">
                Profile Picture
              </Text>
              <Input
                type="file"
                placeholder="Profile picture"
                accept="image/*"
                onChange={onSelectFile}
                name="avatar"
              />
            </Box>
          </FormControl>
          <Box textAlign="center">
            <Button
              color="white"
              variant="ghost"
              type="submit"
              isLoading={isLoading}
              spinner={<Spinner size="lg" />}
            >
              Save Profile
            </Button>
          </Box>
        </form>
      </Box>
    </Flex>
  );
}
