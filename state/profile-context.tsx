import { useAuth } from '@hooks/use-auth';
import { getUserProfile } from '@lib/db';
import { getAvatarImage } from '@lib/storage/storage';
import { createContext, useCallback, useEffect, useState } from 'react';

export const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async () => {
    const profileData = await getUserProfile(user.id);
    const { signedURL } = await getAvatarImage(profileData.avatarUrl);
    setProfile({ ...profileData, previewUrl: signedURL });
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user, fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{
        state: {
          profile,
        },
        actions: {
          setProfile,
          fetchProfile,
        },
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
