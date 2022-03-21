import { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { cmsFactory } from '@lib/cms/cms';
import { CMSContentType, Page } from '@lib/cms/cms-types';
import { getSecondsByTimeUnit } from '@utils/time';
import { useContentSubscribe } from '@hooks/use-subscribe';
import { useColorMode } from '@hooks/use-color-mode';
import { useLayoutData } from '@hooks/use-layout-data';
import { Themes } from '@state/theme-types';
import PagebuilderTemplate from '@components/templates/dynamic-pages/pagebuilder-template';
import withTransition from '@hoc/with-transition';

type Props = {
  page: Page;
  preview: boolean;
  previewData: {
    token: string;
  };
};

function Home({ page, preview, previewData }: Props): ReactElement {
  const { setColorMode } = useColorMode();
  const layout = useLayoutData();
  const content = (useContentSubscribe({
    initialData: page,
    contentType: CMSContentType.page,
    id: page.id,
    preview,
    token: previewData?.token,
  }) as unknown) as Page;
  useEffect(() => {
    setColorMode(page.settings.darkTheme ? Themes.dark : Themes.light);
  }, []);
  return (
    <>
      <Head>
        <title>
          {content.title} | {layout.header.title}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PagebuilderTemplate content={content} />
    </>
  );
}

export default withTransition(Home);

export const getStaticProps: GetStaticProps = async (context) => {
  const { preview = false, previewData = null } = context;
  const cms = cmsFactory({ preview });
  const page = (await cms.query({
    type: CMSContentType.page,
    slug: 'index',
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
