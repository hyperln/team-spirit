import { Box } from '@components/atoms/box';
import { Input } from '@components/atoms/input';
import { useAuth } from '@hooks/use-auth';

export function AccountPageTemplate() {
  const { user } = useAuth();
  return (
    <Box>
      Welcome, {user?.email}
      <Input placeholder="First Name" />
      <Input placeholder="Last Name" />
      <Input type="file" placeholder="profile pic" />
    </Box>
  );
}
