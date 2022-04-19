import {
  AtSignIcon,
  HamburgerIcon,
  LockIcon,
  MoonIcon,
  StarIcon,
  SunIcon,
} from '@chakra-ui/icons';
import { Button, IconButton } from '@components/atoms/button';
import { Box } from '@components/atoms/box';
import { Center } from '@components/atoms/center';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';
import { Avatar } from '@components/molecules/avatar-image';
import { Menu, MenuItem, MenuGroup } from '@components/organisms/menu';
import { useAuth } from '@hooks/use-auth';
import { useDisclosure } from '@hooks/use-disclosure';
import { useColorMode } from '@hooks/use-color-mode';
import { useProfile } from '@hooks/use-profile';
import { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from '@components/organisms/drawer';

const colorModeIcons = {
  dark: SunIcon,
  light: MoonIcon,
};

export function Navigation() {
  const { profile } = useProfile();
  const { signOut } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [size, setSize] = useState('full');

  const handleClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };

  const ColorModeIcon = colorModeIcons[colorMode];

  return (
    <Menu placement="bottom">
      <Button
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
        onClick={() => handleClick(size)}
        key={size}
        m={4}
      >
        {`Open ${size} Drawer`}
      </Button>

      <Drawer onClose={onClose} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent
          alignItems="flex-start"
          justifyItems="center"
          fontSize="lg"
        >
          <DrawerCloseButton />
          <DrawerBody>
            <nav>
              <Flex flexDir="column" mt="20" mx="10">
                <MenuItem as={Link} href="/" icon={<StarIcon w={6} />}>
                  Home
                </MenuItem>
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
                      <AtSignIcon w={6} />
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
                  onClick={toggleColorMode}
                  icon={<ColorModeIcon w={6} />}
                >
                  Switch to {colorMode === 'light' ? 'dark' : 'light'} mode
                </MenuItem>
                <MenuItem onClick={signOut} icon={<LockIcon w={6} />}>
                  Log out
                </MenuItem>
              </Flex>
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Menu>
  );
}
