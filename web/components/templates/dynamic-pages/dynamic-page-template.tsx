/* eslint-disable react/destructuring-assignment */
/* Disabled because props should just be passed down to the correct template */
import dynamic from 'next/dynamic';
import { Center } from '@components/atoms/layout';

const DynamicPages = {
  landingPage: dynamic(() =>
    import('@components/templates/dynamic-pages/pagebuilder-template'),
  ),
  articleListingPage: dynamic(() =>
    import('@components/templates/dynamic-pages/pagebuilder-template'),
  ),
  signInUpPage: dynamic(() =>
    import('@components/templates/dynamic-pages/sign-in-page-template'),
  ),
  accountPage: dynamic(() =>
    import('@components/templates/dynamic-pages/account-page-template'),
  ),
};

function NotSupported() {
  return process.env.NODE_ENV !== 'production' ? (
    <Center h="350px">
      This template is not supported. Please contact your developer
    </Center>
  ) : null;
}

type Props = {
  settings: {
    pageTemplate: string;
    [key: string]: any;
  };
  [key: string]: any;
};

export function DynamicPageTemplate(props: Props) {
  const DynamicPage = DynamicPages[props.settings.pageTemplate] || NotSupported;

  return <DynamicPage {...props} />;
}

export default DynamicPageTemplate;
