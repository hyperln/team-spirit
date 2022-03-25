import SVG from 'react-inlinesvg';
import { ReactElement, ReactText } from 'react';
import { Icon as ChakraIcon } from '@chakra-ui/react';

type Props = {
  src: string;
  height?: ReactText;
  width?: ReactText;
};

export function Icon({ src, height = 50, width = 50 }: Props): ReactElement {
  return <SVG width={width} height={height} src={src} />;
}

export const IconWrapper = ChakraIcon;
