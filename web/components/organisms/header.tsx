import { Spacer } from '@components/atoms/spacer';
import { Flex } from '@components/atoms/flex';
import { Box } from '@components/atoms/box';
import { Link } from '@components/atoms/link/link';
import { Image } from '@components/atoms/image/image';
import { CMSHeader, Navigation, NavigationItem } from '@lib/cms/cms-types';
import { cmsFactory } from '@lib/cms/cms';
import { Text } from '@components/atoms/typography/text';
import { useRouter } from 'next/router';
import { Center } from '@components/atoms/layout';
import { Heading } from '@components/atoms/typography/heading';
import { useMediaQuery } from '@hooks/use-media-query';
import { IconButton } from '@components/atoms/button/button';
import { useRef } from 'react';
import { useDisclosure } from '@hooks/use-disclosure';
import { Icon } from '@components/atoms/icon/icon';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
} from './drawer';

type Props = CMSHeader;

function NavItem({ link, text, kind }: NavigationItem) {
  const router = useRouter();
  const [isSmallScreen] = useMediaQuery('(max-width: 800px)');
  const href = (link.slug && `/${link.slug}`) || link.anchorLink || '/';
  const active = href === router.asPath;
  return (
    <Box>
      <Text
        color={
          kind === 'button'
            ? 'white'
            : active
            ? 'header.activeLinkItem'
            : 'header.linkItem'
        }
        as="b"
        casing="uppercase"
        fontSize={isSmallScreen ? 'lg' : 'sm'}
      >
        <Link
          isExternal={!link.slug && !link.anchorLink}
          borderRadius="sm"
          mx="1"
          px="5"
          py="3"
          backgroundColor={kind === 'button' ? 'gray.500' : null}
          _hover={
            kind === 'button'
              ? { color: 'white', backgroundColor: 'link', cursor: 'pointer' }
              : null
          }
          href={href}
        >
          {text}
        </Link>
      </Text>
    </Box>
  );
}

type NavProps = {
  primaryNav: Navigation;
  secondaryNav?: Navigation;
};

function MobileNav({ primaryNav, secondaryNav }: NavProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const btnRef = useRef();
  return (
    <>
      <IconButton
        aria-label="Toggle Menu"
        icon={<Icon src="/icons/menu.svg" />}
        ref={btnRef}
        onClick={onToggle}
        variant="unstyled"
        h="50px"
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <Box
              mt="28"
              gridGap="5"
              d="flex"
              flexDirection="column"
              alignItems="center"
            >
              {primaryNav.items.map((navItem) => (
                <NavItem key={navItem._key} {...navItem} />
              ))}
            </Box>
            <Box
              mt="20"
              gridGap="5"
              d="flex"
              flexDirection="column"
              alignItems="center"
            >
              {secondaryNav?.items?.map((navItem) => (
                <NavItem key={navItem._key} {...navItem} />
              ))}
            </Box>
          </DrawerBody>

          <DrawerFooter>Hej</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function Nav({ primaryNav, secondaryNav }: NavProps) {
  return (
    <>
      <Box gridGap="2" pr="8" d="flex">
        {primaryNav.items.map((navItem) => (
          <NavItem key={navItem._key} {...navItem} />
        ))}
      </Box>
      <Box gridGap="2" pr="8" d="flex">
        {secondaryNav?.items?.map((navItem) => (
          <NavItem key={navItem._key} {...navItem} />
        ))}
      </Box>
    </>
  );
}

export function Header({ logo, primaryNav, secondaryNav, title }: Props) {
  const [isSmallScreen] = useMediaQuery('(max-width: 800px)');
  return (
    <Box
      width="full"
      position="sticky"
      top="0"
      boxShadow="base"
      pt="2"
      pb="2"
      pl="2"
      backgroundColor="header.background"
    >
      <Flex>
        <Box pl="2">
          <Link href="/">
            <Box gridGap="3" alignItems="center" d="flex">
              {logo ? (
                <Image
                  alt={logo.alt}
                  src={cmsFactory({})
                    .getUrlForImage(logo.asset)
                    .height(94)
                    .url()}
                />
              ) : null}
              {title ? (
                <Heading color="header.title" size="md">
                  {title}
                </Heading>
              ) : null}
            </Box>
          </Link>
        </Box>
        <Spacer />
        <Center>
          {isSmallScreen ? (
            <MobileNav primaryNav={primaryNav} secondaryNav={secondaryNav} />
          ) : (
            <Nav primaryNav={primaryNav} secondaryNav={secondaryNav} />
          )}
        </Center>
      </Flex>
    </Box>
  );
}
