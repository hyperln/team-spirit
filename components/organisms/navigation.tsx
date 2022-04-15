import {
  AtSignIcon,
  HamburgerIcon,
  LockIcon,
  StarIcon,
} from '@chakra-ui/icons';
import { DrawerCloseButton } from '@chakra-ui/react';
import { Button, IconButton } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';
import { Avatar } from '@components/molecules/avatar-image';
import { Menu, MenuItem, MenuGroup } from '@components/organisms/menu';
import { useAuth } from '@hooks/use-auth';
import { useDisclosure } from '@hooks/use-disclosure';
import { useProfile } from '@hooks/use-profile';
import { useState } from 'react';
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from './drawer';

export function Navigation() {
  const { profile } = useProfile();
  const { signOut } = useAuth();

  const [size, setSize] = useState('full');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };

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
          alignItems="center"
          fontSize="lg"
          bgGradient="linear(brand.900 10%, brand.600 60%)"
        >
          <DrawerCloseButton />
          <DrawerBody>
            <MenuGroup
              pt="2"
              pb="2"
              title={`Welcome${
                profile?.firstName ? `, ${profile.firstName}` : ''
              }`}
            >
              <MenuItem
                pt="2"
                pb="2"
                as={Link}
                href="/account"
                onClick={onClose}
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
                pt="2"
                pb="2"
                as={Link}
                href="/"
                icon={<StarIcon w={6} />}
                onClick={onClose}
              >
                Home
              </MenuItem>
              <MenuItem
                pt="2"
                pb="2"
                as={Link}
                href="/clubs"
                icon={<StarIcon w={6} />}
                onClick={onClose}
              >
                Clubs
              </MenuItem>
              <MenuItem
                pt="2"
                pb="2"
                onClick={signOut}
                icon={<LockIcon w={6} />}
              >
                Log out
              </MenuItem>
            </MenuGroup>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Menu>
  );
}
