import { ReactElement } from 'react';
import { PageSection } from '@lib/cms/cms-types';
import { Section } from '@components/organisms/section/section';
import { Box } from '@components/atoms/box';

type Props = {
  sections: PageSection[];
};

export function Sections({ sections, ...props }: Props): ReactElement {
  return (
    <Box>
      {sections?.map((section) => (
        <Section {...props} key={section.key} section={section} />
      ))}
    </Box>
  );
}
