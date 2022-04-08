import { useContext } from 'react';
import { ProfileContext } from '@state/profile-context';

export function useProfile() {
  const { state, actions } = useContext(ProfileContext);

  return {
    profile: state.profile,
    fetchProfile: actions.fetchProfile,
  };
}
