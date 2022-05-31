import { useRouter } from 'next/router';
import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Navigation } from '@components/organisms/navigation';
import { AtSignIcon, LockIcon } from '@chakra-ui/icons';
import { kebabToSentenceCase } from '@utils/string-utils';
import { useColorModeValue } from '@hooks/use-color-mode';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@components/organisms/menu';
import { useProfile } from '@hooks/use-profile';
import { Avatar } from '@components/molecules/avatar-image';
import { Link } from '@components/atoms/link';
import { useAuth } from '@hooks/use-auth';
import { Spacer } from '@components/atoms/spacer';
import { Button } from '@components/atoms/button';
import { PageHeader } from '@components/organisms/pageheader';

function buildBreadcrumbs(path) {
  const parts = path.split('/').filter(Boolean);
  const breadcrumbs = [];
  let pathname = '/';

  for (const part of parts) {
    pathname += `${part.split('?')[0]}/`;
    breadcrumbs.push({
      name: kebabToSentenceCase(part.split('?')[0]),
      path: pathname,
    });
  }

  return breadcrumbs;
}

export function Layout({ children }) {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const router = useRouter();
  const breadcrumbs = buildBreadcrumbs(router.asPath);
  const navBackground = useColorModeValue('brand', 'blackAlpha.300');

  const handlClickLogout = () => {
    signOut();
  };

  return (
    <Box>
      <Flex
        bg={navBackground}
        position="fixed"
        zIndex="dropdown"
        bottom={{ base: '0', lg: undefined }}
        top={{ lg: '0' }}
        justifyContent={{ base: 'right', lg: 'right' }}
        alignItems="center"
        w="full"
        h="14"
      >
        <Menu closeOnSelect>
          <MenuButton ml="1">
            {profile ? (
              <Avatar
                left="5"
                size="md"
                src={profile.previewUrl}
                name={profile.firstName}
              />
            ) : (
              <AtSignIcon boxSize="6" w={6} />
            )}
          </MenuButton>
          <MenuList bgColor={navBackground}>
            <MenuItem gap="2" as={Link} href="/account">
              {profile ? (
                <Avatar
                  size="xs"
                  src={profile.previewUrl}
                  name={profile.firstName}
                />
              ) : (
                <AtSignIcon boxSize="5" w={6} mr="1" />
              )}
              Profile
            </MenuItem>

            {profile ? (
              <MenuItem
                icon={<LockIcon w={6} mr="-1" />}
                onClick={handlClickLogout}
              >
                Log Out
              </MenuItem>
            ) : (
              <MenuItem
                icon={<LockIcon w={6} mr="-1" />}
                as={Link}
                href="/login"
              >
                Sign In
              </MenuItem>
            )}
          </MenuList>
        </Menu>
        <Spacer />
        <Navigation />
      </Flex>

      {router.asPath !== '/' ? (
        <Flex
          position="absolute"
          boxShadow="2xl"
          rounded="md"
          alignItems="center"
          mx="3"
          my={{ base: 5, lg: '20' }}
        >
          {/* <PageHeader props={'Title'} /> */}
          {/* <Button
            outline="0"
            _focus={{ boxShadow: '0 0 0 0px' }}
            display={{ lg: 'none' }}
            textColor="brand"
            variant="unstyled"
            aria-label="Back"
            onClick={() => router.back()}
          >
            Back
          </Button> */}
        </Flex>
      ) : null}
      <Box
        minH={{
          base: 'calc(100vh - 180px)',
          lg: 'calc(100vh - 80px)',
        }}
        mb={{ base: '20', lg: undefined }}
        mt={{ base: '0', lg: '20' }}
      >
        {children}
      </Box>
    </Box>
  );
}
