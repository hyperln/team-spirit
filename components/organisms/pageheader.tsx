import { useRouter } from 'next/router';
import { Button } from '@components/atoms/button';
import { Heading } from '../atoms/typography/heading';
import { Box } from '@components/atoms/box';
import { ReactElement } from 'react';
import { Grid, SimpleGrid } from '@chakra-ui/react'; // TODO: wrap in a component
import { Flex } from '@components/atoms/flex';

interface Props {
  title?: string | ReactElement | ReactElement[];
  secondaryAction?: ReactElement | ReactElement[];
  image?: ReactElement | ReactElement[];
  subHeading?: string | ReactElement | ReactElement[];
  backgroundColor?: string;
}

export function PageHeader({
  title,
  secondaryAction,
  image,
  subHeading,
  backgroundColor,
}: Props) {
  const router = useRouter();

  return (
    <Box mt="2" w="full" bgColor={backgroundColor}>
      <SimpleGrid
        grid-template-rows=" [row1-start] 25% [row1-end] 50% [third-line] 25%"
        justifyItems="space-between"
        w="full"
        columns={secondaryAction ? 3 : 2}
      >
        <Button
          mx="auto"
          left="-10"
          // px="auto"
          // justifyContent="flex-start"

          alignItems="left"
          outline="0"
          _focus={{ boxShadow: '0 0 0 0px' }}
          display={{ lg: 'none' }}
          textColor="brand"
          variant="unstyled"
          aria-label="Back"
          onClick={() => router.back()}
        >
          Back
        </Button>
        {typeof title === 'string' ? <Heading>{title}</Heading> : { title }}
        {secondaryAction ? secondaryAction : null}
      </SimpleGrid>
      <Flex justifyContent="center">
        {image ? image : null}
        {subHeading ? <Heading as="h4">{subHeading}</Heading> : null}
      </Flex>
    </Box>
  );
}
