import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Navigation } from '@components/organisms/navigation';

export function Layout({ children }) {
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
      >
        <Navigation />
      </Flex>
      <Box
        minH="calc(100vh - 80px)"
        mb={{ base: '20', lg: undefined }}
        mt={{ lg: '20' }}
      >
        {children}
      </Box>
    </Box>
  );
}
