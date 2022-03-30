import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { withRequireAuth } from '@hoc/with-auth';
import withTransition from '@hoc/with-transition';
import { useAuth } from '@hooks/use-auth';

function Authed() {
  const { signOut } = useAuth();
  return (
    <Box>
      I am authed
      <Button onClick={signOut}>Log out</Button>
    </Box>
  );
}

export default withTransition(withRequireAuth)(Authed);
