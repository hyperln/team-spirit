import { Box } from '@components/atoms/box';
import { Text } from '@components/atoms/typography/text';
import { Link } from '@components/atoms/link/link';
import { Image } from '@components/atoms/image/image';
import { Center } from '@components/atoms/layout';
import { SimpleGrid } from '@components/atoms/grid';
import { List, ListItem } from '@components/atoms/list';
import { Heading } from '@components/atoms/typography/heading';
import {
  CMSFooter,
  NavigationItem,
  NavigationSection,
} from '@lib/cms/cms-types';
import { cmsFactory } from '@lib/cms/cms';
import { BlockContent } from '@components/molecules/block-content/block-content';

type Props = CMSFooter;

function NavListItem({ link, text, kind }: NavigationItem) {
  const href = link.slug
    ? `/${link.slug}`
    : link.anchorLink
    ? link.anchorLink
    : '/';
  return (
    <ListItem py="1">
      <Text
        color={kind === 'button' ? 'white' : 'footer.linkItem'}
        as="b"
        fontSize="xl"
        fontWeight="normal"
      >
        <Link
          backgroundColor={kind === 'button' ? 'gray.500' : null}
          _hover={
            kind === 'button'
              ? { color: 'white', backgroundColor: 'link', cursor: 'pointer' }
              : null
          }
          href={href}
        >
          {text}
        </Link>
      </Text>
    </ListItem>
  );
}

type NavSectionProps = NavigationSection;

function NavSection({ title, items }: NavSectionProps) {
  return (
    <Box>
      <Heading color="footer.title" size="lg" as="h4">
        <Text casing="uppercase">{title}</Text>
      </Heading>
      <List pt="8">
        {items?.map((navItem) => (
          <NavListItem key={navItem._key} {...navItem} />
        ))}
      </List>
    </Box>
  );
}

function NavItem({ link, text, kind, icon }: NavigationItem) {
  const href =
    link.slug && !link.anchorLink
      ? `/${link.slug}`
      : link.slug && link.anchorLink
      ? `/${link.slug}${link.anchorLink}`
      : link.anchorLink
      ? link.anchorLink
      : link.href;
  return (
    <Box py="12">
      <Text
        color={kind === 'button' ? 'white' : 'footer.linkItem'}
        as="b"
        fontSize="xl"
        fontWeight="normal"
      >
        <Link
          isExternal={!link.slug && !link.anchorLink}
          backgroundColor={kind === 'button' ? 'gray.500' : null}
          _hover={
            kind === 'button'
              ? { color: 'white', backgroundColor: 'link', cursor: 'pointer' }
              : null
          }
          href={href}
        >
          {text}
          {icon ? (
            <Center>
              <Image
                alt={icon.alt}
                src={cmsFactory({}).getUrlForImage(icon.asset).url()}
              />
            </Center>
          ) : null}
        </Link>
      </Text>
    </Box>
  );
}

export function Footer({ nav, copyright, notes }: Props) {
  return (
    <footer>
      <Box width="100%" py="24" backgroundColor="footer.background">
        <Center>
          <SimpleGrid columns={[1, null, 3]} spacing="20">
            {nav?.items?.map((item) =>
              item._type === 'navSection' ? (
                <NavSection
                  key={(item as NavigationSection)._key}
                  {...(item as NavigationSection)}
                />
              ) : (
                <NavItem
                  key={(item as NavigationSection)._key}
                  {...(item as NavigationItem)}
                />
              ),
            )}
          </SimpleGrid>
        </Center>
        <Center pt="36">
          <Box color="footer.copyright" maxW="6xl" textAlign="center">
            {notes ? <BlockContent blocks={notes} /> : null}
          </Box>
        </Center>
        <Box pt="8">
          <Text color="footer.copyright" textAlign="center">
            &copy; Copyright {new Date().getFullYear()} {copyright}
          </Text>
        </Box>
      </Box>
    </footer>
  );
}
