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
    const previewUrl = await getAvatarImage(profileData.avatarUrl);
    setProfile({ ...profileData, previewUrl });
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
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
        },
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
