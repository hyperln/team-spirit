import { format } from 'date-fns';
import { Box } from '@components/atoms/box';
import { Text } from '@components/atoms/typography/text';
import { BackLink } from '@components/molecules/navigation/back-link';
import { Page } from '@lib/cms/cms-types';
import { Sections } from '@components/templates/sections';

type Props = {
  content: Page;
};

export default function PagebuilderTemplate({ content, ...props }: Props) {
  return (
    <main>
      <Box pad={{ vertical: 'medium' }}>
        {content.settings.breadcrumbs && content.parentPage ? (
          <BackLink href={content.parentPage.slug}>
            {content.parentPage.title}
          </BackLink>
        ) : null}
      </Box>
      <Box>
        {content.settings.showLastUpdated ? (
          <Text fontSize="sm" align="center" color="gray.500">
            Last updated {format(new Date(content.updatedAt), 'MMMM d, y')}
          </Text>
        ) : null}
      </Box>
      <Sections {...props} {...content} sections={content.sections} />
    </main>
  );
}
