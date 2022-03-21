import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box } from '@components/atoms/box';
import { IconButton } from '@components/atoms/button/button';
import { Link } from '@components/atoms/link/link';

type Props = {
  totalPages: number;
  currentPage: number;
  pageUrl: string;
};

export function Pagination({ totalPages, currentPage, pageUrl }: Props) {
  return (
    <Box justifyContent="center" w="100%" d="flex">
      <Box alignItems="center" d="flex" gridGap="8">
        <IconButton
          disabled={currentPage === 1}
          as={Link}
          aria-label="Previous page"
          icon={<ChevronLeftIcon w={8} h={8} />}
          href={`${pageUrl}/${
            currentPage === 1 ? currentPage : currentPage - 1
          }`}
        />
        <Box d="flex" gridGap="4">
          <Link href={`${pageUrl}/1`}>
            <Box
              _hover={{
                color: 'white',
                bgColor: 'brand.400',
              }}
              color={currentPage === 1 ? 'white' : null}
              borderRadius="sm"
              py="1"
              px="2"
              bgColor={currentPage === 1 ? 'brand.100' : null}
            >
              1
            </Box>
          </Link>

          {currentPage > 2 ? '...' : null}

          {currentPage > 1 && currentPage < totalPages ? (
            <Link href={`${pageUrl}/${currentPage}`}>
              <Box
                _hover={{
                  color: 'white',
                  bgColor: 'brand.400',
                }}
                color="white"
                borderRadius="sm"
                py="1"
                px="2"
                bgColor="brand.100"
              >
                {currentPage}
              </Box>
            </Link>
          ) : null}

          {currentPage < totalPages - 1 ? '...' : null}

          <Link href={`${pageUrl}/${totalPages}`}>
            <Box
              _hover={{
                color: 'white',
                bgColor: 'brand.400',
              }}
              color={currentPage === totalPages ? 'white' : null}
              borderRadius="sm"
              py="1"
              px="2"
              bgColor={currentPage === totalPages ? 'brand.100' : null}
            >
              {totalPages}
            </Box>
          </Link>
        </Box>
        <IconButton
          as={Link}
          aria-label="Next page"
          icon={<ChevronRightIcon w={8} h={8} />}
          href={`${pageUrl}/${
            currentPage === totalPages ? totalPages : currentPage + 1
          }`}
        />
      </Box>
    </Box>
  );
}
