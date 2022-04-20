import { useState } from 'react';
import {
  AtSignIcon,
  HamburgerIcon,
  LockIcon,
  MoonIcon,
  StarIcon,
  SunIcon,
} from '@chakra-ui/icons';

import { Button, IconButton } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';
import { Avatar } from '@components/molecules/avatar-image';
import { useAuth } from '@hooks/use-auth';
import { useDisclosure } from '@hooks/use-disclosure';
import { useColorMode } from '@hooks/use-color-mode';
import { useProfile } from '@hooks/use-profile';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
} from '@components/organisms/drawer';
import { useRouter } from 'next/router';

const colorModeIcons = {
  dark: SunIcon,
  light: MoonIcon,
};

export function Navigation() {
  const { profile } = useProfile();
  const { signOut } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();
  const { clubId, teamId } = router.query;

  const [size, setSize] = useState('full');

  const handleClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };

  const handlClickLogout = () => {
    signOut();
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  const ColorModeIcon = colorModeIcons[colorMode];

  return (
    <>
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
              <Flex alignItems="flex-start" flexDir="column" mt="20" mx="10">
                <Link
                  onClick={handleLinkClick}
                  display="flex"
                  gap="4"
                  alignItems="center"
                  href="/"
                >
                  <StarIcon w={6} />
                  Home
                </Link>
                <Link
                  onClick={handleLinkClick}
                  href="/account"
                  display="flex"
                  gap="4"
                  alignItems="center"
                >
                  {profile ? (
                    <Avatar
                      size="xs"
                      src={profile.previewUrl}
                      name={profile.firstName}
                    />
                  ) : (
                    <AtSignIcon w={6} />
                  )}
                  Account
                </Link>
                <Link
                  onClick={handleLinkClick}
                  href="/account/payment-methods"
                  display="flex"
                  gap="4"
                  alignItems="center"
                >
                  <AtSignIcon w={6} />
                  Payment Methods
                </Link>
                <Link
                  onClick={handleLinkClick}
                  display="flex"
                  gap="4"
                  alignItems="center"
                  href="/clubs"
                >
                  <AtSignIcon w={6} />
                  Clubs
                </Link>
                <Link
                  onClick={handleLinkClick}
                  display="flex"
                  gap="4"
                  alignItems="center"
                  href="/clubs/club-registration"
                >
                  <AtSignIcon w={6} />
                  Register club
                </Link>
                <Link
                  onClick={handleLinkClick}
                  display="flex"
                  gap="4"
                  alignItems="center"
                  href="/clubs/teams"
                >
                  <AtSignIcon w={6} />
                  Teams
                </Link>
                <Button
                  fontWeight="normal"
                  variant="unstyled"
                  onClick={toggleColorMode}
                  leftIcon={<ColorModeIcon w={6} />}
                >
                  Switch to {colorMode === 'light' ? 'dark' : 'light'} mode
                </Button>
                <Button
                  fontWeight="normal"
                  variant="unstyled"
                  onClick={handlClickLogout}
                  leftIcon={<LockIcon w={6} />}
                >
                  Log out
                </Button>
              </Flex>
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
