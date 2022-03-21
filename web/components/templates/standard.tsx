import { memo, ReactElement } from 'react';
import { Box } from '@components/atoms/box';
import { Header } from '@components/organisms/header';
import { withComingSoonMode } from '@hoc/with-coming-soon-mode';
import { Footer } from '@components/organisms/footer';
import { CMSFooter, CMSHeader } from '@lib/cms/cms-types';
import { useLayoutData } from '@hooks/use-layout-data';
import { CookieConsent } from '@components/organisms/cookie-consent';

type Props = {
  children?: ReactElement | ReactElement[] | string;
};

export const StandardLayout = memo(
  withComingSoonMode(
    ({ children }: Props): ReactElement => {
      const layout = useLayoutData();
      return (
        <>
          <Box d="flex" minH="100vh" flexDirection="column">
            <Header {...((layout.header as unknown) as CMSHeader)} />
            <Box flex="1">{children}</Box>
            <Footer
              {...((layout.footer as unknown) /* convert to unknown because TS freaks out over blockcontent */ as CMSFooter)}
            />
          </Box>
          {layout?.cookieConsent?.showCookieConsent ? <CookieConsent /> : null}
        </>
      );
    },
  ),
);
