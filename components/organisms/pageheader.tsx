import { useRouter } from 'next/router';
import { Button } from '@components/atoms/button';
import { Heading } from '../atoms/typography/heading';
import { Box } from '@components/atoms/box';
import { ReactElement } from 'react';
import { Grid } from '@chakra-ui/react'; // TODO: wrap in a component
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
    <Box bgColor={backgroundColor}>
      <Grid templateColumns={secondaryAction ? '3' : '2'}>
        <Button
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
        {secondaryAction ? { secondaryAction } : null}
      </Grid>
      <Flex justifyContent="center">
        {image ? { image } : null}
        {subHeading ? <Heading as="h4">{subHeading}</Heading> : null}
      </Flex>
    </Box>
  );
}
