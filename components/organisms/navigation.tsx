import {
  AtSignIcon,
  HamburgerIcon,
  LockIcon,
  StarIcon,
} from '@chakra-ui/icons';
import { IconButton } from '@components/atoms/button';
import { Link } from '@components/atoms/link';
import { Avatar } from '@components/molecules/avatar-image';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
} from '@components/organisms/menu';
import { useAuth } from '@hooks/use-auth';
import { useProfile } from '@hooks/use-profile';

export function Navigation() {
  const { profile } = useProfile();
  const { signOut } = useAuth();
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
          <MenuGroup
            title={`Welcome${
              profile?.firstName ? `, ${profile.firstName}` : ''
            }`}
          >
            <MenuItem
              as={Link}
              href="/account"
              icon={
                profile ? (
                  <Avatar
                    size="xs"
                    src={profile.previewUrl}
                    name={profile.firstName}
                  />
                ) : (
                  <AtSignIcon />
                )
              }
            >
              Account
            </MenuItem>

            <MenuItem as={Link} href="/" icon={<StarIcon w={6} />}>
              Home
            </MenuItem>
            <MenuItem onClick={signOut} icon={<LockIcon w={6} />}>
              Log out
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </nav>
    </Menu>
  );
}
