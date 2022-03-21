import { ComponentProps } from 'react';
import SanityBlockContent from '@sanity/block-content-to-react';
import { Box } from '@components/atoms/box';
import {
  CMSImage,
  HorizontalAlignment,
  VerticalAlignment,
} from '@lib/cms/cms-types';
import { Image } from '@components/atoms/image/image';
import { cmsFactory } from '@lib/cms/cms';

type BlockNode = {
  language?: string;
  code?: string;
  asset?: CMSImage;
  alt?: string;
};

type Block = {
  node: BlockNode;
};

type Props = {
  verticalAlignment?: VerticalAlignment;
  horizontalAlignment?: HorizontalAlignment;
  blocks: Block[] | any[];
};

type BoxProps = ComponentProps<typeof Box>;

const serializers = {
  types: {
    code: ({ node }: Block) => (
      <pre data-language={node.language}>
        <code>{node.code}</code>
      </pre>
    ),
    imageAlt: ({ node }: Block) => (
      <Image
        py="2"
        display="inline-block"
        src={cmsFactory({}).getUrlForImage(node.asset).url()}
        alt={node.alt}
      />
    ),
  },
};

const getHorizontalAlignment = (
  horizontalAlignment: HorizontalAlignment,
): BoxProps['alignContent'] => {
  const alignments = {
    left: 'start',
    center: 'center',
    right: 'end',
    baseline: 'baseline',
    stretch: 'stretch',
  };
  return alignments[horizontalAlignment] as BoxProps['align'];
};

const getVerticalAlignment = (
  verticalAlignment: VerticalAlignment,
): BoxProps['justifyContent'] => {
  const alignments = {
    left: 'start',
    middle: 'center',
    right: 'end',
    baseline: 'baseline',
    between: 'between',
    stretch: 'stretch',
    around: 'around',
    evenly: 'evenly',
  };
  return alignments[verticalAlignment] as BoxProps['justify'];
};

export function BlockContent({
  horizontalAlignment = 'left',
  verticalAlignment = 'top',
  blocks,
}: Props) {
  return (
    <Box
      justifyContent={getVerticalAlignment(verticalAlignment)}
      alignContent={getHorizontalAlignment(horizontalAlignment)}
    >
      <SanityBlockContent blocks={blocks} serializers={serializers} />
    </Box>
  );
}
