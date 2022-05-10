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
import { useAuth } from '@hooks/use-auth';
import { useDisclosure } from '@hooks/use-disclosure';
import { useColorMode } from '@hooks/use-color-mode';

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
        icon={<HamburgerIcon color="white" boxSize={8} />}
        variant="ghost"
        onClick={() => handleClick(size)}
        key={size}
        m={1}
        right="5"
        p="0"
      >
        {`Open ${size} Drawer`}
      </Button>

      <Drawer onClose={onClose} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent
          bgGradient="linear(brand, orange.300 )"
          fontWeight="semibold"
          alignItems={{ md: 'center', base: 'left' }}
          fontSize="lg"
        >
          <DrawerCloseButton
            p="0"
            size="lg"
            position="fixed"
            bottom={{ base: '1', lg: undefined }}
            top={{ lg: '2' }}
            alignItems="center"
            right="6"
          />
          <DrawerBody>
            <nav>
              <Flex
                py={{ base: '16', md: '36' }}
                alignItems="flex-start"
                flexDir="column"
                mt="20"
                mx="10"
              >
                <Link
                  mb={{ base: '7', md: '10' }}
                  onClick={handleLinkClick}
                  display="flex"
                  gap="2"
                  alignItems="center"
                  href="/"
                >
                  <StarIcon w={6} />
                  Home
                </Link>

                <Link
                  mb={{ base: '7', md: '10' }}
                  onClick={handleLinkClick}
                  display="flex"
                  gap="2"
                  alignItems="center"
                  href="/clubs"
                >
                  <AtSignIcon w={6} />
                  Clubs
                </Link>
                <Link
                  mb={{ base: '7', md: '10' }}
                  onClick={handleLinkClick}
                  display="flex"
                  gap="2"
                  alignItems="center"
                  href="/clubs/club-registration"
                >
                  <AtSignIcon w={6} />
                  Register club
                </Link>
                <Link
                  mb={{ base: '7', md: '10' }}
                  onClick={handleLinkClick}
                  href="/account/payment-methods"
                  display="flex"
                  gap="2"
                  alignItems="center"
                >
                  <AtSignIcon w={6} />
                  Payment Methods
                </Link>
                <Button
                  fontSize="lg"
                  variant="unstyled"
                  onClick={toggleColorMode}
                  leftIcon={<ColorModeIcon w={6} />}
                >
                  {colorMode === 'light' ? 'Dark' : 'Light'} mode
                </Button>
              </Flex>
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
