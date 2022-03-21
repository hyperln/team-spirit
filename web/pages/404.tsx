import { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { cmsFactory } from '@lib/cms/cms';
import { CMSContentType, Page } from '@lib/cms/cms-types';
import { getSecondsByTimeUnit } from '@utils/time';
import { useContentSubscribe } from '@hooks/use-subscribe';
import dynamic from 'next/dynamic';
import { useColorMode } from '@hooks/use-color-mode';
import { useLayoutData } from '@hooks/use-layout-data';
import { Themes } from '@state/theme-types';
import withTransition from '@hoc/with-transition';

const Templates = {
  default: dynamic(() =>
    import('@components/templates/dynamic-pages/dynamic-page-template'),
  ),
};

type Props = {
  page: Page;
  preview?: boolean;
  previewData?: {
    token: string;
  };
};

function NotFound({
  page,
  preview,
  previewData,
  ...props
}: Props): ReactElement {
  const { setColorMode } = useColorMode();
  const layout = useLayoutData();
  useEffect(() => {
    setColorMode(page.settings.darkTheme ? Themes.dark : Themes.light);
  }, []);

  const content = (useContentSubscribe({
    initialData: page,
    contentType: CMSContentType.page,
    id: page.id,
    preview,
    token: previewData?.token,
  }) as unknown) as Page;

  const PageTemplate =
    Templates[content.settings.pageTemplate] || Templates.default;

  return (
    <div className="container">
      <Head>
        <title>
          {content.title} | {layout.header.title}
        </title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>

      <PageTemplate {...page} {...props} content={content} />
    </div>
  );
}

export default withTransition(NotFound);

export const getStaticProps: GetStaticProps = async (context) => {
  const { preview = false, previewData = null } = context;
  const cms = cmsFactory({ preview });
  const page = (await cms.query({
    type: CMSContentType.page,
    slug: '404',
  })) as Page;

  return {
    props: {
      preview,
      previewData,
      page: page || null,
    },
    revalidate: getSecondsByTimeUnit('day'),
  };
};
