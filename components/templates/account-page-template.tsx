import { useContext, useEffect, useState } from 'react';
import { useToast } from '@hooks/use-toast';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Input } from '@components/atoms/input';
import { useAuth } from '@hooks/use-auth';
import { updateUserProfile } from '@lib/db';
import { Select } from '@components/atoms/select';
import { Flex } from '@components/atoms/flex';
import { uploadAvatarImage } from '@lib/storage/storage';
import { ProfileContext } from '@state/profile-context';
import { Avatar } from '@components/molecules/avatar-image';

export function AccountPageTemplate() {
  const toast = useToast();
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');

  const {
    state: { profile },
    actions: { fetchProfile },
  } = useContext(ProfileContext);

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

      return toast({
        status: 'success',
        description: 'Profile has been updated!',
        title: 'Success',
      });
    } catch (error) {
      return toast({
        status: 'error',
        description: error.message,
        title: 'error',
      });
    }
  };

  return (
    <Flex justifyContent="center">
      <Box>
        Welcome, {profile?.firstName || user.email}
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            name="firstName"
          />
          <Input
            type="text"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            name="lastName"
          />
          <Select
            onChange={handleGenderSelect}
            placeholder="gender"
            variant="flushed"
            value={gender}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
          <Input
            type="file"
            placeholder="Profile picture"
            accept="image/*"
            onChange={onSelectFile}
            name="avatar"
          />
          {previewImageUrl ? (
            <Avatar src={previewImageUrl} name={firstName || user.email} />
          ) : null}
          <Button type="submit">Save Profile</Button>
        </form>
      </Box>
    </Flex>
  );
}
