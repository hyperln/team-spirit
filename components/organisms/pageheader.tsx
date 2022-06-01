import { useRouter } from 'next/router';
import { Button } from '@components/atoms/button';
import { Heading } from '../atoms/typography/heading';
import { Box } from '@components/atoms/box';
import { ReactElement } from 'react';
import { Grid, SimpleGrid } from '@chakra-ui/react'; // TODO: wrap in a component
import { Flex } from '@components/atoms/flex';
import { getContrastingTextColor } from '@utils/color-utils';
import { GridItem } from '@components/atoms/grid';

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
  backgroundColor = 'brand',
}: Props) {
  const router = useRouter();

  return (
    <Box
      color={getContrastingTextColor(backgroundColor, 'brand', 'white')}
      w="full"
      bgColor={backgroundColor}
    >
      <Grid w="full" templateColumns="repeat(5, 1fr)">
        <GridItem colSpan={1}>
          <Button
            mx="1"
            alignItems="flex-start"
            outline="0"
            _focus={{ boxShadow: '0 0 0 0px' }}
            display={{ lg: 'none' }}
            // textColor={backgroundColor === 'white' ? 'brand' : backgroundColor}
            color={getContrastingTextColor(backgroundColor, 'brand', 'white')}
            variant="unstyled"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </GridItem>
        <GridItem colSpan={3}>
          {typeof title === 'string' ? (
            <Heading
            color={getContrastingTextColor(backgroundColor, 'black', 'white')}
              textAlign="center"
            >
              {title}
            </Heading>
          ) : (
            title
          )}
        </GridItem>
        <GridItem
          mx="1"
          // color={backgroundColor === 'white' ? 'brand' : backgroundColor}
          color={getContrastingTextColor(backgroundColor, 'brand', 'white')}
          display="flex"
          justifyContent="flex-end"
          colSpan={1}
        >
          {secondaryAction ? secondaryAction : null}
        </GridItem>
      </Grid>
      <Flex justifyContent="center">
        {image ? image : null}
        {subHeading ? <Heading as="h4">{subHeading}</Heading> : null}
      </Flex>
    </Box>
  );
}
