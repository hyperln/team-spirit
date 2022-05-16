import { ComponentProps } from 'react';
import NextLink from 'next/link';
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem as ChakraBreadcrumbItem,
  BreadcrumbLink as ChakraBreadcrumbLink,
  BreadcrumbSeparator as ChakraBreadcrumbSeparator,
} from '@chakra-ui/react';

export const Breadcrumb = ChakraBreadcrumb;
export const BreadcrumbItem = ChakraBreadcrumbItem;
export const BreadcrumbSeparator = ChakraBreadcrumbSeparator;

type Props = ComponentProps<typeof ChakraBreadcrumbLink> &
  ComponentProps<typeof NextLink>;

export function BreadcrumbLink({ href, children, ...props }: Props) {
  return (
    <NextLink href={href} passHref>
      <ChakraBreadcrumbLink {...props}>{children}</ChakraBreadcrumbLink>
    </NextLink>
  );
}
