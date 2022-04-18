import {
  AtSignIcon,
  HamburgerIcon,
  LockIcon,
  MoonIcon,
  StarIcon,
  SunIcon,
} from '@chakra-ui/icons';
import { IconButton } from '@components/atoms/button';
import { Center } from '@components/atoms/center';
import { Flex } from '@components/atoms/flex';
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
import { useColorMode } from '@hooks/use-color-mode';
import { useProfile } from '@hooks/use-profile';

const colorModeIcons = {
  dark: SunIcon,
  light: MoonIcon,
};

export function Navigation() {
  const { profile } = useProfile();
  const { signOut } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  const ColorModeIcon = colorModeIcons[colorMode];
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
            <MenuItem
              as={Link}
              href="/account/payment-methods"
              icon={<AtSignIcon w={6} />}
            >
              Payment Methods
            </MenuItem>
            <MenuItem as={Link} href="/clubs" icon={<AtSignIcon w={6} />}>
              Clubs
            </MenuItem>
            <MenuItem
              as={Link}
              href="/clubs/club-registration"
              icon={<AtSignIcon w={6} />}
            >
              Register club
            </MenuItem>
            <MenuItem
              as={Link}
              href="/account/payment-methods"
              icon={<AtSignIcon w={6} />}
            >
              Payment Methods
            </MenuItem>

            <MenuItem as={Link} href="/" icon={<StarIcon w={6} />}>
              Home
            </MenuItem>
            <MenuItem onClick={toggleColorMode} icon={<ColorModeIcon w={6} />}>
              Switch to {colorMode === 'light' ? 'dark' : 'light'} mode
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
