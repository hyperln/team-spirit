import { useRouter } from 'next/router';
import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Navigation } from '@components/organisms/navigation';
import { IconButton } from '@components/atoms/button';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@components/molecules/breadcrumb';
import { kebabToSentenceCase } from '@utils/string-utils';

function buildBreadcrumbs(path) {
  const parts = path.split('/').filter(Boolean);
  const breadcrumbs = [];
  let pathname = '/';

  for (const part of parts) {
    pathname += `${part}/`;
    breadcrumbs.push({
      name: kebabToSentenceCase(part),
      path: pathname,
    });
  }

  return breadcrumbs;
}

export function Layout({ children }) {
  const router = useRouter();
  const breadcrumbs = buildBreadcrumbs(router.asPath);
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
      <Flex alignItems="center" m="2">
        <IconButton
          display={{ lg: 'none' }}
          variant="unstyled"
          aria-label="Back"
          onClick={() => router.back()}
          icon={<ArrowBackIcon />}
        />
        <Breadcrumb fontSize="sm">
          {router.asPath !== '/' ? (
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          ) : null}
          {breadcrumbs.map((breadcrumb) => (
            <BreadcrumbItem key={breadcrumb.path}>
              <BreadcrumbLink href={breadcrumb.path}>
                {breadcrumb.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </Flex>
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
