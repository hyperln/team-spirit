import { ImageProps } from '@chakra-ui/react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { Box } from '@components/atoms/box';

export function Image({
  src,
  priority,
  blurDataURL,
  placeholder,
  alt,
  layout = 'responsive',
  ...props
}: ImageProps & Omit<NextImageProps, 'height' | 'width'>) {
  return (
    <Box
      h={props.h}
      w={props.w}
      height={props.height}
      width={props.width}
      borderRadius={props.borderRadius}
      overflow="hidden"
    >
      <NextImage
        alt={alt}
        blurDataURL={blurDataURL}
        placeholder={placeholder}
        priority={priority}
        quality="100"
        height={props.htmlHeight}
        width={props.htmlWidth}
        layout={layout}
        src={src}
      />
    </Box>
  );
}
