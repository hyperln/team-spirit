import { ComponentProps } from 'react';
import NextLink from 'next/link';
import {
  Link as ChakraLink,
  LinkBox as ChakraLinkBox,
  LinkOverlay as ChakraLinkOverlay,
} from '@chakra-ui/react';

type Props = ComponentProps<typeof ChakraLink> &
  ComponentProps<typeof NextLink>;

export function Link({ href, isExternal, children, ...props }: Props) {
  return (
    <NextLink href={href} passHref>
      <ChakraLink {...props} isExternal={isExternal}>
        {children}
      </ChakraLink>
    </NextLink>
  );
}

export const LinkBox = ChakraLinkBox;

export function LinkOverlay({ href, isExternal, children, ...props }: Props) {
  return (
    <NextLink href={href} passHref>
      <ChakraLinkOverlay {...props} isExternal={isExternal}>
        {children}
      </ChakraLinkOverlay>
    </NextLink>
  );
}
