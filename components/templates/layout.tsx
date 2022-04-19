import { useRouter } from 'next/router';
import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Navigation } from '@components/organisms/navigation';
import { IconButton } from '@components/atoms/button';
import { ArrowBackIcon } from '@chakra-ui/icons';

export function Layout({ children }) {
  const router = useRouter();
  return (
    <Box>
      <Flex
        position="fixed"
        zIndex="dropdown"
        bottom={{ base: '0', lg: undefined }}
        top={{ lg: '0' }}
        justifyContent={{ base: 'center', lg: 'right' }}
        alignItems="center"
        w="full"
        h="20"
        bgColor="red.500"
      >
        <Navigation />
      </Flex>
      <Box m="2" display={{ lg: 'none' }}>
        <IconButton
          variant="unstyled"
          aria-label="Back"
          onClick={() => router.back()}
          icon={<ArrowBackIcon />}
        />
      </Box>
      <Box
        minH="calc(100vh - 80px)"
        mb={{ base: '20', lg: undefined }}
        mt={{ base: '12', lg: '20' }}
      >
        {children}
      </Box>
    </Box>
  );
}
