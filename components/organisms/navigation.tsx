import {
  AtSignIcon,
  HamburgerIcon,
  LockIcon,
  StarIcon,
} from '@chakra-ui/icons';
import { IconButton } from '@components/atoms/button';
import { Link } from '@components/atoms/link';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@components/organisms/menu';
import { useAuth } from '@hooks/use-auth';

export function Navigation() {
  const { user, signOut } = useAuth();
  return (
    <Menu placement="bottom">
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <nav>
        <MenuList>
          <MenuItem as={Link} href="account" icon={<AtSignIcon />}>
            Account
          </MenuItem>
          <MenuItem as={Link} href="/" icon={<StarIcon />}>
            Home
          </MenuItem>
          <MenuItem onClick={signOut} icon={<LockIcon />}>
            Log out
          </MenuItem>
        </MenuList>
      </nav>
    </Menu>
  );
}
