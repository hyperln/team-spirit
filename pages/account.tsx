import { Box } from '@components/atoms/box';
import { Link } from '@components/atoms/link';
import { useAuth } from '@hooks/use-auth';

export default function Account() {
  const { user } = useAuth();
  return (
    <Box>
      This is your account page: {user?.email}
      <Box>
        <Link href="/">Home</Link>
      </Box>
    </Box>
  );
}
