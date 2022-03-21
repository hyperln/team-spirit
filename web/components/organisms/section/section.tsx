import { ComponentType, ReactElement } from 'react';
import { PageSections, PageSection } from '@lib/cms/cms-types';
import { Box } from '@components/atoms/box';
import dynamic from 'next/dynamic';
import { Center } from '@components/atoms/layout';

type Props = {
  section: PageSection;
};

function NotSupported() {
  return process.env.NODE_ENV !== 'production' ? (
    <Center h="350px">
      This section is not supported. Please contact your developer
    </Center>
  ) : null;
}

const Templates = {
  [PageSections.hero]: dynamic(
    () =>
      import('@components/organisms/hero/hero').then(
        (mod) => mod.Hero,
      ) as Promise<ComponentType>,
  ),
  [PageSections.image]: dynamic(
    () =>
      import('@components/templates/sections/image-section-template').then(
        (mod) => mod.ImageSectionTemplate,
      ) as Promise<ComponentType>,
  ),
  [PageSections.textSection]: dynamic(
    () =>
      import('@components/templates/sections/text-section-template').then(
        (mod) => mod.TextSectionTemplate,
      ) as Promise<ComponentType>,
  ),
  [PageSections.cta]: dynamic(
    () =>
      import('@components/templates/sections/cta-section-template').then(
        (mod) => mod.CTASectionTemplate,
      ) as Promise<ComponentType>,
  ),
  [PageSections.listing]: dynamic(
    () =>
      import('@components/templates/sections/listing-section').then(
        (mod) => mod.ListingSection,
      ) as Promise<ComponentType>,
  ),
  default: NotSupported,
};

export function Section({ section, ...props }: Props): ReactElement {
  const SectionTemplate = Templates[section.type] || Templates.default;
  return (
    <Box
      width="full"
      background={
        section.background
          ? { color: section.background.color?.hex || null }
          : null
      }
      id={section.anchor}
    >
      <SectionTemplate {...props} {...section} />
    </Box>
  );
}
